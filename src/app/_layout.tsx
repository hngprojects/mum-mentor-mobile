import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load HankenGrotesk fonts
  const [fontsLoaded, fontsError] = useFonts({
    "HankenGrotesk-Regular": require("@/src/app/assets/fonts/HankenGrotesk-Regular.ttf"),
    "HankenGrotesk-Medium": require("@/src/app/assets/fonts/HankenGrotesk-Medium.ttf"),
    "HankenGrotesk-SemiBold": require("@/src/app/assets/fonts/HankenGrotesk-SemiBold.ttf"),
    "HankenGrotesk-Bold": require("@/src/app/assets/fonts/HankenGrotesk-Bold.ttf"),
    "HankenGrotesk-ExtraBold": require("@/src/app/assets/fonts/HankenGrotesk-ExtraBold.ttf"),
  });

  useEffect(() => {
    // Hide splash screen once fonts are loaded or if there's an error
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
