import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configureGoogleSignIn } from '../core/services/googleSignInService';

configureGoogleSignIn();
export default function OnboardingLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}


