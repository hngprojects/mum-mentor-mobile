import { MilestoneBox } from "@/src/app/components/milestone/MilestoneBox";
import { useAppSelector } from "@/src/store/hooks";
import { getMilestoneStates } from "@/src/store/milestoneSlice";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MilestonesList({
  milestoneStatus,
}: {
  milestoneStatus: string;
}) {
  const { milestoneData } = useAppSelector(getMilestoneStates);

  const filteredMilestoneData = milestoneData?.filter(
    (milestone) => milestone?.status === milestoneStatus
  );

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
    marginTop: 0,
    gap: 16,
  },
});
