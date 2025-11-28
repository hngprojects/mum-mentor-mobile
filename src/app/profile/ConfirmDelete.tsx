import { colors, typography } from "@/src/core/styles";
import { ms, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/CustomInput";
import DeleteConfirmModal from "../components/DeleteConfirmationModal";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

const ConfirmDelete = () => {
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
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccessModal(true);
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsLoading(false);
      setErrors({ general: "Failed to delete account" });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate to login or welcome screen
    // router.replace('/auth/SignUpScreen');
  };

  const isConfirmDisabled = !email || !validateEmail(email) || isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Warning Text */}
          <View style={styles.deleteTextContainer}>
            <Text style={styles.deleteText}>
              Please note this is a permanent and can&apos;t be undone. To
              confirm deleting your account please enter your email.
            </Text>
          </View>

          {/* Email Input */}
          <CustomInput
            label="Email"
            placeholder="Enter Email Address"
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
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Confirm"
            onPress={handleConfirmPress}
            isLoading={isLoading}
            disabled={isConfirmDisabled}
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
          title="Delete successfully"
          onClose={handleSuccessClose}
          buttonText="Done"
          iconComponent={
            <Image
              source={require("../../assets/images/success-icon.png")}
              style={styles.successIcon}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfirmDelete;

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
    paddingBottom: vs(20),
  },
  confirmTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: vs(8),
    marginBottom: vs(16),
  },
  deleteTextContainer: {
    marginBottom: vs(24),
  },
  deleteText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  successIcon: {
    width: ms(60),
    height: ms(60),
  },
});
