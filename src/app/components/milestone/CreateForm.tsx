import FormInput from "@/src/app/components/milestone/FormInput";
import { createMilestone } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getMilestoneStates,
  onAddMilestone,
  onToggleCreateForm,
  onToggleSuccessModal,
} from "@/src/store/milestoneSlice";
import { CreateMilestoneType, MilestoneDataType } from "@/src/types/milestones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Modal from "react-native-modal";

export default function CreateForm() {
  const { isCreateFormOpen } = useAppSelector(getMilestoneStates);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();
  const { categoryValue, ownerId, childId } = useLocalSearchParams();

  const isNameInputFilled = !!formData.name;

  const { mutate: createNewMilestone, isPending: isCreatingMilestone } =
    useMutation({
      mutationFn: (payload: CreateMilestoneType) => createMilestone(payload),
      onSuccess: () => {
        dispatch(onToggleCreateForm(false));
        dispatch(onToggleSuccessModal(true));
        queryClient.invalidateQueries({ queryKey: ["milestonesByCat"] });
      },
      onError: (error: any) => {
        showToast.error(error.message);
      },
    });

  function handleMilestoneCreation() {
    const currentDate = new Date().toISOString();
    const newMilestone: MilestoneDataType = {
      id: crypto.randomUUID(),
      owner_id: ownerId as string,
      owner_type: childId ? "child" : "mother",
      status: "pending",
      category: categoryValue as string,
      created_at: currentDate,
      updated_at: currentDate,
      ...formData,
    };

    const serverNewMilestone = {
      ...formData,
      category: categoryValue as string,
      child_id: childId as string | undefined,
    };

    dispatch(onAddMilestone(newMilestone));
    createNewMilestone(serverNewMilestone);
    setFormData({ name: "", description: "" });
  }

  return (
    <Modal
      isVisible={isCreateFormOpen}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={() => dispatch(onToggleCreateForm(false))}
      style={{ justifyContent: "flex-end", margin: 0 }}
      avoidKeyboard
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.milestoneFormContainer}>
            <View style={styles.formHeaderBox}>
              <Text style={styles.formTitle}>create milestones</Text>
              <Text style={styles.formDescription}>
                Add Milestones to stay focused, celebrate progress
              </Text>
            </View>

            <FormInput label="Milestone Name">
              <TextInput
                style={styles.input}
                placeholder="e.g 5 Minutes Exercise"
                placeholderTextColor={colors.textGrey2}
                editable={!isCreatingMilestone}
                autoCapitalize="none"
                value={formData.name}
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
                editable={!isCreatingMilestone}
                defaultValue=""
                keyboardType="default"
                autoCapitalize="none"
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
                  (!isNameInputFilled || isCreatingMilestone) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleMilestoneCreation}
                disabled={!isNameInputFilled || isCreatingMilestone}
              >
                <Text style={styles.buttonText}>
                  {isCreatingMilestone ? "Saving..." : "Save"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.buttons, styles.buttonCancel]}
                onPress={() => dispatch(onToggleCreateForm(false))}
                disabled={isCreatingMilestone}
              >
                <Text style={styles.buttonCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
