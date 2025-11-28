import { colors, typography } from "@/src/core/styles";
import { useAppSelector } from "@/src/store/hooks";
import { getMilestoneStates } from "@/src/store/milestoneSlice";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function MilestoneProgressBar() {
  const { milestoneData } = useAppSelector(getMilestoneStates);

  console.log(milestoneData, "data");
  const completedMilestone = milestoneData.filter(
    (milestone) => milestone.status === "completed"
  ).length;

  // const pendingMilestone = milestoneData.filter(
  //   (milestone) => milestone.status === "completed"
  // ).length;

  const progress = milestoneData?.length
    ? completedMilestone / milestoneData.length
    : 0;
  console.log(progress, "progress");

  return (
    <View style={styles.milestoneProgressContainer}>
      {/* header */}
      <Text style={styles.milestonesProgressHeadingText}>
        {completedMilestone}/{milestoneData.length} Milestones completed
      </Text>

      <View style={styles.milestoneProgressBarContainer}>
        {/* title and progress in(%) */}
        <View style={styles.milestoneProgressTextContainer}>
          <Text style={styles.mileStoneProgressText1}>Progress Bar</Text>

          <Text style={styles.milestoneProgressText2}>
            {Math.floor(progress * 100)}%
          </Text>
        </View>

        {/* progress bar */}
        <Progress.Bar
          progress={progress}
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
