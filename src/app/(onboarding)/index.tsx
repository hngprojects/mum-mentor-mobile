import { StyleSheet, View } from "react-native";
import OnboardingScreen from "./OnboardingScreen";

export default function Index() {
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
