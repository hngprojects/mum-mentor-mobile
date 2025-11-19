// src/core/utilities/useAssetLoading.ts

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

// Correct path to reach core/styles from core/utilities/
import { fontFamilies } from '../styles/index'; 

/**
 * Loads all custom HankenGrotesk font assets into memory.
 */
export const loadApplicationFonts = async () => {
  await Font.loadAsync({
    // Map the font family key (used in the theme) to the local asset file
    [fontFamilies.regular]: require('../../assets/fonts/HankenGrotesk-Regular.ttf'),
    [fontFamilies.medium]: require('../../assets/fonts/HankenGrotesk-Medium.ttf'),
    [fontFamilies.semiBold]: require('../../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    [fontFamilies.bold]: require('../../assets/fonts/HankenGrotesk-Bold.ttf'),
    [fontFamilies.extraBold]: require('../../assets/fonts/HankenGrotesk-ExtraBold.ttf'),
  });
};

/**
 * Custom hook to manage asynchronous loading of non-critical assets (like fonts).
 * This hook handles its own loading state but deliberately DOES NOT manage the SplashScreen.
 * The calling component/team member (@JoyAyo) is responsible for hiding the splash screen.
 */
export const useAssetLoading = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // We use an IIFE (Immediately Invoked Function Expression) to run the async logic once.
    (async function loadAssets() {
      try {
        // 1. Load the custom fonts
        await loadApplicationFonts();
        
        // 2. Add an artificial delay for branding clarity (will be removed for production builds, but good for testing)
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
      } catch (e) {
        console.warn("Asset loading failed:", e);
      } finally {
        // 3. Set state to ready once loading is complete
        setIsLoaded(true);
        // NOTE: SPLASH SCREEN HIDING LOGIC IS REMOVED HERE
      }
    })(); // <-- The parenthesis immediately execute the function
  }, []); 

  return isLoaded;
};