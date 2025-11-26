import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

// --- REQUIRED STYLE IMPORTS ---
import { createTask, updateTask } from "@/src/core/services/tasksService";
import { showToast } from "@/src/core/utils/toast";
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
  mode: "date" | "time";
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  date?: Date;
}> = ({ isVisible, mode, onConfirm, onCancel, date }) => {
  if (Platform.OS === "web") {
    return isVisible ? (
      <input
        type={mode}
        defaultValue={
          date
            ? mode === "date"
              ? date.toISOString().split("T")[0]
              : date.toTimeString().slice(0, 5)
            : undefined
        }
        onChange={(e) => {
          if (mode === "date") {
            onConfirm(new Date(e.target.value));
          } else {
            const [hours, minutes] = e.target.value.split(":");
            const newDate = date ? new Date(date) : new Date();
            newDate.setHours(parseInt(hours), parseInt(minutes));
            onConfirm(newDate);
          }
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
      mode={mode}
      date={date}
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
  const [dueTime, setDueTime] = useState<Date | null>(
    initData?.due_date ? new Date(initData.due_date) : null
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Update form when initData changes
  React.useEffect(() => {
    if (initData) {
      setTaskName(initData.name || "");
      setDescription(initData.description || "");
      const date = initData.due_date ? new Date(initData.due_date) : null;
      setDueDate(date);
      setDueTime(date);
    } else {
      // Reset form if no initData (creating new task)
      setTaskName("");
      setDescription("");
      setDueDate(null);
      setDueTime(null);
    }
  }, [initData]);

  const combineDateAndTime = () => {
    if (!dueDate) return null;

    const combined = new Date(dueDate);
    if (dueTime) {
      combined.setHours(dueTime.getHours());
      combined.setMinutes(dueTime.getMinutes());
      combined.setSeconds(0);
      combined.setMilliseconds(0);
    } else {
      // Default to 9:00 AM if no time is set
      combined.setHours(9, 0, 0, 0);
    }
    return combined;
  };

  const handleCreateTask = async () => {
    if (!taskName.trim() || !dueDate) {
      showToast.error("Error", "Task name and due date are required");
      return;
    }

    const finalDateTime = combineDateAndTime();
    if (!finalDateTime) {
      showToast.error("Error", "Invalid date/time");
      return;
    }

    setIsCreating(true);
    try {
      await createTask({
        name: taskName,
        description,
        due_date: finalDateTime.toISOString(),
      });

      setTaskName("");
      setDescription("");
      setDueDate(null);
      setDueTime(null);

      onTaskCreated();
    } catch (error) {
      showToast.error("Error", "Failed to create task");
    }
    setIsCreating(false);
  };

  const handleUpdateTask = async () => {
    if (!taskName.trim() || !dueDate) {
      showToast.error("Error", "Task name and due date are required");
      return;
    }

    const finalDateTime = combineDateAndTime();
    if (!finalDateTime) {
      showToast.error("Error", "Invalid date/time");
      return;
    }

    setIsCreating(true);
    try {
      await updateTask({
        id: initData.id,
        name: taskName,
        description,
        due_date: finalDateTime.toISOString(),
      });

      setTaskName("");
      setDescription("");
      setDueDate(null);
      setDueTime(null);

      onTaskCreated();
    } catch (error) {
      showToast.error("Error", "Failed to update task");
    }
    setIsCreating(false);
  };

  const handleDatePicker = () => setIsDatePickerVisible(true);
  const handleTimePicker = () => setIsTimePickerVisible(true);

  const handleDateConfirm = (date: Date) => {
    setDueDate(date);
    setIsDatePickerVisible(false);
  };

  const handleTimeConfirm = (time: Date) => {
    setDueTime(time);
    setIsTimePickerVisible(false);
  };

  const handleDateCancel = () => setIsDatePickerVisible(false);
  const handleTimeCancel = () => setIsTimePickerVisible(false);

  const formatTime = (date: Date | null) => {
    if (!date) return "Select Time";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={taskStyles.formContainer}
      contentContainerStyle={taskStyles.formContentContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={20}
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

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleTimePicker}
        style={taskStyles.timeInputWrapper}
      >
        <View pointerEvents="none">
          <DatePickerInput
            label="Due Time"
            value={formatTime(dueTime)}
            placeholder="Select Time"
            onDateChange={() => {}}
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
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        date={dueDate || undefined}
      />

      <CustomDatePicker
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
        date={dueTime || new Date()}
      />
    </KeyboardAwareScrollView>
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
      <View style={taskStyles.modalOverlay}>
        <TouchableOpacity
          style={taskStyles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={taskStyles.modalContent}>
          <CreateTaskForm
            onCancel={onClose}
            onTaskCreated={onTaskCreated}
            initData={initData}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CreateTaskFormModal;

// --- STYLES ---
const taskStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  } as ViewStyle,

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  } as ViewStyle,

  modalContent: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    paddingHorizontal: ms(spacing.md),
    width: "100%",
    maxHeight: "90%",
  } as ViewStyle,

  formContainer: {
    paddingTop: 10,
  } as ViewStyle,

  formContentContainer: {
    paddingBottom: Platform.OS === "ios" ? ms(spacing.xl) : ms(spacing.lg),
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

  timeInputWrapper: {
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
