import React from "react";
import { Modal, StyleSheet, Text, View, ViewStyle, TextStyle, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import PrimaryButton from '../components/PrimaryButton'; 
// --- REQUIRED STYLE IMPORTS ---
// NOTE: Mocking imports as external files are not available
const colors = {
  textWhite: "#FFFFFF",
  success: "#10B981", 
  textPrimary: "#1E293B",
};
const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
  heading3: { fontSize: 20, fontFamily: 'System' },
};
const fontFamilies = {
  semiBold: "System",
};
const ms = (size: number) => size; // Mock scaling function
// ------------------------------

// --- REQUIRED COMPONENT IMPORTS ---

// ----------------------------------


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
      onPress={onDone} // Close on overlay press
    >
      {/* Inner TouchableOpacity to prevent closing when clicking content */}
      <TouchableOpacity activeOpacity={1} onPress={() => {}}>
        <View style={styles.modalContent}>
          {/* Success Icon */}
          <View style={styles.successIconWrapper}>
            <Feather name="check" size={ms(32)} color={colors.success} />
          </View>

          <Text style={styles.successTitle}>Task created successfully</Text>

          {/* Done Button using the imported PrimaryButton */}
          <PrimaryButton
            title="Done"
            onPress={onDone}
            style={styles.successButton}
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
    justifyContent: "center", // Center content vertically
    alignItems: "center",     // Center content horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.textWhite, // White background for the card
    borderRadius: ms(16), // Rounded corners for the central card
    paddingHorizontal: ms(spacing.lg), // Adjust padding for a smaller card
    paddingVertical: ms(spacing.xl),   // Adjust padding for a smaller card
    // FIXED: Increased width from 80% to 90% to prevent horizontal clipping of the button text
    width: '90%', 
    maxWidth: ms(350), // Max width to prevent it from getting too large on tablets
    alignItems: "center", // Center items within the card
  } as ViewStyle,

  successIconWrapper: {
    width: ms(70), // Slightly larger icon as per screenshot
    height: ms(70),
    borderRadius: ms(35),
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
    width: "10%", 
  
    paddingVertical: ms(spacing.sm), 
  } as ViewStyle,
});