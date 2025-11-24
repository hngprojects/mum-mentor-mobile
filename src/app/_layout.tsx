import React, { useEffect, useState } from "react";
import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "../core/services/authContext";
import { useAssetLoading } from "../core/utils/assetsLoading";
import { colors } from "../core/styles/index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

// ----------------------------------------------------
// ONBOARDING STORAGE LOGIC
// ----------------------------------------------------
const ONBOARDING_KEY = "@OnboardingComplete";

function useOnboardingStatusLoader() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setOnboardingComplete(value === "true");
      } catch (error) {
        console.error("Failed to load onboarding status:", error);
      }
      setIsCheckingOnboarding(false);
    };
    check();
  }, []);

  return { onboardingComplete, isCheckingOnboarding };
}

// ----------------------------------------------------
// MAIN ROOT LAYOUT CONTENT
// ----------------------------------------------------
function RootLayoutContent() {
  const isLoaded = useAssetLoading();
  const { user, isSessionLoading } = useAuth();
  const { onboardingComplete, isCheckingOnboarding } = useOnboardingStatusLoader();

  // Hide splash only when EVERYTHING is ready
  useEffect(() => {
    if (isLoaded && !isSessionLoading && !isCheckingOnboarding) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, isSessionLoading, isCheckingOnboarding]);

  // --- STILL LOADING ---
  if (!isLoaded || isSessionLoading || isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ----------------------------------------------------
  // USER NOT LOGGED IN
  // ----------------------------------------------------
  if (!user) {
    if (onboardingComplete) {
      // User has completed onboarding before, go to sign in
      return (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
          </Stack>
          <Redirect href="/(auth)/SignInScreen" />
        </>
      );
    }

    // User has NOT completed onboarding, show onboarding
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <Redirect href="/(onboarding)" />
      </>
    );
  }

  // ----------------------------------------------------
  // USER LOGGED IN
  // ----------------------------------------------------
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Redirect href="/(tabs)/Home" />
    </>
  );
}

// ----------------------------------------------------
// EXPORT ROOT LAYOUT WRAPPER
// ----------------------------------------------------
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// ----------------------------------------------------
// STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundMain,
  },
});