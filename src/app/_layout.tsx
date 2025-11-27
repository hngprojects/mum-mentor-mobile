// app/_layout.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { store } from "@/src/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { SetupProvider } from "../core/hooks/setupContext";
import { AuthProvider, useAuth } from "../core/services/authContext";
import { SavedResourcesProvider } from "../core/services/savedResourcesContext";
import { colors } from "../core/styles";
import { useAssetLoading } from "../core/utils/assetsLoading";
import { toastConfig } from "../core/utils/toast";

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
        console.log(
          "📱 Onboarding status:",
          value === "true" ? "Complete" : "Not complete"
        );
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5000,
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 1,
      networkMode: "offlineFirst",
    },
  },
});

function RootLayoutContent() {
  const isLoaded = useAssetLoading();
  const { user, isSessionLoading } = useAuth();

  const { onboardingComplete, isCheckingOnboarding } =
    useOnboardingStatusLoader();
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

    console.log("🚀 Initial navigation check:", {
      user: !!user,
      onboardingComplete,
    });

    // Perform initial navigation only once
    setHasNavigated(true);

    if (user) {
      // User is logged in - go to home
      console.log("✅ User logged in - redirecting to Home");
      router.replace("/(tabs)/Home");
    } else {
      // User is not logged in
      if (onboardingComplete) {
        // Onboarding done - go to sign in
        console.log("✅ Onboarding complete - redirecting to SignIn");
        router.replace("/(auth)/SignInScreen");
      } else {
        // Show onboarding
        console.log("✅ Onboarding not complete - showing onboarding");
        router.replace("/(onboarding)");
      }
    }
  }, [
    isLoaded,
    isSessionLoading,
    isCheckingOnboarding,
    user,
    onboardingComplete,
    hasNavigated,
  ]);

  // Still loading assets or session state
  if (!isLoaded || isSessionLoading || isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
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
        <Stack.Screen name="categories/[categoryId]" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

// ----------------------------------------------------
// EXPORT ROOT LAYOUT WRAPPER
// ----------------------------------------------------
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <SetupProvider>
              <SavedResourcesProvider>
                <RootLayoutContent />
              </SavedResourcesProvider>
            </SetupProvider>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
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
