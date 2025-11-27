import React from "react";
import { Modal, StyleSheet, Text, View, ViewStyle, TextStyle, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";


interface TaskCreationSuccessModalProps {
  isVisible: boolean;
  onDone: () => void;
}

const TaskCreationSuccessModal: React.FC<TaskCreationSuccessModalProps> = ({ isVisible, onDone }) => (
  <Modal
    animationType="fade" // Fade in/out for a central modal is usually smoother
    transparent={true}
    visible={isVisible}
    onRequestClose={onDone} // Allow closing with back button
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onDone} 
    >
      <TouchableOpacity activeOpacity={1} onPress={() => {}}>
        <View style={styles.modalContent}>
          {/* Success Icon */}
          <View style={styles.successIconWrapper}>
            <Feather name="check" size={ms(32)} color={colors.success} />
          </View>

          <Text style={styles.successTitle}>Task created successfully</Text>

          {/* View Task Button */}
          <PrimaryButton
            title="View Task"
            onPress={() => {
              onDone();
              router.push("../components/TaskPage");
            }}
            style={styles.successButton}
          />
          
          {/* Done Button */}
          <SecondaryButton
            title="Done"
            onPress={onDone}
            style={styles.doneButton}
          />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export default TaskCreationSuccessModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.textWhite, 
    borderRadius: ms(16), 
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.xl),  
    maxWidth: ms(350), 
    alignItems: "center", 
  } as ViewStyle,

  successIconWrapper: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(70),
    backgroundColor: colors.textWhite,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ms(spacing.md),
  } as ViewStyle,
  successTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
    // Kept at lg (24) for compact spacing
    marginBottom: ms(spacing.lg), 
  } as TextStyle,
  successButton: {
    width: "100%", 
    paddingVertical: ms(spacing.sm),
    marginBottom: ms(spacing.sm),
  } as ViewStyle,
  doneButton: {
    width: "100%",
    paddingVertical: ms(spacing.sm),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  } as ViewStyle,
});