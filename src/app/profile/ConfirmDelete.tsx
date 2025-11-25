import { colors, fontFamilies, spacing, typography } from "@/src/core/styles";
import { ms } from "@/src/core/styles/scaling";
import { deleteAccount } from "@/src/core/services/authService";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../components/CustomInput";
import DeleteConfirmModal from "../components/DeleteConfirmationModal";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

const ONBOARDING_KEY = "@OnboardingComplete";

const ConfirmDelete = () => {
  const params = useLocalSearchParams();
  const confirmationPhrase = (params.confirmationPhrase as string) || "";
  const password = (params.password as string) || "";

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirmPress = () => {
    if (validateEmail(email)) {
      setShowDeleteModal(true);
    } else {
      setErrors({ email: "Please enter a valid email address" });
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsLoading(true);

    try {
      // Call delete account API with confirmation phrase and password
      await deleteAccount({
        confirmation_phrase: confirmationPhrase,
        password: password,
      });

      // Clear onboarding status IMMEDIATELY after successful deletion
      try {
        await AsyncStorage.removeItem(ONBOARDING_KEY);
        console.log('✅ Onboarding status cleared');
      } catch (error) {
        console.error("Failed to clear onboarding status:", error);
      }

      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setIsLoading(false);

      // Handle error
      let errorMessage = "Failed to delete account. Please try again.";
      
      if (error?.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // Handle validation errors
          errorMessage = error.response.data.detail
            .map((err: any) => err.msg)
            .join(", ");
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Delete Failed", errorMessage);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate to sign up screen after successful account deletion
    router.replace("/(auth)/SignUpScreen");
  };

  const isConfirmDisabled = !email || !validateEmail(email) || isLoading;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={ms(24)} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Deletion</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Final Confirmation Warning */}
          <View style={styles.finalWarningContainer}>
            <Feather name="alert-octagon" size={ms(64)} color={colors.error} />
            <Text style={styles.finalWarningTitle}>Final Confirmation</Text>
            <Text style={styles.finalWarningText}>
              You are about to permanently delete your account. This is your last
              chance to cancel.
            </Text>
          </View>

          {/* Warning Text */}
          <View style={styles.deleteTextContainer}>
            <Text style={styles.deleteText}>
              Please enter your email address to confirm you want to delete this
              account. Once confirmed, all your data will be permanently removed.
            </Text>
          </View>

          {/* Email Input */}
          <CustomInput
            label="Email Address"
            placeholder="Enter your email to confirm"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
            keyboardType="email-address"
            isError={!!errors.email}
            errorMessage={errors.email}
            iconName="mail-outline"
            isValid={validateEmail(email) && !errors.email}
          />

          {/* Reminder of what was entered */}
          <View style={styles.reminderContainer}>
            <Text style={styles.reminderTitle}>Deletion Details:</Text>
            <Text style={styles.reminderText}>
              ✓ Confirmation phrase verified
            </Text>
            <Text style={styles.reminderText}>
              ✓ Password verified
            </Text>
            <Text style={styles.reminderText}>
              ✓ Ready to delete account
            </Text>
          </View>
        </ScrollView>

        {/* Delete Account Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Delete My Account"
            onPress={handleConfirmPress}
            isLoading={isLoading}
            disabled={isConfirmDisabled}
            style={styles.deleteButton}
          />
        </View>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          visible={showDeleteModal}
          onDelete={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          title="Account Deleted Successfully"
          onClose={handleSuccessClose}
          buttonText="Done"
          iconComponent={
            <Image
              source={require("../../assets/images/success-icon.png")}
              style={styles.successIcon}
            />
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfirmDelete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  backButton: {
    padding: ms(spacing.xs),
  },
  headerTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: ms(24),
    padding: ms(spacing.xs),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.lg),
    paddingBottom: ms(spacing.lg),
  },
  finalWarningContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: ms(12),
    borderWidth: 2,
    borderColor: colors.error,
    padding: ms(spacing.xl),
    marginBottom: ms(spacing.xl),
    alignItems: "center",
  },
  finalWarningTitle: {
    fontSize: typography.heading2.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.error,
    marginTop: ms(spacing.md),
    marginBottom: ms(spacing.sm),
  },
  finalWarningText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: typography.bodyMedium.fontSize * 1.5,
  },
  deleteTextContainer: {
    marginBottom: ms(spacing.xl),
  },
  deleteText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textGrey1,
    lineHeight: typography.bodyMedium.fontSize * 1.5,
  },
  reminderContainer: {
    backgroundColor: colors.backgroundSubtle,
    borderRadius: ms(12),
    padding: ms(spacing.md),
    marginTop: ms(spacing.lg),
  },
  reminderTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  reminderText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    marginBottom: ms(spacing.xs / 2),
  },
  buttonContainer: {
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  successIcon: {
    width: ms(60),
    height: ms(60),
  },
});