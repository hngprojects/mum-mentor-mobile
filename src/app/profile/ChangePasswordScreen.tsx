// src/screens/ChangePasswordScreen.tsx

import { colors, typography } from "@/src/core/styles";
import { ms, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AxiosError } from "axios";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import { changePassword, ApiErrorResponse } from "@/src/core/services/authService";

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
      
      console.log("✅ Password changed successfully:", response);

      // Show success message
      Alert.alert(
        "Success",
        "Your password has been changed successfully. Please log in with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear form
              setOldPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              // Navigate back
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error changing password:", error);
      
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      
      // Handle different error cases
      if (statusCode === 401) {
        setErrors({ oldPassword: "Old password is incorrect" });
      } else if (statusCode === 422) {
        // Validation errors
        const detail = axiosError.response?.data?.detail;
        if (Array.isArray(detail)) {
          const validationErrors: { [key: string]: string } = {};
          detail.forEach((err: any) => {
            const field = err.loc[err.loc.length - 1];
            validationErrors[field] = err.msg;
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: "Validation failed. Please check your inputs." });
        }
      } else if (axiosError.response?.data?.detail) {
        // Handle string detail message
        setErrors({ 
          general: typeof axiosError.response.data.detail === 'string' 
            ? axiosError.response.data.detail 
            : "Failed to change password" 
        });
      } else {
        setErrors({ general: "Failed to change password. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
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
});