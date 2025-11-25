import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/src/core/styles';
import { ms, vs, rbr } from '@/src/core/styles/scaling';

interface DatePickerInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onDateChange: (date: string) => void;
  isError?: boolean;
  errorMessage?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  placeholder = 'Select Date',
  value,
  onDateChange,
  isError = false,
  errorMessage,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(value ? new Date(value) : new Date());

  const formatDate = (dateObj: Date): string => {
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);
    }
  };

  const handleConfirm = () => {
    setShowPicker(false);
    const formattedDate = formatDate(date);
    onDateChange(formattedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isError && styles.inputContainerError,
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
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
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {isError && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

      {/* Android DatePicker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS DatePicker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
                maximumDate={new Date()}
                textColor={colors.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DatePickerInput;

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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: rbr(20),
    borderTopRightRadius: rbr(20),
    paddingBottom: vs(20),
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
  cancelButton: {
    ...typography.labelLarge,
    color: colors.textGrey1,
  },
  confirmButton: {
    ...typography.labelLarge,
    color: colors.primary,
  },
});