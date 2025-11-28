import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Theme and Utilities ---
import { defaultTheme, spacing } from "../../core/styles/index";
import { ms, vs } from "../../core/styles/scaling";

// --- Components ---
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";

// --- API Service ---
import { AxiosError } from "axios";
import {
  ApiErrorResponse,
  resetPassword,
} from "../../core/services/authService";

// Destructure theme values outside component to prevent re-renders
const { colors, typography } = defaultTheme;
const arrowIcon = require("../../assets/images/arrow.png");

export default function ResetPassword() {
  const params = useLocalSearchParams<{
    verificationToken: string;
    email: string;
  }>();
  const verificationToken = params.verificationToken;
  const email = params.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password validation states
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // ✅ Debug: Log token on mount (only once)
  useEffect(() => {
    if (!verificationToken) {
      Alert.alert(
        "Error",
        "Verification token is missing. Please restart the password reset process.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/ForgotPasswordScreen"),
          },
        ]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Run only once on mount

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setNewPasswordError("Password must be at least 8 characters");
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = (): boolean => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleResetPassword = async () => {
    // Validate inputs
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword();

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    if (!verificationToken) {
      Alert.alert("Error", "Verification token is missing. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // FIXED: Order matters! Match the exact order from API documentation
      const payload = {
        new_password: newPassword,
        confirm_password: confirmPassword,
        token: verificationToken,
      };

      await resetPassword(payload);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {

      let errorMessage = "Failed to reset password. Please try again.";

      if ((error as any).isAxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const responseData = axiosError.response?.data;

        errorMessage =
          responseData?.message ||
          (typeof responseData?.detail === "string"
            ? responseData.detail
            : errorMessage);

        console.error("Server error details:", responseData);
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // ✅ FIXED: Correct path to SignInScreen
    router.replace("/(auth)/SignInScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <Image source={arrowIcon} style={styles.arrowImage} />
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
        </View>
        <Text style={styles.subtitle}>
          Create a new password for {email || "your account"}
        </Text>

        <View style={styles.inputWrapper}>
          <CustomInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (newPasswordError) validatePassword(text);
            }}
            iconName="lock-closed-outline"
            isPassword={true}
            isError={!!newPasswordError}
            errorMessage={newPasswordError}
            isValid={newPassword.length >= 8 && !newPasswordError}
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError && newPassword === text) {
                setConfirmPasswordError("");
              }
            }}
            iconName="lock-closed-outline"
            isPassword={true}
            isError={!!confirmPasswordError}
            errorMessage={confirmPasswordError}
            isValid={
              confirmPassword.length > 0 &&
              newPassword === confirmPassword &&
              !confirmPasswordError
            }
          />
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={isLoading ? "RESETTING..." : "Reset Password"}
            onPress={handleResetPassword}
            isLoading={isLoading}
            disabled={!newPassword || !confirmPassword || isLoading}
          />
        </View>
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
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark"
                size={ms(48)}
                color={colors.textWhite}
              />
            </View>
            <Text style={styles.modalTitle}>Password reset successful!</Text>
            <Text style={styles.modalSubtitle}>
              Your password has been successfully reset. You can now log in with
              your new password.
            </Text>
            <PrimaryButton
              title="Back to Login"
              onPress={handleSuccessModalClose}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Styles created outside component with destructured theme values
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingTop: vs(60),
    paddingBottom: vs(40),
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: vs(32),
  },
  inputWrapper: {
    marginBottom: vs(20),
  },
  buttonWrapper: {
    marginTop: vs(24),
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(24),
    alignItems: "center",
    width: "85%",
    maxWidth: ms(400),
  },
  successIcon: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(16),
  },
  modalTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(8),
    textAlign: "center",
  },
  modalSubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
    marginBottom: vs(24),
  },
  modalButton: {
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xs,
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
