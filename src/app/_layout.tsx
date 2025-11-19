import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    "HankenGrotesk-Regular": require("@/src/core/assets/fonts/HankenGrotesk-Regular.ttf"),
    "HankenGrotesk-Medium": require("@/src/core/assets/fonts/HankenGrotesk-Medium.ttf"),
    "HankenGrotesk-SemiBold": require("@/src/core/assets/fonts/HankenGrotesk-SemiBold.ttf"),
    "HankenGrotesk-Bold": require("@/src/core/assets/fonts/HankenGrotesk-Bold.ttf"),
    "HankenGrotesk-ExtraBold": require("@/src/core/assets/fonts/HankenGrotesk-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
    </Stack>
  );
}
