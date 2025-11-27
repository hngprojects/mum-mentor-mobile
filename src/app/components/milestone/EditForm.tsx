import FormInput from "@/src/app/components/milestone/FormInput";
import { colors, typography } from "@/src/core/styles";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getMilestoneStates,
  onEditMileStone,
  onToggleEditForm,
  onToggleEditSuccessModal,
} from "@/src/store/milestoneSlice";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditForm() {
  const { isEditModalOpen, milestoneData, milestoneToEditId } =
    useAppSelector(getMilestoneStates);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const currentMilestone = milestoneData.find(
    (milestone) => milestone.id === milestoneToEditId
  );

  useEffect(() => {
    if (currentMilestone) {
      setTitle(currentMilestone.title);
      setDesc(currentMilestone.desc);
    }
  }, [currentMilestone]);

  function handleMilestoneUpdate() {
    const updatedMilestone = {
      title,
      desc,
    };

    dispatch(onEditMileStone(updatedMilestone));
    // if success, open success modal

    setTitle("");
    setDesc("");
    dispatch(onToggleEditForm({ isOpenForm: false }));
    dispatch(onToggleEditSuccessModal(true));
  }

  return (
    <Modal
      isVisible={isEditModalOpen}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={() => dispatch(onToggleEditForm({ isOpenForm: false }))}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      {/* container */}
      <View style={styles.milestoneFormContainer}>
        {/* header */}
        <View style={styles.formHeaderBox}>
          <Text style={styles.formTitle}>edit milestones</Text>
          <Text style={styles.formDescription}>
            src/app/components/milestone/CreateForm.tsx
          </Text>
        </View>

        {/* forms */}
        <FormInput label="Milestone Name">
          <TextInput
            style={styles.input}
            placeholder="e.g 5 Minutes Exercise"
            placeholderTextColor={colors.textGrey2}
            keyboardType="default"
            autoCapitalize="none"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </FormInput>

        <FormInput label="Add Description">
          <TextInput
            style={styles.input}
            placeholder="eg. Tried a 5 Minutes Exercise Plan..."
            placeholderTextColor={colors.textGrey2}
            keyboardType="default"
            autoCapitalize="none"
            value={desc}
            onChangeText={(text) => setDesc(text)}
          />
        </FormInput>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.buttons, styles.buttonSave]}
            onPress={handleMilestoneUpdate}
            disabled={!title && !desc}
          >
            Save
          </Pressable>

          <Pressable
            style={[styles.buttons, styles.buttonCancel]}
            onPress={() => dispatch(onToggleEditForm({ isOpenForm: false }))}
          >
            Cancel
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

  buttons: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...typography.buttonText,
    fontWeight: 500,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonsContainer: {
    gap: 16,
  },

  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: "right",
  },

  input: {
    borderRadius: 8,
    padding: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    ...typography.caption,
    height: 48,
    color: colors.textSecondary,
  },

  label: {
    ...typography.labelLarge,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  inputGroup: {
    gap: 4,
  },

  formDescription: {
    ...typography.bodySmall,
    alignItems: "center",
    color: colors.textGrey1,
    maxWidth: 271.62,
    marginHorizontal: "auto",
    textAlign: "center",
  },

  formTitle: {
    ...typography.heading3,
    fontWeight: 600,
    color: "black",
    textTransform: "capitalize",
    textAlign: "center",
  },

  formHeaderBox: {
    gap: 8,
    alignItems: "center",
  },

  milestoneFormContainer: {
    borderTopEndRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: "white",
    padding: 24,
    gap: 24,
  },

  createMilestoneOverlay: {
    backgroundColor: "#00000099",
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    flex: 1,
    justifyContent: "flex-end",
  },
});
