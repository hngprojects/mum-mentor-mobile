import { colors, typography } from "@/src/core/styles";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { toggleMilestoneStatusAction } from "@/src/core/services/milestoneService";
import { showToast } from "@/src/core/utils/toast";
import { useMilestoneStore } from "@/src/store/useMilestone";
import {
  MilestoneDataType,
  ToggleMilestonePayload,
} from "@/src/types/milestones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useShallow } from "zustand/react/shallow";

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

export function MilestoneBox({ milestone }: { milestone: MilestoneDataType }) {
  const { onToggleEditForm, onToggleDeleteModal, onCheckMilestoneStatus } =
    useMilestoneStore(
      useShallow((state) => ({
        onToggleEditForm: state.onToggleEditForm,
        onToggleDeleteModal: state.onToggleDeleteModal,
        onCheckMilestoneStatus: state.onCheckMilestoneStatus,
      }))
    );
  const queryClient = useQueryClient();

  const { mutate: toggleMilestoneMutation } = useMutation({
    mutationFn: (payload: ToggleMilestonePayload) =>
      toggleMilestoneStatusAction(milestone.id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestonesByCat"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["pending-milestones"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      showToast.error(error.message);
    },
  });

  function handleMilestoneAction(actionType: Actions) {
    if (actionType === "edit") {
      onToggleEditForm({ isOpenForm: true, milestoneId: milestone.id });
    } else {
      onToggleDeleteModal({
        isOpenForm: true,
        milestoneId: milestone.id,
      });
    }
  }

  function handleToggleStatus() {
    onCheckMilestoneStatus({ id: milestone?.id });
    const togglePayload = {
      completed: milestone.status === "completed" ? false : true,
    };

    toggleMilestoneMutation(togglePayload);
  }

  return (
    <View style={styles.milestoneBox}>
      <Pressable onPress={handleToggleStatus} style={{ marginTop: 4 }}>
        <Image
          source={milestone?.status === "pending" ? uncheckedIcon : checkedIcon}
          style={styles.milestoneCheckbox}
        />
      </Pressable>

      {/* name and desc */}
      <View style={styles.milestoneTextBox}>
        <Text style={styles.milestoneName}>{milestone.name}</Text>
        <Text style={styles.milestoneDesc}>{milestone.description}</Text>
      </View>

      {/* action buttons */}
      <View style={styles.milestoneActionButtons}>
        {ACTION_BUTTONS_ICONS.map((action) => {
          // Hide edit button for completed milestones
          if (
            milestone?.status === "completed" &&
            action.actionType === "edit"
          ) {
            return null;
          }

          return (
            <Pressable
              key={action.id}
              onPress={() =>
                handleMilestoneAction(action.actionType as Actions)
              }
            >
              <Image source={action.icon} style={styles.actionButtonIcon} />
            </Pressable>
          );
        })}
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
    marginTop: 5,
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
    flex: 1,
  },

  milestoneCheckbox: {
    height: 26.67,
    width: 26.65,
  },

  milestoneBox: {
    paddingVertical: 8,
    width: "100%",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
