import FormInput from "@/src/app/components/milestone/FormInput";
import { colors, typography } from "@/src/core/styles";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";

import { editMilestone } from "@/src/core/services/milestoneService";
import { showToast } from "@/src/core/utils/toast";
import { useMilestoneStore } from "@/src/store/useMilestone";
import { EditMilestoneType } from "@/src/types/milestones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useShallow } from "zustand/react/shallow";

export default function EditForm() {
  const {
    isEditModalOpen,
    milestoneData,
    milestoneToEditId,
    onEditMileStone,
    onToggleEditSuccessModal,
    onToggleEditForm,
  } = useMilestoneStore(
    useShallow((state) => ({
      isEditModalOpen: state.isEditModalOpen,
      milestoneData: state.milestoneData,
      milestoneToEditId: state.milestoneToEditId,
      onEditMileStone: state.onEditMileStone,
      onToggleEditSuccessModal: state.onToggleEditSuccessModal,
      onToggleEditForm: state.onToggleEditForm,
    }))
  );

  const [formData, setFormData] = useState({ name: "", description: "" });
  const { categoryValue } = useLocalSearchParams();
  const isNameInputFilled = formData.name;
  const queryClient = useQueryClient();

  const currentMilestone = milestoneData?.find(
    (milestone) => milestone.id === milestoneToEditId
  );

  const { mutate: updateMilestone, isPending: isUpdatingMilestone } =
    useMutation({
      mutationFn: (payload: EditMilestoneType) =>
        editMilestone(milestoneToEditId, payload),
      onSuccess: () => {
        onToggleEditForm({ isOpenForm: false });

        queryClient.invalidateQueries({ queryKey: ["milestonesByCat"] });
      },
      onError: (error) => {
        showToast.error(error.message);
      },
    });

  useEffect(() => {
    if (currentMilestone) {
      setFormData({
        name: currentMilestone.name || "",
        description: currentMilestone.description || "",
      });
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

    onEditMileStone(milestoneToUpdate);
    updateMilestone(serverMilestoneToUpdate, {
      onSuccess: () => onToggleEditSuccessModal(true),
    });

    setFormData({ name: "", description: "" });
  }

  return (
    <Modal
      isVisible={isEditModalOpen}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={() => onToggleEditForm({ isOpenForm: false })}
      style={{ justifyContent: "flex-end", margin: 0 }}
      avoidKeyboard={false}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 100}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.milestoneFormContainer}>
          <View style={styles.formHeaderBox}>
            <Text style={styles.formTitle}>edit milestones</Text>
            <Text style={styles.formDescription}></Text>
          </View>

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
                (!isNameInputFilled || isUpdatingMilestone) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleMilestoneUpdate}
              disabled={!isNameInputFilled || isUpdatingMilestone}
            >
              <Text style={styles.buttonText}>
                {isUpdatingMilestone ? "Updating Milestone..." : "Update"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.buttons, styles.buttonCancel]}
              onPress={() => onToggleEditForm({ isOpenForm: false })}
              disabled={isUpdatingMilestone}
            >
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonCancel: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  buttonSave: {
    backgroundColor: colors.primary,
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

  buttons: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonsContainer: {
    gap: 16,
  },

  input: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.outline,
    ...typography.caption,
    height: 48,
    color: colors.textSecondary,
  },

  formDescription: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    maxWidth: 271.62,
    textAlign: "center",
  },

  formTitle: {
    ...typography.heading3,
    fontWeight: "600",
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
});
