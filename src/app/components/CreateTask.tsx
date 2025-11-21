import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton'; 
import SecondaryButton from '../components/SecondaryButton'; 

// --- REQUIRED STYLE IMPORTS ---
import { colors } from "../../core/styles/index";
import { ms } from "../../core/styles/scaling";
const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
  heading3: { fontSize: 20, fontFamily: 'System' },
  bodyMedium: { fontSize: 16, fontFamily: 'System' },
  bodySmall: { fontSize: 14, fontFamily: 'System' },
  labelMedium: { fontSize: 14, fontFamily: 'System' }, 
  caption: { fontSize: 12, fontFamily: 'System' }, 
  buttonText: { fontSize: 16, fontFamily: 'System' },
};
const fontFamilies = {
  regular: "System",
  semiBold: "System",
  bold: "System",
  extraBold: "System",
};
// ------------------------------

// --- REQUIRED COMPONENT IMPORTS ---

// ----------------------------------


interface CreateTaskFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onTaskCreated: () => void; // New prop to signal success to the parent
}

// --- MOCK DATE PICKER COMPONENT ---
const CustomDatePicker: React.FC<{
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}> = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible} onRequestClose={onCancel}>
      <View style={taskStyles.datePickerOverlay}>
        <View style={taskStyles.datePickerContainer}>
          <Text style={taskStyles.datePickerTitle}>Select Due Date</Text>
          
          <Text style={{ marginVertical: ms(spacing.sm), color: colors.textSecondary }}>
            [Native Date Picker UI Component Goes Here]
          </Text>

          <View style={taskStyles.datePickerButtonRow}>
            <SecondaryButton 
              title="Cancel" 
              onPress={onCancel} 
              style={taskStyles.datePickerCancelButton}
            />
            <PrimaryButton
              title="Confirm"
              onPress={() => onConfirm(new Date())} 
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
// --- END MOCK DATE PICKER ---


// --- CreateTaskForm using CustomInput, PrimaryButton, and SecondaryButton ---
const CreateTaskForm: React.FC<{ onCancel: () => void; onTaskCreated: () => void }> = ({
  onCancel,
  onTaskCreated,
}) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(''); 
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleCreateTask = () => {
    if (taskName.trim()) {
      onTaskCreated(); // Signal to parent that task is created
      // Optionally, reset form fields here if the modal remains open briefly
      setTaskName('');
      setDescription('');
      setDueDate('');
    } else {
      console.log("Task Name is required.");
    }
  };
  
  const handleDatePicker = () => {
    setIsDatePickerVisible(true);
  };
  
  const handleDateConfirm = (date: Date) => {
    setDueDate(date.toDateString()); 
    setIsDatePickerVisible(false); 
  };
  
  const handleDateCancel = () => {
    setIsDatePickerVisible(false); 
  };
  
  return (
    <View style={taskStyles.formContainer}>
      <Text style={taskStyles.formTitle}>Create New Task</Text>

      {/* 1. Task Name using CustomInput */}
      <CustomInput
        label="Task Name"
        placeholder="What do you want to do?"
        value={taskName}
        onChangeText={setTaskName}
        iconName="person-outline" 
      />

      {/* 2. Due Date using CustomInput wrapped in TouchableOpacity for Picker effect */}
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={handleDatePicker} 
        style={taskStyles.dateInputWrapper}
      >
        <CustomInput
          label="Due Date"
          placeholder="Select Date"
          value={dueDate || 'Select Date'} 
          onChangeText={() => {}} 
          iconName="calendar-number"
          isValid={!!dueDate}
        />
      </TouchableOpacity>

      {/* 3. Description using CustomInput */}
      <View style={taskStyles.descriptionWrapper}>
        <CustomInput
          label="Description (optional)"
          placeholder="Anything else?"
          value={description}
          onChangeText={setDescription}
          iconName="mail-outline" 
          secureTextEntry={false}
        />
      </View>


      {/* Action Buttons (Vertical Stack) */}
      <View style={taskStyles.buttonRow}>
        
        <PrimaryButton
          title="Create Task"
          onPress={handleCreateTask}
          style={taskStyles.createTaskButton}
          disabled={!taskName.trim()}
        />
        <SecondaryButton
          title="Cancel"
          onPress={onCancel}
          style={taskStyles.cancelButton}
        />

      </View>

      {/* DATE PICKER COMPONENT (Mock) */}
      <CustomDatePicker
        isVisible={isDatePickerVisible}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </View>
  );
};


const CreateTaskFormModal: React.FC<CreateTaskFormModalProps> = ({ isVisible, onClose, onTaskCreated }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={taskStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose} // Only close if clicking overlay when form is present
      >
        {/* Inner TouchableOpacity prevents clicks within the modal content from closing the modal */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={taskStyles.modalContent}>
            <CreateTaskForm
              onCancel={onClose}
              onTaskCreated={onTaskCreated}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CreateTaskFormModal;

// --- STYLES FOR TASK MODAL ---
const taskStyles = StyleSheet.create({
  // Modal positioning and background for the form modal (bottom sheet)
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Position content at the bottom
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    paddingHorizontal: ms(spacing.md),
    paddingBottom: ms(spacing.md),
    width: '100%',
  } as ViewStyle,

  formContainer: {
    paddingTop: 0, 
    gap: ms(spacing.xs),
  } as ViewStyle,
  formTitle: {
    fontFamily: fontFamilies.extraBold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm), 
    marginTop: ms(spacing.sm), 
  } as TextStyle,

  dateInputWrapper: { 
    marginBottom: 0, 
  } as ViewStyle,
  
  descriptionWrapper: {
    minHeight: ms(100), 
    marginBottom: 0,
  } as ViewStyle,

  buttonRow: {
    flexDirection: "column", 
    gap: ms(spacing.xs), 
    marginTop: ms(spacing.sm), 
  } as ViewStyle,
  
  cancelButton: {
    // Full width
  } as ViewStyle,
  
  createTaskButton: {
    // Full width
  } as ViewStyle,

  // Date Picker Modal Container Styles 
  datePickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  } as ViewStyle,
  datePickerContainer: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(spacing.md), 
    width: '85%',
    alignItems: 'center',
  } as ViewStyle,
  datePickerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm), 
  } as TextStyle,
  
  datePickerButtonRow: {
    flexDirection: "row",
    gap: ms(spacing.sm),
    marginTop: ms(spacing.sm),
  } as ViewStyle,
  datePickerCancelButton: {
    flex: 1,
    marginRight: ms(spacing.xs),
  } as ViewStyle,

  // NOTE: Success screen styles are removed from here as it's now a separate modal
});