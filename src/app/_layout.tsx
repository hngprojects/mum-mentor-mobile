import React, { useEffect } from 'react';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../core/services/authContext'; // Adjust path if needed
import { useAssetLoading } from '../core/utils/assetsLoading'; // Adjust path if needed
import { colors } from '../core/styles/index'; // Adjust path if needed

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const isLoaded = useAssetLoading();
  const { user, isSessionLoading } = useAuth();

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded || isSessionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- Unauthenticated users ---
  if (!user) {
    return (
      <Stack>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Redirect href="/(onboarding)" />
      </Stack>
    );
  }

  // --- Authenticated users ---
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Redirect href="/(tabs)/Home" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundMain,
  },
});
