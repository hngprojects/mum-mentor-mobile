import { configureGoogleSignIn } from "@/src/core/services/googleAuthservice";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function OnboardingLayout() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
