import ModalAnimationWrapper from "@/src/app/components/milestone/ModalAnimationWrapper";
import { colors, typography } from "@/src/core/styles";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getMilestoneStates,
  onToggleSuccessModal,
} from "@/src/store/milestoneSlice";
import React from "react";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function SuccessModal() {
  const { isSuccessModalOpen } = useAppSelector(getMilestoneStates);
  const dispatch = useAppDispatch();

  const onCloseModal = () => dispatch(onToggleSuccessModal(false));

  return (
    <ModalAnimationWrapper
      isVisible={isSuccessModalOpen}
      onBackdropPress={onCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalTextBox}>
          <View style={styles.modalHeader}>
            <Image
              source={require("../../../assets/images/green-success.png")}
            />
            <Text style={styles.successHeaderText}>
              Milestone created successfully
            </Text>
          </View>

          <Pressable
            style={[styles.button, styles.buttonSave]}
            onPress={onCloseModal}
          >
            Done
          </Pressable>
        </View>
      </View>
    </ModalAnimationWrapper>
  );
}

const styles = StyleSheet.create({
  // successful modal

  successHeaderText: {
    ...typography.heading3,
    color: "black",
    fontWeight: 600,
    textAlign: "center",
  },
  successIcon: {
    width: 57.52,
    height: 52.52,
  },
  modalHeader: {
    gap: 12,
    alignItems: "center",
  },

  modalTextBox: {
    gap: 32,
  },

  modalContainer: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "white",
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
