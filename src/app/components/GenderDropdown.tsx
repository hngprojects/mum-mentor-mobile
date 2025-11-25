import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/src/core/styles';
import { ms, vs, rbr } from '@/src/core/styles/scaling';

interface GenderDropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  isError?: boolean;
  errorMessage?: string;
}

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const GenderDropdown: React.FC<GenderDropdownProps> = ({
  label,
  value,
  onValueChange,
  isError = false,
  errorMessage,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isError && styles.inputContainerError,
        ]}
        onPress={() => setShowModal(true)}
      >
        <Ionicons
          name="male-female-outline"
          size={20}
          color={isError ? colors.error : colors.textGrey1}
          style={styles.icon}
        />
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholder,
            isError && styles.errorText,
          ]}
        >
          {value || 'Select Gender'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.textGrey1}
        />
      </TouchableOpacity>

      {isError && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item.value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default GenderDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: vs(16),
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: rbr(10),
    paddingHorizontal: ms(12),
    paddingVertical: vs(12),
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: ms(10),
  },
  inputText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: colors.textGrey2,
  },
  errorText: {
    color: colors.error,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.error,
    marginTop: vs(4),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: ms(20),
  },
  modalContent: {
    backgroundColor: colors.backgroundMain,
    borderRadius: rbr(16),
    width: '100%',
    maxWidth: ms(400),
    maxHeight: vs(300),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  modalTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: vs(16),
    borderBottomWidth: 0.1,
    borderBottomColor: colors.outlineVariant,
  },
  optionItemSelected: {
    backgroundColor: colors.secondaryExtraLight,
  },
  optionText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: typography.labelLarge.fontFamily,
  },
});