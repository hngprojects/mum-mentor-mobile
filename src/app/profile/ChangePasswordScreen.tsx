// src/screens/ChangePasswordScreen.tsx

import {
  ApiErrorResponse,
  changePassword,
} from "@/src/core/services/authService";
import { colors, typography } from "@/src/core/styles";
import { ms, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";

interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    return password.length >= 8;
  };

  const isPasswordStrong = validatePasswordStrength(newPassword);
  const isConfirmPasswordStrong = validatePasswordStrength(confirmNewPassword);
  const passwordsMatch =
    newPassword === confirmNewPassword && newPassword.length > 0;

  const handleChangePassword = async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!isPasswordStrong) {
      newErrors.newPassword =
        "Password too weak, must be at least 8 characters";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your password";
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call the API to change password
    setIsLoading(true);
    try {
      const payload: ChangePasswordPayload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      };

      const response = await changePassword(payload);

      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ Error changing password:", error);

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      const responseData = axiosError.response?.data;

      // Handle different error cases
      if (statusCode === 401) {
        setErrors({ oldPassword: "Old password is incorrect" });
      } else if (statusCode === 422) {
        // Check if errors are nested in error.errors (your backend structure)
        const validationErrors =
          //@ts-ignore
          responseData?.error?.errors || responseData?.detail;

        if (Array.isArray(validationErrors)) {
          const fieldErrors: { [key: string]: string } = {};

          validationErrors.forEach((err: any) => {
            // Get the field name from the loc array (last item, converting snake_case to camelCase)
            const field = err.loc[err.loc.length - 1];
            const camelCaseField = field.replace(/_([a-z])/g, (g: string) =>
              g[1].toUpperCase()
            );

            // Use the error message from the backend
            fieldErrors[camelCaseField] = err.msg || "Invalid input";
          });

          setErrors(fieldErrors);
        } else {
          setErrors({
            general: "Validation failed. Please check your inputs.",
          });
        }
      } else if (responseData?.message) {
        // Handle the top-level message field from your backend
        setErrors({ general: responseData.message });
      } else if (responseData?.detail) {
        // Fallback to detail field
        setErrors({
          general:
            typeof responseData.detail === "string"
              ? responseData.detail
              : "Failed to change password",
        });
      } else {
        setErrors({ general: "Failed to change password. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* General Error Message */}
        {errors.general && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        {/* Old Password */}
        <CustomInput
          label="Enter Old Password"
          placeholder="Enter Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          iconName="lock-closed-outline"
          isPassword
          isError={!!errors.oldPassword}
          errorMessage={errors.oldPassword}
        />

        {/* New Password */}
        <View style={styles.inputWrapper}>
          <CustomInput
            label="Enter New Password"
            placeholder="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            iconName="lock-closed-outline"
            isPassword
            isError={!!errors.newPassword}
            errorMessage={errors.newPassword}
            isValid={isPasswordStrong && newPassword.length > 0}
          />

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <View style={styles.strengthIndicator}>
              {!isPasswordStrong ? (
                <>
                  <Ionicons
                    name="shield"
                    size={16}
                    color="#F59E0B"
                    style={styles.strengthIcon}
                  />
                  <Text style={styles.weakPasswordText}>
                    Password too weak, must be at least 8 characters
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                    style={styles.strengthIcon}
                  />
                  <Text style={styles.strongPasswordText}>Strong password</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputWrapper}>
          <CustomInput
            label="Confirm New Password"
            placeholder="Enter New Password"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            iconName="lock-closed-outline"
            isPassword
            isError={!!errors.confirmNewPassword}
            errorMessage={errors.confirmNewPassword}
            isValid={passwordsMatch && isConfirmPasswordStrong}
          />

          {/* Confirm Password Strength Indicator */}
          {confirmNewPassword.length > 0 && (
            <View style={styles.strengthIndicator}>
              {!isConfirmPasswordStrong || !passwordsMatch ? (
                <>
                  <Ionicons
                    name="shield"
                    size={16}
                    color="#F59E0B"
                    style={styles.strengthIcon}
                  />
                  <Text style={styles.weakPasswordText}>
                    {!passwordsMatch
                      ? "Passwords do not match"
                      : "Password too weak, must be at least 8 characters"}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                    style={styles.strengthIcon}
                  />
                  <Text style={styles.strongPasswordText}>Strong password</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Change Password Button */}
        <PrimaryButton
          title="Change Password"
          onPress={handleChangePassword}
          isLoading={isLoading}
          disabled={
            !oldPassword ||
            !newPassword ||
            !confirmNewPassword ||
            !isPasswordStrong ||
            !passwordsMatch ||
            isLoading
          }
        />
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={ms(60)}
                color={colors.success}
              />
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>
              Password changed successfully
            </Text>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: ms(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingTop: vs(20),
    paddingBottom: vs(40),
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error,
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: vs(8),
  },
  strengthIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
  },
  strengthIcon: {
    marginRight: ms(6),
  },
  weakPasswordText: {
    ...typography.bodySmall,
    color: "#F59E0B",
    flex: 1,
  },
  strongPasswordText: {
    ...typography.bodySmall,
    color: colors.success,
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(40),
  },
  modalContent: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(32),
    alignItems: "center",
    width: "100%",
    maxWidth: ms(320),
  },
  successIconContainer: {
    marginBottom: vs(20),
  },
  successTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(24),
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: vs(14),
    paddingHorizontal: ms(48),
    borderRadius: ms(8),
    width: "100%",
    alignItems: "center",
  },
  doneButtonText: {
    ...typography.bodyLarge,
    color: colors.textWhite,
    fontWeight: "600",
  },
});
