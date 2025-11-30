import { getPendingMilestones } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
// import Checkbox from "@/src/assets/images/tick-square.png";

export default function PendingMilestones({ childId }: { childId?: string }) {
  const {
    data: pendingMilestones,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["pending-milestones", childId],
    queryFn: () => getPendingMilestones(childId),
  });

  useEffect(() => {
    if (error) showToast.error(error.message);
  }, [error]);

  if (isLoading) {
    return <View>Loading</View>;
  }

  return (
    <View style={styles.pendingMilestoneContainer}>
      <Text style={styles.pendingMilestoneHeaderText}>Pending Milestones</Text>

      <View style={styles.pendingMileStoneContents}>
        {pendingMilestones?.map((milestone) => (
          <View key={milestone.id} style={styles.pendingMilestoneContentBox}>
            <View style={styles.contentBoxTextWrapper}>
              <Text style={styles.contentBoxTitle}>{milestone.name}</Text>
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
