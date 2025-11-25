// components/EditProfileModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  visible,
  onClose,
}: EditProfileModalProps) {
  const [name, setName] = useState("Tracy Michaels");
  const [email, setEmail] = useState("tracymichaels@gmail.com");
  const [selectedMomStatus, setSelectedMomStatus] = useState("New Mom");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Feeding",
    "Body Recovery",
    "Emotional Tracker",
    "Mental Wellness",
  ]);

  const momStatuses = ["Pregnant", "New Mom", "Toddler Mom", "Mixed"];
  const availableGoals = [
    "Sleep",
    "Feeding",
    "Body Recovery",
    "Emotional Tracker",
    "Mental Wellness",
    "Routine Builder",
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSave = () => {
    console.log("Saving profile...", {
      name,
      email,
      selectedMomStatus,
      selectedGoals,
    });
    onClose();
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
                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={20} color={colors.textWhite} />
              </TouchableOpacity>
            </View>

            {/* Name/Nickname Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Name/Nickname</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="user"
                  size={20}
                  color={colors.textGrey1}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textGrey2}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="mail"
                  size={20}
                  color={colors.textGrey1}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textGrey2}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Mom Status */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Mom Status</Text>
              <View style={styles.chipContainer}>
                {momStatuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      selectedMomStatus === status && styles.chipSelected,
                    ]}
                    onPress={() => setSelectedMomStatus(status)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedMomStatus === status && styles.chipTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goals */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Goals</Text>
              <View style={styles.chipContainer}>
                {availableGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.chip,
                      selectedGoals.includes(goal) && styles.chipSelected,
                    ]}
                    onPress={() => toggleGoal(goal)}
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
                <TouchableOpacity style={styles.chip}>
                  <Feather name="plus" size={16} color={colors.textGrey1} />
                  <Text style={[styles.chipText, { marginLeft: 4 }]}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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