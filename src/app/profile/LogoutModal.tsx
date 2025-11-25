import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Ionicons 
            name="lock-closed-outline" 
            size={ms(32)} 
            color={colors.textPrimary} 
          />
          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.message}>Are you sure you want to log out?</Text>
          
          <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(spacing.xl),
    alignItems: "center",
    gap: ms(spacing.md),
  },
  title: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  message: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.bodyMedium.fontSize * 1.4,
  },
  logoutBtn: {
    backgroundColor: colors.error,
    paddingVertical: ms(spacing.md),
    borderRadius: ms(12),
    width: "100%",
    marginTop: ms(spacing.sm),
  },
  logoutText: {
    textAlign: "center",
    color: colors.textWhite,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: colors.error,
    paddingVertical: ms(spacing.md),
    borderRadius: ms(12),
    width: "100%",
    backgroundColor: colors.textWhite,
  },
  cancelText: {
    textAlign: "center",
    color: colors.error,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
});