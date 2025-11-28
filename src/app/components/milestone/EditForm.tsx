import FormInput from "@/src/app/components/milestone/FormInput";
import { colors, typography } from "@/src/core/styles";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";

import { editMilestone } from "@/src/core/services/milestoneService";
import { showToast } from "@/src/core/utils/toast";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getMilestoneStates,
  onEditMileStone,
  onToggleEditForm,
  onToggleEditSuccessModal,
} from "@/src/store/milestoneSlice";
import { EditMilestoneType } from "@/src/types/milestones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditForm() {
  const { isEditModalOpen, milestoneData, milestoneToEditId } =
    useAppSelector(getMilestoneStates);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { categoryValue } = useLocalSearchParams();
  const isNameInputFilled = formData.name;
  const queryClient = useQueryClient();

  const currentMilestone = milestoneData.find(
    (milestone) => milestone.id === milestoneToEditId
  );

  const { mutate: updateMilestone, isPending: isUpdatingMilestone } =
    useMutation({
      mutationFn: (payload: EditMilestoneType) =>
        editMilestone(milestoneToEditId, payload),
      onSuccess: () => {
        dispatch(onToggleEditForm({ isOpenForm: false }));
        dispatch(onToggleEditSuccessModal(true));
        queryClient.invalidateQueries({ queryKey: ["milestonesByCat"] });
      },
      onError: (error) => {
        showToast.error(error.message);
        dispatch(onToggleEditForm({ isOpenForm: false }));
      },
    });

  useEffect(() => {
    if (currentMilestone) {
      setFormData((cur) => ({
        name: currentMilestone.name,
        description: currentMilestone.description,
      }));
    }
  }, [currentMilestone]);

  function handleMilestoneUpdate() {
    const currentDate = new Date().toISOString();
    const milestoneToUpdate = {
      ...formData,
      updated_at: currentDate,
    };

    const serverMilestoneToUpdate = {
      ...formData,
      category: categoryValue as string,
    };

    dispatch(onEditMileStone(milestoneToUpdate));
    updateMilestone(serverMilestoneToUpdate);

    setFormData({ name: "", description: "" });
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
          <Text style={styles.formDescription}></Text>
        </View>

        {/* forms */}
        <FormInput label="Milestone Name">
          <TextInput
            style={styles.input}
            placeholder="e.g 5 Minutes Exercise"
            placeholderTextColor={colors.textGrey2}
            keyboardType="default"
            autoCapitalize="none"
            value={formData.name}
            editable={!isUpdatingMilestone}
            onChangeText={(text) =>
              setFormData((cur) => ({ ...cur, name: text }))
            }
          />
        </FormInput>

        <FormInput label="Add Description">
          <TextInput
            style={styles.input}
            placeholder="eg. Tried a 5 Minutes Exercise Plan..."
            placeholderTextColor={colors.textGrey2}
            keyboardType="default"
            autoCapitalize="none"
            editable={!isUpdatingMilestone}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((cur) => ({ ...cur, description: text }))
            }
          />
        </FormInput>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[
              styles.buttons,
              styles.buttonSave,
              !isNameInputFilled && styles.buttonDisabled,
              isUpdatingMilestone && styles.buttonDisabled,
            ]}
            onPress={handleMilestoneUpdate}
            disabled={!isNameInputFilled || isUpdatingMilestone}
          >
            {isUpdatingMilestone ? "Updating Milestone..." : "Update"}
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
  buttonDisabled: {
    opacity: 0.6,
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
