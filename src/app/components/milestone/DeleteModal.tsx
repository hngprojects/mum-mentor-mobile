import ModalAnimationWrapper from "@/src/app/components/milestone/ModalAnimationWrapper";
import { colors, typography } from "@/src/core/styles";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getMilestoneStates,
  onDeleteMilestone,
  onToggleDeleteModal,
} from "@/src/store/milestoneSlice";
import React from "react";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function DeleteModal() {
  const { isDeleteModalOpen } = useAppSelector(getMilestoneStates);
  const dispatch = useAppDispatch();

  const onCloseModal = () =>
    dispatch(onToggleDeleteModal({ isOpenForm: false }));

  const handleDeleteMilestone = () => {
    dispatch(onDeleteMilestone());
    onCloseModal();
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
          <Text>Are you sure you want to delete this Milestone?</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.buttonSave]}
            onPress={handleDeleteMilestone}
          >
            Delete
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonCancel]}
            onPress={onCloseModal}
          >
            Cancel
          </Pressable>
        </View>
      </View>
    </ModalAnimationWrapper>
  );
}

const styles = StyleSheet.create({
  // delete modal
  headerDesc: {
    ...typography.bodySmall,
    textAlign: "center",
    color: colors.textGrey1,
  },

  // success modal
  headerText: {
    ...typography.heading3,
    color: "black",
    fontWeight: 600,
    textAlign: "center",
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
    padding: 24,
    gap: 24,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
  },

  // create milestone form
  buttonCancel: {
    backgroundColor: "white",
    color: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  buttonSave: {
    color: "white",
    backgroundColor: colors.primary,
  },

  button: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...typography.buttonText,
    fontWeight: 500,
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

  backgroundOverlay: {
    backgroundColor: "#00000099",
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
