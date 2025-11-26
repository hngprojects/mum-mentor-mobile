import { MilestoneBox } from "@/src/app/components/milestone/MilestoneBox";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MilestonesList() {
  return (
    <View style={styles.milestonesContainer}>
      {Array.from({ length: 3 }).map((_, idx) => (
        <MilestoneBox key={idx} />
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
