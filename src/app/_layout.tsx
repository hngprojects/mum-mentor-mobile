// app/_layout.tsx

import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";

import { AuthProvider, useAuth } from "../core/services/authContext";
import { SetupProvider } from "../core/hooks/setupContext";
import { useAssetLoading } from "../core/utils/assetsLoading";
import { colors } from "../core/styles/index";

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
        console.log('📱 Onboarding status:', value === "true" ? 'Complete' : 'Not complete');
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
  const [hasNavigated, setHasNavigated] = useState(false);

  // Hide splash only when EVERYTHING is ready
  useEffect(() => {
    if (isLoaded && !isSessionLoading && !isCheckingOnboarding) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, isSessionLoading, isCheckingOnboarding]);

  // Handle initial navigation ONLY ONCE
  useEffect(() => {
    if (!isLoaded || isSessionLoading || isCheckingOnboarding || hasNavigated) {
      return;
    }

    console.log('🚀 Initial navigation check:', { 
      user: !!user, 
      onboardingComplete 
    });

    // Perform initial navigation only once
    setHasNavigated(true);

    if (user) {
      // User is logged in - go to home
      console.log('✅ User logged in - redirecting to Home');
      router.replace("/(tabs)/Home");
    } else {
      // User is not logged in
      if (onboardingComplete) {
        // Onboarding done - go to sign in
        console.log('✅ Onboarding complete - redirecting to SignIn');
        router.replace("/(auth)/SignInScreen");
      } else {
        // Show onboarding
        console.log('✅ Onboarding not complete - showing onboarding');
        router.replace("/(onboarding)");
      }
    }
  }, [isLoaded, isSessionLoading, isCheckingOnboarding, user, onboardingComplete, hasNavigated]);

  // Still loading assets or session state
  if (!isLoaded || isSessionLoading || isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Just render the stack - navigation happens in useEffect above
  // ONLY include routes that actually exist in your file structure
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="Gallery" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="resources" />
      <Stack.Screen name="components" />
    </Stack>
  );
}

// ----------------------------------------------------
// EXPORT ROOT LAYOUT WRAPPER
// ----------------------------------------------------
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SetupProvider>
          <RootLayoutContent />
        </SetupProvider>
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