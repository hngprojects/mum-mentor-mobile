import { colors, typography } from "@/src/core/styles";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function EmptyMilestoneMessage({
  milestoneStatus,
}: {
  milestoneStatus: string;
}) {
  return (
    <View style={styles.noMilestoneContainer}>
      <Image
        source={require("../../../assets/images/award.png")}
        style={styles.noMilestoneIcon}
      />

      <View style={styles.noMilestoneMessageBox}>
        <Text style={styles.noMilestoneHeadingText}>
          No {milestoneStatus === "pending" && "pending"} milestones yet
        </Text>

        <Text style={styles.noMilestoneMessage}>
          {milestoneStatus === "completed"
            ? "You currently have no milestones achieved. Kindly, complete a pending milestone"
            : "Create a milestone by clicking the '+' button at the bottom right corner of the screen "}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // empty milestones message

  noMilestoneMessage: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: "center",
  },

  noMilestoneHeadingText: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  noMilestoneMessageBox: {
    gap: 16,

    alignItems: "center",
  },

  noMilestoneIcon: {
    width: 36,
    height: 36,
  },

  noMilestoneContainer: {
    gap: 24,
    marginTop: 90,
    alignItems: "center",
  },
});
