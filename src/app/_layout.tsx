import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../core/services/authContext";
import { colors } from "../core/styles/index";
import { useAssetLoading } from "../core/utils/assetsLoading";

SplashScreen.preventAutoHideAsync();

// ----------------------------------------------------
// ONBOARDING STORAGE LOGIC
// ----------------------------------------------------

const ONBOARDING_KEY = "@OnboardingComplete";
const GOOGLE_CLIENT_ID =
  "587538345013-rfv1tk32e0r5bpeahr2oobr19qeceadn.apps.googleusercontent.com";

function useOnboardingStatusLoader() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  GoogleSignin.configure({
    webClientId: GOOGLE_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

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
  const { onboardingComplete, isCheckingOnboarding } =
    useOnboardingStatusLoader();

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
