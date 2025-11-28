import MilestoneDashboard from "@/src/app/components/milestone/MilestoneDashboard";
import { colors, typography } from "@/src/core/styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChildDashboardScreen() {
  const { id: childId, name: childName } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/arrow-left.png")}
              style={styles.backButton}
            />
            <Text style={styles.buttonText}>{`${childName}'s Milestone`}</Text>
          </Pressable>

          {/* Reuse the dashboard layout! */}
          <MilestoneDashboard
            milestoneType="child"
            childId={childId as string}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonIcon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  backButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "white",
    paddingBottom: 20,
  },
});
