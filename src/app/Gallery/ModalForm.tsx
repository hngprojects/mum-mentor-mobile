// src/app/gallery/modal-form.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "../../core/styles/scaling";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import PageHeader from "../components/shared/PageHeader";

// Define proper types for form fields
interface FormField {
  name: string;
  label: string;
  placeholder: string;
  icon?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

interface FormOption {
  name: string;
  label: string;
  description: string;
}

interface FormConfig {
  title: string;
  subtitle: string;
  fields: FormField[];
  options?: FormOption[];
  submitText: string;
}

// Form configurations with proper typing
const FORM_CONFIGS: Record<string, FormConfig> = {
  "create-album": {
    title: "Create Album",
    subtitle: "Create album to capture memorable photos",
    fields: [
      {
        name: "albumName",
        label: "Album name",
        placeholder: "Enter album name",
        icon: "folder-outline",
        keyboardType: "default",
      },
    ],
    options: [
      {
        name: "isPrivate",
        label: "Private Album",
        description: "Only you can see this album",
      },
    ],
    submitText: "Save",
  },
  "add-memory": {
    title: "Add Memory",
    subtitle: "Share the detail about this moment",
    fields: [
      {
        name: "date",
        label: "Date",
        placeholder: "Select date",
        icon: "calendar-outline",
        keyboardType: "default",
      },
      {
        name: "pregnancy",
        label: "Pregnancy",
        placeholder: "Enter pregnancy week",
        icon: "calendar-number",
        keyboardType: "numeric",
      },
      {
        name: "video",
        label: "Video",
        placeholder: "Add video link (optional)",
        icon: "videocam-outline",
        keyboardType: "url",
      },
      {
        name: "gender",
        label: "Gender",
        placeholder: "Select gender",
        icon: "gender-outline",
        keyboardType: "default",
      },
    ],
    submitText: "Save Memory",
  },
  "edit-album": {
    title: "Edit Album",
    subtitle: "Update your album details",
    fields: [
      {
        name: "albumName",
        label: "Album name",
        placeholder: "Enter album name",
        icon: "folder-outline",
        keyboardType: "default",
      },
    ],
    options: [
      {
        name: "isPrivate",
        label: "Private Album",
        description: "Only you can see this album",
      },
    ],
    submitText: "Update",
  },
};

export default function ModalFormScreen() {
  const params = useLocalSearchParams();
  const formType = (params.type as string) || "create-album";
  const config = FORM_CONFIGS[formType];

  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle case where formType doesn't exist in config
  if (!config) {
    return (
      <View style={styles.container}>
        <PageHeader title="Error" showClose />
        <View style={styles.content}>
          <Text style={styles.errorText}>Invalid form type</Text>
        </View>
      </View>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionToggle = (option: string) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = async () => {
    // Validate required fields (fields without "optional" in placeholder)
    const requiredFields = config.fields.filter(
      (f) => !f.placeholder?.toLowerCase().includes("optional")
    );
    const missingFields = requiredFields.filter(
      (f) => !formData[f.name]?.trim()
    );

    if (missingFields.length > 0) {
      showToast.error(
        "Error",
        `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`
      );
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call appropriate service based on formType
      console.log("Submitting:", formType, formData, options);

      showToast.success("Success", `${config.title} completed successfully!`);
      router.back();
    } catch (error) {
      console.error("Form submission error:", error);
      showToast.error("Error", "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <PageHeader title={config.title} showClose />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>{config.subtitle}</Text>

          {/* Dynamic form fields */}
          {config.fields.map((field) => (
            <CustomInput
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChangeText={(value) => handleInputChange(field.name, value)}
              iconName={field.icon}
              keyboardType={field.keyboardType || "default"}
              multiline={field.multiline}
            />
          ))}

          {/* Dynamic options (switches/checkboxes) */}
          {config.options?.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={styles.optionRow}
              onPress={() => handleOptionToggle(option.name)}
            >
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  options[option.name] && styles.checkboxChecked,
                ]}
              >
                {options[option.name] && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.textWhite}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom buttons */}
        <View style={styles.bottomButtons}>
          <PrimaryButton
            title={config.submitText}
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          />
          <SecondaryButton
            title="Cancel"
            onPress={() => router.back()}
            disabled={isLoading}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(spacing.md),
    paddingBottom: vs(180), // Space for bottom buttons
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    marginBottom: vs(spacing.xl),
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: vs(spacing.md),
    marginTop: vs(spacing.lg),
  },
  optionTextContainer: {
    flex: 1,
    marginRight: ms(spacing.md),
  },
  optionLabel: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(4),
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textGrey1,
  },
  checkbox: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(6),
    borderWidth: 2,
    borderColor: colors.outline,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.error,
    textAlign: "center",
    marginTop: vs(spacing.xl),
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: ms(spacing.lg),
    paddingBottom: vs(spacing.xl),
    gap: vs(spacing.sm),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});
