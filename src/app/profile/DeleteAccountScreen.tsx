// src/screens/DeleteAccountScreen.tsx

import { colors, fontFamilies, spacing, typography } from "@/src/core/styles";
import { ms } from "@/src/core/styles/scaling";
import { Feather } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";

const DeleteAccountScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const REQUIRED_PHRASE = "DELETE MY ACCOUNT";

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!confirmationPhrase.trim()) {
      newErrors.confirmationPhrase = "Confirmation phrase is required";
    } else if (confirmationPhrase.trim() !== REQUIRED_PHRASE) {
      newErrors.confirmationPhrase = `Please type exactly: ${REQUIRED_PHRASE}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to ConfirmDelete screen with the data
      router.push({
        pathname: "/profile/ConfirmDelete",
        params: {
          confirmationPhrase: confirmationPhrase.trim(),
          password: password,
        },
      });
    }
  };

  const isButtonDisabled =
    !password.trim() ||
    !confirmationPhrase.trim() ||
    confirmationPhrase.trim() !== REQUIRED_PHRASE;

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
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Warning Text */}
          <View style={styles.warningContainer}>
            <Feather name="alert-circle" size={ms(48)} color={colors.error} />
            <Text style={styles.warningTitle}>This action is permanent</Text>
            <Text style={styles.warningText}>
              Deleting your account will permanently remove all your data including:
            </Text>
            <View style={styles.warningList}>
              <Text style={styles.warningListItem}>• Your profile information</Text>
              <Text style={styles.warningListItem}>• All your posts and content</Text>
              <Text style={styles.warningListItem}>• Your task history</Text>
              <Text style={styles.warningListItem}>• All associated data</Text>
            </View>
            <Text style={styles.warningSubtext}>
              This action cannot be undone.
            </Text>
          </View>

          {/* Confirmation Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              To confirm deletion, please:
            </Text>
            <Text style={styles.instructionsText}>
              1. Type the phrase: <Text style={styles.requiredPhrase}>{REQUIRED_PHRASE}</Text>
            </Text>
            <Text style={styles.instructionsText}>
              2. Enter your current password
            </Text>
          </View>

          {/* Confirmation Phrase Input */}
          <CustomInput
            label="Confirmation Phrase"
            placeholder={`Type: ${REQUIRED_PHRASE}`}
            value={confirmationPhrase}
            onChangeText={(text) => {
              setConfirmationPhrase(text);
              if (errors.confirmationPhrase) {
                setErrors({ ...errors, confirmationPhrase: "" });
              }
            }}
            isError={!!errors.confirmationPhrase}
            errorMessage={errors.confirmationPhrase}
            iconName="alert-triangle"
          />

          {/* Password Input */}
          <CustomInput
            label="Current Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
            isError={!!errors.password}
            errorMessage={errors.password}
            iconName="lock"
            secureTextEntry
          />
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={isButtonDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

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
  warningContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: ms(12),
    padding: ms(spacing.lg),
    marginBottom: ms(spacing.xl),
    alignItems: "center",
  },
  warningTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.error,
    marginTop: ms(spacing.sm),
    marginBottom: ms(spacing.sm),
  },
  warningText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: ms(spacing.sm),
  },
  warningList: {
    alignSelf: "stretch",
    marginBottom: ms(spacing.sm),
  },
  warningListItem: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xs / 2),
  },
  warningSubtext: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.error,
    marginTop: ms(spacing.xs),
  },
  instructionsContainer: {
    marginBottom: ms(spacing.lg),
  },
  instructionsTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  instructionsText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    marginBottom: ms(spacing.xs / 2),
  },
  requiredPhrase: {
    fontFamily: fontFamilies.bold,
    color: colors.error,
  },
  buttonContainer: {
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
});