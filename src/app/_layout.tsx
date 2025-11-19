// app/_layout.tsx

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAssetLoading } from '../core/utils/assetsLoading';
import { colors } from '../core/styles/index';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const isLoaded = useAssetLoading();

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RootLayoutContent>
      <Stack>
        <Stack.Screen
          name="(onboarding)"
          options={{ headerShown: false }}
        />
                <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
      </Stack>
    </RootLayoutContent>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMain,
  },
});
