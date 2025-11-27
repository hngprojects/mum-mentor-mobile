import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/src/core/services/authContext";
import { useSetup } from "../../core/hooks/setupContext";
import { colors, spacing, typography } from "@/src/core/styles";
import { ms, vs, rfs } from "@/src/core/styles/scaling";
import { showToast } from "@/src/core/utils/toast";
// ✅ FIXED: ChildData interface is correctly imported here
import ChildSetupItem, { ChildData } from "../components/ChildSetupItem";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { SuccessModal, useSuccessModal } from "../components/SuccessModal";
import { completeSetupFlow } from "../../core/services/setupService";
import { getProfileSetup } from "../../core/services/profileSetup.service";

const ChildSetupScreen: React.FC = () => {
  const { user, isSessionLoading } = useAuth();
  const { momSetupData } = useSetup();
  const [children, setChildren] = useState<ChildData[]>([{ fullName: "", age: "", dob: "", gender: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const { visible, show, hide } = useSuccessModal();
  
  // ✅ STATE: Flag to ignore the initial state flicker
  const [isNavigatingFromSetup, setIsNavigatingFromSetup] = useState(true);

  // Set the flag to false after a brief moment to allow the context to settle
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsNavigatingFromSetup(false);
        console.log("[ChildSetup] Initial navigation buffer complete (500ms).");
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  // Check session and redirect if setup already exists or session is invalid
  useEffect(() => {
    // 1. Always wait for the context to finish its main check OR the buffer period to end.
    if (isSessionLoading || isNavigatingFromSetup) {
        // 📢 AGGRESSIVE LOG: Track the waiting state
        console.log(`[ChildSetup Guard] WAITING. Loading: ${isSessionLoading ? 'TRUE' : 'FALSE'}, Buffer: ${isNavigatingFromSetup ? 'TRUE' : 'FALSE'}.`);
        return; 
    }

    // --- REDIRECT GUARDS ---
    
    // 2. CRITICAL CHECK: User session is NULL AND MomData is NULL (Go back to Auth/Login)
    if (!user && !momSetupData) { 
        // 📢 CRITICAL LOG: This is the most likely failure point
        console.error(`[ChildSetup Guard] REDIRECT: CRITICAL FAILURE. User: NULL, MomData: NULL. Redirecting to LOGIN.`);
        router.replace("/(auth)/SignInScreen");
        return;
    }
    
    // 3. FLOW CHECK: User is VALID, but Mom data is missing (Go back to Mom setup)
    if (user && !momSetupData) {
        console.warn("[ChildSetup Guard] REDIRECT: FLOW BREAK. User is VALID but MomData is MISSING. Redirecting to Mum setup.");
        router.replace("/setup/Mum"); 
        return;
    }
    
    // 4. EDGE CASE CHECK: User session LOST but Mom data exists (Go back to Login - This is the silent logout)
    if (!user && momSetupData) {
        // 📢 CRITICAL LOG: This captures the silent session failure
        console.error("[ChildSetup Guard] REDIRECT: SESSION LOST. User is NULL but MomData EXISTS. Redirecting to LOGIN.");
        router.replace("/(auth)/SignInScreen");
        return;
    }

    // 5. Normal execution: Check if profile setup is already complete 
    (async () => {
      try {
        const profile = await getProfileSetup();
        if (profile?.id) {
            console.log("[ChildSetup] Profile already exists. Redirecting to Home.");
            router.replace("/(tabs)/Home"); 
        }
      } catch (err) {
        // This is expected if the profile doesn't exist yet (i.e., this is the first time running setup)
        console.log("[ChildSetup] Profile not found or error fetching (expected during setup), proceeding.");
      }
    })();
  }, [user, isSessionLoading, momSetupData, isNavigatingFromSetup]); 
  
  // ... rest of the component remains the same (handleDone, render, etc.)
  
  const addChild = useCallback(() => {
    setChildren(prev => [...prev, { fullName: "", age: "", dob: "", gender: "" }]);
  }, []);

  const updateChild = useCallback((index: number, updatedChild: ChildData) => {
    setChildren(prev => prev.map((c, i) => (i === index ? updatedChild : c)));
  }, []);

  const removeChild = useCallback((index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  }, []);

  const canceled = useCallback(() => {
    Alert.alert("Cancel Setup", "Are you sure you want to cancel? Your progress will be lost.", [
      { text: "No", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => router.back() },
    ]);
  }, []);

  const areAllFilledChildrenComplete = useCallback(() => {
    const filled = children.filter(child => child.fullName || child.age || child.dob || child.gender);
    return filled.every(child => child.fullName && child.age && child.dob && child.gender);
  }, [children]);

  const getCompleteChildren = useCallback(() => {
    return children.filter(child => child.fullName && child.age && child.dob && child.gender);
  }, [children]);

  const canSubmit = useCallback(() => {
    return !!momSetupData && areAllFilledChildrenComplete() && !!user && !isSessionLoading;
  }, [momSetupData, areAllFilledChildrenComplete, user, isSessionLoading]);

  const handleDone = async () => {
    if (!user) {
      Alert.alert("Authentication Error", "User session not found. Please log in again.");
      router.replace("/(auth)/SignInScreen");
      return;
    }

    if (!momSetupData) {
      showToast.error("Error", "Mom setup data is missing. Complete mom setup first.");
      router.back();
      return;
    }

    if (!areAllFilledChildrenComplete()) {
      Alert.alert("Incomplete Form", "Please complete all child details or remove partial entries.");
      return;
    }

    const childrenForAPI = getCompleteChildren().map(c => ({
      fullName: c.fullName,
      dob: c.dob,
      gender: c.gender.toLowerCase() as "male" | "female" | "other",
    }));

    setIsLoading(true);
    try {
      const result = await completeSetupFlow(momSetupData, childrenForAPI);
      if (result.success) show();
      else throw result.error || new Error("Setup failed");
    } catch (error: any) {
      console.error("[ChildSetup] Error:", error);
      let msg = "Failed to complete setup. Please try again.";
      if (error?.response?.status === 401) {
        msg = "Session expired. Redirecting to login...";
        setTimeout(() => router.replace("/(auth)/SignInScreen"), 2000);
      } else if (error?.response?.status === 409) {
        msg = "Profile setup already exists. Redirecting...";
        setTimeout(() => router.replace("/(tabs)/Home"), 1500);
      }
      Alert.alert("Setup Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = useCallback(() => {
    hide();
    router.replace("/(tabs)/Home");
  }, [hide]);

  // Render a loading state if session is loading OR we are in the initial navigation buffer
  if (isSessionLoading || isNavigatingFromSetup) { 
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading session...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Set Up Children</Text>
          <Text style={styles.subtitle}>
            {children.length === 1
              ? "Add your children below, or skip if you're pregnant or prefer to add them later."
              : "Fill in the details for each child. You can skip this step if needed."}
          </Text>

          {children.map((child, index) => (
            <ChildSetupItem
              key={index}
              index={index}
              childData={child}
              onUpdate={updateChild}
              onDelete={() => removeChild(index)}
            />
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addChild}>
            <Text style={styles.addBtnText}>＋ Add Another Child</Text>
          </TouchableOpacity>
        </ScrollView>

        <SuccessModal
          visible={visible}
          onClose={handleSuccessClose}
          title="Setup Successful!"
          message="Your profile is ready. Let's get started!"
          iconComponent={<Image source={require("../../assets/images/success-icon.png")} style={styles.successIcon} />}
        />

        <View style={styles.bottomButtons}>
          <PrimaryButton title="Done" onPress={handleDone} disabled={!canSubmit() || isLoading} isLoading={isLoading} />
          <SecondaryButton title="Cancel" onPress={canceled} disabled={isLoading} />
        </View>
      </View>
    </>
  );
};

// IMPORTANT: Define the component export outside the const definition
export default ChildSetupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundMain },
  scrollView: { paddingHorizontal: ms(spacing.lg), paddingTop: vs(60), paddingBottom: vs(180) },
  title: { ...typography.heading1, color: colors.textPrimary, textAlign: "center", marginBottom: vs(spacing.sm) },
  subtitle: { ...typography.bodyMedium, color: colors.textGrey1, textAlign: "center", marginBottom: vs(spacing.xl), paddingHorizontal: ms(spacing.md) },
  addBtn: { alignSelf: "center", marginVertical: vs(spacing.lg) },
  addBtnText: { ...typography.labelLarge, color: colors.primary },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: ms(spacing.lg),
    paddingBottom: vs(spacing.xl),
    gap: vs(spacing.sm),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  successIcon: { width: ms(60), height: ms(60) },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: vs(12), color: colors.textGrey1 },
});