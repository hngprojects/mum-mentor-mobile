import ModalAnimationWrapper from "@/src/app/components/milestone/ModalAnimationWrapper";
import { deleteMilestoneAction } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { useMilestoneStore } from "@/src/store/useMilestone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useShallow } from "zustand/react/shallow";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function DeleteModal() {
  const {
    milestoneToDelId,
    onDeleteMilestone,
    onToggleDeleteModal,
    isDeleteModalOpen,
  } = useMilestoneStore(
    useShallow((state) => ({
      milestoneToDelId: state.milestoneToDelId,
      onDeleteMilestone: state.onDeleteMilestone,
      onToggleDeleteModal: state.onToggleDeleteModal,
      isDeleteModalOpen: state.isDeleteModalOpen,
    }))
  );

  const queryClient = useQueryClient();

  const { mutate: deleteMilestone, isPending: isDeletingMilestone } =
    useMutation({
      mutationFn: (milestoneId: string) => deleteMilestoneAction(milestoneId),

      onSuccess: () => {
        onCloseModal();
        queryClient.invalidateQueries({ queryKey: ["milestonesByCat"] });
        queryClient.invalidateQueries({ queryKey: ["pending-milestones"] });
        showToast.success("Milestone deleted successfully");
      },
      onError: (error) => {
        showToast.error(error.message);
      },
    });

  const onCloseModal = () => onToggleDeleteModal({ isOpenForm: false });

  const handleDeleteMilestone = () => {
    deleteMilestone(milestoneToDelId, {
      onSuccess: () => {
        onDeleteMilestone();
      },
    });
  };

  return (
    <ModalAnimationWrapper
      isVisible={isDeleteModalOpen}
      onBackdropPress={onCloseModal}
    >
      <View style={styles.modalContainer}>
        <Image
          source={require("../../../assets/images/trash.png")}
          style={styles.deleteIcon}
        />

        <View style={styles.modalHeader}>
          <Text style={styles.headerText}>Delete Milestone</Text>
          <Text style={styles.headerDesc}>
            Are you sure you want to delete this Milestone?
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[
              styles.button,
              styles.buttonSave,
              isDeletingMilestone && styles.buttonDisabled,
            ]}
            onPress={handleDeleteMilestone}
            disabled={isDeletingMilestone}
          >
            <Text style={styles.buttonText}>
              {isDeletingMilestone ? "Deleting Milestone..." : "Delete"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonCancel]}
            onPress={onCloseModal}
            disabled={isDeletingMilestone}
          >
            <Text style={styles.buttonCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ModalAnimationWrapper>
  );
}

const styles = StyleSheet.create({
  headerDesc: {
    ...typography.bodySmall,
    textAlign: "center",
    color: colors.textGrey1,
  },

  headerText: {
    ...typography.heading3,
    color: "black",
    fontWeight: "600",
    textAlign: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    ...typography.buttonText,
    color: "white",
    fontWeight: "500",
  },

  buttonCancelText: {
    ...typography.buttonText,
    color: colors.primary,
    fontWeight: "500",
  },

  deleteIcon: {
    width: 24,
    height: 24,
  },

  modalHeader: {
    gap: 8,
    alignItems: "center",
  },

  modalContainer: {
    paddingTop: 10,
    gap: 24,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
  },

  buttonCancel: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  buttonSave: {
    backgroundColor: colors.primary,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "stretch",
  },

  buttonsContainer: {
    gap: 8,
    width: "100%",
  },
});
