import EmptyMilestoneMessage from "@/src/app/components/milestone/EmptyMilestoneMessage";
import { MilestoneBox } from "@/src/app/components/milestone/MilestoneBox";

import { useMilestoneStore } from "@/src/store/useMilestone";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MilestonesList({
  milestoneStatus,
}: {
  milestoneStatus: string;
}) {
  const milestoneData = useMilestoneStore((state) => state.milestoneData);
  const { categoryValue } = useLocalSearchParams();

  console.log(categoryValue, "cat");

  const filteredMilestoneData = milestoneData?.filter(
    (milestone) => milestone?.status === milestoneStatus
  );

  if (!filteredMilestoneData?.length) {
    return <EmptyMilestoneMessage milestoneStatus={milestoneStatus} />;
  }

  return (
    <View style={styles.milestonesContainer}>
      {filteredMilestoneData.map((milestone) => (
        <MilestoneBox key={milestone.id} milestone={milestone} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // milestones
  milestonesContainer: {
    marginTop: 12,
    gap: 16,
  },
});
