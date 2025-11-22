import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

// --- REQUIRED STYLE IMPORTS ---
import { createTask, updateTask } from "@/src/core/services/tasksService";
import { colors } from "../../core/styles/index";
import { ms } from "../../core/styles/scaling";
import DatePickerInput from "./DatePickerInput";

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
  heading3: { fontSize: 20, fontFamily: "System" },
  bodyMedium: { fontSize: 16, fontFamily: "System" },
  bodySmall: { fontSize: 14, fontFamily: "System" },
  labelMedium: { fontSize: 14, fontFamily: "System" },
  caption: { fontSize: 12, fontFamily: "System" },
  buttonText: { fontSize: 16, fontFamily: "System" },
};
const fontFamilies = {
  regular: "System",
  semiBold: "System",
  bold: "System",
  extraBold: "System",
};

interface CreateTaskFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  initData?: any;
}

const CustomDatePicker: React.FC<{
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}> = ({ isVisible, onConfirm, onCancel }) => {
  if (Platform.OS === "web") {
    return isVisible ? (
      <input
        type="date"
        onChange={(e) => {
          onConfirm(new Date(e.target.value));
        }}
        onBlur={onCancel}
        style={{ display: "block" }}
      />
    ) : null;
  }

  // Mobile
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

const CreateTaskForm: React.FC<{
  onCancel: () => void;
  onTaskCreated: () => void;
  initData?: any;
}> = ({ onCancel, onTaskCreated, initData }) => {
  const [taskName, setTaskName] = useState(initData?.name || "");
  const [description, setDescription] = useState(initData?.description || "");
  const [dueDate, setDueDate] = useState<Date | null>(
    initData?.due_date ? new Date(initData.due_date) : null
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Update form when initData changes
  React.useEffect(() => {
    if (initData) {
      setTaskName(initData.name || "");
      setDescription(initData.description || "");
      setDueDate(initData.due_date ? new Date(initData.due_date) : null);
    } else {
      // Reset form if no initData (creating new task)
      setTaskName("");
      setDescription("");
      setDueDate(null);
    }
  }, [initData]);

  const handleCreateTask = async () => {
    if (!taskName.trim() || !dueDate) {
      Alert.alert("Error", "Task name and due date are required");
      return;
    }

    setIsCreating(true);
    try {
      await createTask({
        name: taskName,
        description,
        due_date: dueDate.toISOString(),
      });

      setTaskName("");
      setDescription("");
      setDueDate(null);

      onTaskCreated();
    } catch (error) {
      Alert.alert("Error", "Failed to create task");
    }
    setIsCreating(false);
  };

  const handleUpdateTask = async () => {
    if (!taskName.trim() || !dueDate) {
      Alert.alert("Error", "Task name and due date are required");
      return;
    }

    setIsCreating(true);
    try {
      await updateTask({
        id: initData.id,
        name: taskName,
        description,
        due_date: dueDate.toISOString(),
      });

      setTaskName("");
      setDescription("");
      setDueDate(null);

      onTaskCreated();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
    setIsCreating(false);
  };

  const handleDatePicker = () => setIsDatePickerVisible(true);

  const handleDateConfirm = (date: Date) => {
    setDueDate(date);
    setIsDatePickerVisible(false);
  };

  const handleDateCancel = () => setIsDatePickerVisible(false);

  return (
    <ScrollView 
      style={taskStyles.formContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={taskStyles.formTitle}>
        {initData ? "Edit Task" : "Create New Task"}
      </Text>

      <CustomInput
        label="Task Name"
        placeholder="What do you want to do?"
        value={taskName}
        onChangeText={setTaskName}
        iconName="person-outline"
      />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDatePicker}
        style={taskStyles.dateInputWrapper}
      >
        <View pointerEvents="none">
          <DatePickerInput
            label="Due Date"
            value={
              dueDate
                ? dueDate.toLocaleDateString()
                : initData?.dueDate?.toLocaleDateString() || "Select Date"
            }
            placeholder="Select Date"
            onDateChange={(date) => handleDateConfirm(new Date(date))}
          />
        </View>
      </TouchableOpacity>

      <View style={taskStyles.descriptionWrapper}>
        <CustomInput
          label="Description (optional)"
          placeholder="Anything else?"
          value={description}
          onChangeText={setDescription}
          iconName="mail-outline"
        />
      </View>

      <View style={taskStyles.buttonRow}>
        <PrimaryButton
          title={
            isCreating ? "Saving..." : initData ? "Update Task" : "Create Task"
          }
          onPress={initData ? handleUpdateTask : handleCreateTask}
          style={taskStyles.createTaskButton}
          disabled={!taskName.trim() || !dueDate || isCreating}
        />

        <SecondaryButton
          title="Cancel"
          onPress={onCancel}
          style={taskStyles.cancelButton}
          disabled={isCreating}
        />
      </View>

      <CustomDatePicker
        isVisible={isDatePickerVisible}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </ScrollView>
  );
};

const CreateTaskFormModal: React.FC<CreateTaskFormModalProps> = ({
  isVisible,
  onClose,
  onTaskCreated,
  initData,
}) => {
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
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={taskStyles.keyboardAvoidingView}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={taskStyles.modalContent}>
              <CreateTaskForm
                onCancel={onClose}
                onTaskCreated={onTaskCreated}
                initData={initData}
              />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default CreateTaskFormModal;

// --- STYLES ---
const taskStyles = StyleSheet.create({
  keyboardAvoidingView: {
    width: "100%",
  } as ViewStyle,

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  } as ViewStyle,

  modalContent: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    paddingHorizontal: ms(spacing.md),
    paddingBottom: ms(spacing.md),
    width: "100%",
  } as ViewStyle,

  formContainer: {
    paddingTop: 10,
  } as ViewStyle,

  formTitle: {
    fontFamily: fontFamilies.extraBold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
    marginBottom: ms(spacing.md),
    marginTop: ms(spacing.sm),
  } as TextStyle,

  dateInputWrapper: {
    marginBottom: ms(spacing.xs),
    marginTop: ms(spacing.xs),
  } as ViewStyle,

  descriptionWrapper: {
    minHeight: ms(100),
    marginBottom: 0,
    marginTop: ms(spacing.xs),
  } as ViewStyle,

  buttonRow: {
    flexDirection: "column",
    gap: ms(spacing.xs),
    marginTop: ms(spacing.sm),
    paddingBottom: ms(spacing.md),
  } as ViewStyle,

  cancelButton: {
    marginTop: ms(spacing.xs),
  } as ViewStyle,

  createTaskButton: {
    marginBottom: ms(spacing.sm),
  } as ViewStyle,
});