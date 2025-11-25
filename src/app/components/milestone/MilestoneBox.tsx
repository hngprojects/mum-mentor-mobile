import { colors, typography } from "@/src/core/styles";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppDispatch } from "@/src/store/hooks";
import {
  onToggleDeleteModal,
  onToggleEditForm,
} from "@/src/store/milestoneSlice";
import React from "react";
type Actions = "edit" | "delete";

export const ACTION_BUTTONS_ICONS = [
  {
    id: 1,
    icon: require("../../../assets/images/edit-2.png"),
    actionType: "edit",
  },
  {
    id: 2,
    icon: require("../../../assets/images/trash.png"),
    actionType: "delete",
  },
];

export function MilestoneBox() {
  const dispatch = useAppDispatch();
  const milestoneSampleId = "223j-2234";

  function handleMilestoneAction(actionType: Actions) {
    if (actionType === "edit") {
      dispatch(
        onToggleEditForm({ isOpenForm: true, milestoneId: milestoneSampleId })
      );
    } else {
      dispatch(
        onToggleDeleteModal({
          isOpenForm: true,
          milestoneId: milestoneSampleId,
        })
      );
    }
  }

  return (
    <View style={styles.milestoneBox}>
      <Image
        source={require("../../../assets/images/checkbox-unticked.png")}
        style={styles.milestoneCheckbox}
      />
      {/* name and desc */}
      <View style={styles.milestoneTextBox}>
        <Text style={styles.milestoneName}>Drank warm water</Text>
        <Text style={styles.milestoneDesc}>
          Warm hydration to help digestion and relax muscles.
        </Text>
      </View>

      {/* action buttons */}
      <View style={styles.milestoneActionButtons}>
        {ACTION_BUTTONS_ICONS.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => handleMilestoneAction(action.actionType as Actions)}
          >
            <Image source={action.icon} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    height: 24,
    width: 24,
  },
  milestoneActionButtons: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  milestoneName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  milestoneTextBox: {
    gap: 8,

    width: "70%",
  },
  milestoneCheckbox: {
    height: 32,
    width: 32,
  },
  milestoneBox: {
    paddingVertical: 8,
    width: "100%",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
