import { StyleSheet, View } from "react-native";
import OnboardingScreen from "./onboarding-screen";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import OnboardingSplash from "./splashscreen";

/**
 * Onboarding entry point
 */
export default function Index() {
  // const router = useRouter();

  // NOTE: Splash screen routing is temporarily disabled until its pr has been made.
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/(onboarding)/onboardingScreen");
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  // Render the onboarding screen directly until the shared splash logic is restored.
  return (
    <View style={styles.container}>
      <OnboardingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
