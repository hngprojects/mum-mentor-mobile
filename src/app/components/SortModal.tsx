// SortModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing, typography } from "../../core/styles/index";

export type SortOption = {
  id: string;
  label: string;
  orderBy: "name" | "status" | "due_date" | "created_at" | "updated_at";
  orderDirection: "asc" | "desc";
};

const SORT_OPTIONS: SortOption[] = [
  {
    id: "name_asc",
    label: "A-Z",
    orderBy: "name",
    orderDirection: "asc",
  },
  {
    id: "name_desc",
    label: "Z-A",
    orderBy: "name",
    orderDirection: "desc",
  },
  {
    id: "status_asc",
    label: "Completed first",
    orderBy: "status",
    orderDirection: "asc",
  },
  {
    id: "status_desc",
    label: "Pending First",
    orderBy: "status",
    orderDirection: "desc",
  },
  {
    id: "due_date_asc",
    label: "Due date (earliest)",
    orderBy: "due_date",
    orderDirection: "asc",
  },
  {
    id: "due_date_desc",
    label: "Due date (latest)",
    orderBy: "due_date",
    orderDirection: "desc",
  },
];

interface SortModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (option: SortOption) => void;
  onReset: () => void;
  selectedOption?: SortOption;
}

const SortModal: React.FC<SortModalProps> = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedOption,
}) => {
  const [tempSelected, setTempSelected] = useState<SortOption | undefined>(
    selectedOption
  );

  const handleApply = () => {
    if (tempSelected) {
      onApply(tempSelected);
    }
    onClose();
  };

  const handleReset = () => {
    setTempSelected(undefined);
    onReset();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort by</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={styles.optionsContainer}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => setTempSelected(option)}
              >
                <View style={styles.radioButton}>
                  {tempSelected?.id === option.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.textWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.textGrey2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundStrong,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  optionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  applyButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.bodyMedium.fontFamily,
  },
  resetButton: {
    backgroundColor: colors.textWhite,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.bodyMedium.fontFamily,
  },
});

export default SortModal;
