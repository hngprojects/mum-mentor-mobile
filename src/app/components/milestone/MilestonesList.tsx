import { MilestoneBox } from "@/src/app/components/milestone/MilestoneBox";
import { getMilestones } from "@/src/core/services/milestoneService";
import { useAppSelector } from "@/src/store/hooks";
import { getMilestoneStates } from "@/src/store/milestoneSlice";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MilestonesList({
  milestoneStatus,
}: {
  milestoneStatus: string;
}) {
  const { milestoneData } = useAppSelector(getMilestoneStates);
  const { categoryValue } = useLocalSearchParams();

  console.log(categoryValue, "cat");

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["milestones", categoryValue],
    queryFn: () => getMilestones(categoryValue as string),
  });

  console.log(data, "milestones");

  if (!isLoading) {
    console.log(data, "after loading");
  }

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
