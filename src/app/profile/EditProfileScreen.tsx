// components/EditProfileModal.tsx
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

// --- API Imports ---
import { showToast } from "@/src/core/utils/toast";
import apiClient from "../../core/services/apiClient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  profile_image?: string;
  mom_status?: string;
  goals?: string[];
  partner?: {
    name: string;
    email: string;
  };
  children?: any[];
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
  userProfile?: UserProfile | null;
}

export default function EditProfileModal({
  visible,
  onClose,
  onProfileUpdated,
  userProfile,
}: EditProfileModalProps) {
  // --- State Variables ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMomStatus, setSelectedMomStatus] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mom status options mapping
  const momStatuses = [
    { label: "Pregnant", value: "pregnant" },
    { label: "New Mom", value: "new_mom" },
    { label: "Toddler Mom", value: "toddler_mom" },
    { label: "Mixed", value: "mixed" },
  ];

  const availableGoals = [
    "Sleep",
    "Feeding",
    "Body Recovery",
    "Emotional Tracker",
    "Mental Wellness",
    "Routine Builder",
  ];

  // --- Effects ---
  useEffect(() => {
    if (visible && userProfile) {
      setFullName(userProfile.full_name || "");
      setEmail(userProfile.email || "");
      setSelectedMomStatus(userProfile.mom_status || "");
      setSelectedGoals(userProfile.goals || []);
    }
  }, [visible, userProfile]);

  // --- Handlers ---
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!selectedMomStatus) {
        showToast.error("Validation Error", "Please select your mom status.");
        setLoading(false);
        return;
      }

      const profileSetupData = {
        mom_status: selectedMomStatus,
        goals: selectedGoals,
      };

      console.log("📝 Attempting to save profile setup:", profileSetupData);

      try {
        // Try PATCH first
        console.log("📤 Trying PATCH...");
        const patchResponse = await apiClient.patch(
          "/api/v1/profile-setup/",
          profileSetupData
        );
        console.log("✅ PATCH successful:", patchResponse.data);

        if (onProfileUpdated) {
          onProfileUpdated();
        }

        showToast.success("Success", "Profile updated successfully!");
        onClose();
        return;
      } catch (patchError: any) {
        const patchStatus = patchError.response?.status;
        const patchErrorDetail = patchError.response?.data?.error?.detail || "";

        console.log("❌ PATCH failed:", patchStatus);
        console.log("Error detail:", patchErrorDetail);

        // Check if database table doesn't exist (500 error with specific message)
        if (
          patchStatus === 500 &&
          patchErrorDetail.includes("profile_setup") &&
          patchErrorDetail.includes("does not exist")
        ) {
          Alert.alert(
            "Feature Not Available",
            "Profile customization is currently being set up on our servers. This feature will be available soon. We apologize for the inconvenience.",
            [
              {
                text: "OK",
                onPress: () => onClose(),
              },
            ]
          );
          setLoading(false);
          return;
        }

        // If it's 404 (not found), try POST to create
        if (patchStatus === 404) {
          console.log("📤 Profile not found, trying POST to create...");

          try {
            const createData = {
              mom_status: selectedMomStatus,
              goals: selectedGoals,
              partner: {
                name: "",
                email: "",
              },
              children: [],
            };

            const postResponse = await apiClient.post(
              "/api/v1/profile-setup/",
              createData
            );
            console.log("✅ POST successful:", postResponse.data);

            if (onProfileUpdated) {
              onProfileUpdated();
            }

            showToast.success("Success", "Profile created successfully!");
            onClose();
            return;
          } catch (postError: any) {
            const postStatus = postError.response?.status;
            const postErrorDetail =
              postError.response?.data?.error?.detail || "";

            console.log("❌ POST failed:", postStatus);

            // Check for database error on POST as well
            if (
              postStatus === 500 &&
              postErrorDetail.includes("profile_setup") &&
              postErrorDetail.includes("does not exist")
            ) {
              Alert.alert(
                "Feature Not Available",
                "Profile customization is currently being set up on our servers. This feature will be available soon. We apologize for the inconvenience.",
                [
                  {
                    text: "OK",
                    onPress: () => onClose(),
                  },
                ]
              );
              setLoading(false);
              return;
            }

            // Re-throw if it's a different error
            throw postError;
          }
        }

        // If it's 405 (Method Not Allowed), the endpoint might not support the operation
        if (patchStatus === 405) {
          Alert.alert(
            "Feature Not Available",
            "This feature is currently unavailable. Please contact support if the issue persists.",
            [
              {
                text: "OK",
                onPress: () => onClose(),
              },
            ]
          );
          setLoading(false);
          return;
        }

        // Re-throw for other errors
        throw patchError;
      }
    } catch (error: any) {
      console.error("❌ Unexpected error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Failed to update profile. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map((err: any) => err.msg)
            .join("\n");
        } else if (typeof error.response.data.detail === "string") {
          errorMessage = error.response.data.detail;
        }
      }

      showToast.error("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Your Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Image
                source={{
                  uri:
                    userProfile?.profile_image ||
                    "https://i.pravatar.cc/150?img=5",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={20} color={colors.textWhite} />
              </TouchableOpacity>
            </View>

            {/* Info Notice */}
            <View style={styles.noticeBox}>
              <Feather name="info" size={20} color={colors.primary} />
              <Text style={styles.noticeText}>
                Customize your profile to get personalized recommendations
              </Text>
            </View>

            {/* Full Name Field - Read Only */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputContainer, styles.disabledInput]}>
                <Feather
                  name="user"
                  size={20}
                  color={colors.textGrey1}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.disabledInputText]}
                  value={fullName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textGrey2}
                  editable={false}
                />
              </View>
              <Text style={styles.helperText}>
                Contact support to change your name
              </Text>
            </View>

            {/* Email Field (Read-only) */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputContainer, styles.disabledInput]}>
                <Feather
                  name="mail"
                  size={20}
                  color={colors.textGrey1}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.disabledInputText]}
                  value={email}
                  placeholder="Email address"
                  placeholderTextColor={colors.textGrey2}
                  editable={false}
                />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            {/* Mom Status */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Mom Status *</Text>
              <View style={styles.chipContainer}>
                {momStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.chip,
                      selectedMomStatus === status.value && styles.chipSelected,
                    ]}
                    onPress={() => setSelectedMomStatus(status.value)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedMomStatus === status.value &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goals */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Your Goals</Text>
              <View style={styles.chipContainer}>
                {availableGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.chip,
                      selectedGoals.includes(goal) && styles.chipSelected,
                    ]}
                    onPress={() => toggleGoal(goal)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedGoals.includes(goal) && styles.chipTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.textWhite,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: SCREEN_HEIGHT * 0.9,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: colors.textPrimary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.textWhite,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: ms(spacing.md),
    backgroundColor: colors.primaryExtraLight,
    borderRadius: ms(8),
    gap: ms(spacing.sm),
    marginBottom: ms(spacing.lg),
  },
  noticeText: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.primary,
    lineHeight: typography.bodySmall.fontSize * 1.4,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  disabledInput: {
    backgroundColor: colors.backgroundMain,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
  },
  disabledInputText: {
    color: colors.textGrey1,
  },
  helperText: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryExtraLight,
  },
  chipText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.semiBold,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textWhite,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
});
