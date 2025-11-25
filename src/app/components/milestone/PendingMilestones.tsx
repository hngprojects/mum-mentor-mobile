import { PENDING_MILESTONES } from "@/src/core/data/milestone-data";
import { colors, typography } from "@/src/core/styles";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
// import Checkbox from "@/src/assets/images/tick-square.png";

export default function PendingMilestones() {
  return (
    <View style={styles.pendingMilestoneContainer}>
      <Text style={styles.pendingMilestoneHeaderText}>Pending Milestones</Text>

      <View style={styles.pendingMileStoneContents}>
        {PENDING_MILESTONES?.map((milestone, idx) => (
          <View key={idx} style={styles.pendingMilestoneContentBox}>
            <View style={styles.contentBoxTextWrapper}>
              <Text style={styles.contentBoxTitle}>{milestone.title}</Text>
              <Text style={styles.contentBoxCategory}>
                {milestone.category}
              </Text>
            </View>

            <Image
              source={require("../../../assets/images/tick-square.png")}
              style={styles.contentBoxCheckbox}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // pending milestones
  pendingMilestoneContainer: {
    gap: 16,
  },

  pendingMilestoneHeaderText: {
    ...typography.heading3,
    color: colors.textPrimary,
  },

  pendingMileStoneContents: {
    gap: 16,
  },

  pendingMilestoneContentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.disabledBorder,
    padding: 16,
  },

  contentBoxTextWrapper: {
    gap: 8,
  },
  contentBoxTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },

  contentBoxCategory: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },

  contentBoxCheckbox: {
    height: 24,
    width: 24,
  },
});
