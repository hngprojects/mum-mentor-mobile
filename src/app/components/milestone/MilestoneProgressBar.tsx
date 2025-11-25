import { colors, typography } from "@/src/core/styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function MilestoneProgressBar() {
  return (
    <View style={styles.milestoneProgressContainer}>
      {/* header */}
      <Text style={styles.milestonesProgressHeadingText}>
        0/50 Milestones completed
      </Text>

      <View style={styles.milestoneProgressBarContainer}>
        {/* title and progress in(%) */}
        <View style={styles.milestoneProgressTextContainer}>
          <Text style={styles.mileStoneProgressText1}>Progress Bar</Text>

          <Text style={styles.milestoneProgressText2}>0%</Text>
        </View>

        {/* progress bar */}
        <Progress.Bar
          progress={0.5}
          width={null}
          color="#2ECC71"
          borderColor="transparent"
          unfilledColor="#E5E5E5"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  milestoneProgressText2: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  mileStoneProgressText1: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  milestoneProgressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  milestoneProgressBarContainer: {
    gap: 16,
  },
  milestonesProgressHeadingText: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  milestoneProgressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
    borderWidth: 0.5,
    borderColor: colors.outline,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
