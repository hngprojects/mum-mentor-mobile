// src/app/_layout.tsx
// The Root Layout acts as the single entry point and conditional router for the entire application.

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; 

// --- IMPORTS FROM CORE UTILITIES ---
// The custom hook that executes the font loading (located in core/utilities/)
import { useAssetLoading } from '../core/utils/assetsLoading'; 
// Import styles/constants (located in core/styles/index)
import { colors } from '../core/styles/index'; 


// 1. MANDATORY SPLASH SCREEN MANAGEMENT (
// This is the correct place to call this function, ensuring the native splash screen stays visible.
SplashScreen.preventAutoHideAsync();


function RootLayoutContent() {
  // 2. Execute the font loading hook (which returns true when fonts are ready)
  const isLoaded = useAssetLoading();


  // 3. Handle Splash Screen Hiding Logic
  // This logic is owned by this layout component, completing the splash screen task.
  useEffect(() => {
      if (isLoaded) {
          // This call hides the native splash screen, revealing the React UI.
          SplashScreen.hideAsync(); 
      }
  }, [isLoaded]);


  // --- SHOW LOADING SCREEN WHILE FONTS ARE LOADING ---
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        {/* Spinner uses the theme's primary color, even on the loading screen */}
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
}

export default function RootLayout() {
  return (
    // Stack is used to set up the container for the entire app structure
    <Stack>
      {/* We use a hidden screen named "index" to host the app's initial logic */}
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      
      {/* RootLayoutContent hosts the conditional logic and renders the current state */}
      <RootLayoutContent />
    </Stack>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // Using the primary background color from your theme constants
        backgroundColor: colors.backgroundMain, 
    },
});