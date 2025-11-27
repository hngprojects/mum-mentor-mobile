import { colors, typography } from "@/src/core/styles";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppDispatch } from "@/src/store/hooks";
import {
  onCheckMilestoneStatus,
  onToggleDeleteModal,
  onToggleEditForm,
} from "@/src/store/milestoneSlice";
import { Milestone } from "@/src/store/types";
import React from "react";
type Actions = "edit" | "delete";

const uncheckedIcon = require("../../../assets/images/checkbox-unticked.png");

const checkedIcon = require("../../../assets/images/checked-icon.png");

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

export function MilestoneBox({ milestone }: { milestone: Milestone }) {
  const dispatch = useAppDispatch();

  function handleMilestoneAction(actionType: Actions) {
    if (actionType === "edit") {
      dispatch(
        onToggleEditForm({ isOpenForm: true, milestoneId: milestone.id })
      );
    } else {
      dispatch(
        onToggleDeleteModal({
          isOpenForm: true,
          milestoneId: milestone.id,
        })
      );
    }
  }

  return (
    <View style={styles.milestoneBox}>
      <Pressable
        onPress={() => dispatch(onCheckMilestoneStatus({ id: milestone?.id }))}
      >
        <Image
          source={milestone?.status === "pending" ? uncheckedIcon : checkedIcon}
          style={styles.milestoneCheckbox}
        />
      </Pressable>
      {/* name and desc */}
      <View style={styles.milestoneTextBox}>
        <Text style={styles.milestoneName}>{milestone.title}</Text>
        <Text style={styles.milestoneDesc}>{milestone.desc}</Text>
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
