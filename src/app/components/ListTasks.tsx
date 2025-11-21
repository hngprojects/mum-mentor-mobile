import { deleteTask, toggleTaskStatus } from "@/src/core/services/tasksService";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

// --- Asset Imports ---
const trashIcon = require("../../assets/images/trash.png");
const tickChecked = require("../../assets/images/tick-square-checked.png");
const tickUnchecked = require("../../assets/images/tick-square.png");
const successIcon = require("../../assets/images/success-icon.png");

// --- Types ---
interface Task {
  id: string | number;
  name: string;
  status: string; // Expected values: "pending" or "completed"
  due_date: string; // ISO 8601 string expected for parseISO
}

interface ListTasksProps {
  tasks: Task[];
  // Callback to refresh the parent task list (e.g., fetch data again)
  callback: () => void; 
  // This prop was unused in the original code, but kept for interface consistency
  setAppAction: () => void;
}

/**
 * Renders a list of tasks, providing functionality to toggle status and delete tasks.
 */
const ListTasks: React.FC<ListTasksProps> = ({ tasks, callback }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  /**
   * Handles the confirmed deletion of the selected task.
   */
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    setIsLoadingDelete(true);
    try {
      await deleteTask(selectedTask);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      // Refresh the list immediately after successful delete
      await callback(); 
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete task. Please try again.");
    } finally {
      setIsLoadingDelete(false);
      // Wait for success modal to close before clearing selectedTask
      // setSelectedTask(null); 
    }
  };

  /**
   * Toggles the completion status of a task.
   * @param taskId The ID of the task to update.
   * @param status The current status of the task.
   */
  const handleToggleStatus = async (taskId: string, status: string) => {
    setIsLoadingDelete(true);
    // Determine the new status (API expects boolean: true for completed, false for pending)
    const newStatus = status !== "completed"; 
    
    try {
      await toggleTaskStatus(taskId, newStatus);
      await callback(); // Refresh list to reflect changes
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Failed to update task status. Please try again.");
    } finally {
      setIsLoadingDelete(false);
    }
  };

  /**
   * Renders a single task item for the FlatList.
   */
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      {/* Checkbox / Status Toggle */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleToggleStatus(item.id.toString(), item.status)}
      >
        <Image
          source={item.status === "completed" ? tickChecked : tickUnchecked}
          style={styles.checkboxIcon}
        />
      </TouchableOpacity>

      {/* Task Name and Due Date */}
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            item.status === "completed" && styles.taskTitleCompleted,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <Text style={styles.taskDateTime}>
          {/* Ensure date is correctly parsed before formatting */}
          {item.due_date ? format(parseISO(item.due_date), "yyyy-MM-dd h:mma") : 'No Due Date'}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => {
          setSelectedTask(item.id.toString());
          setShowDeleteConfirm(true);
        }}
      >
        <Image source={trashIcon} style={styles.trashIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Task List (FlatList) */}
      {tasks && tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No tasks available</Text>
        </View>
      )}

      {/* --- MODALS --- */}

      {/* 1. DELETE CONFIRMATION MODAL */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image
              source={trashIcon}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to delete this task?{"\n"}All information
              and progress will be lost.
            </Text>
            <PrimaryButton
              title="Delete"
              isLoading={isLoadingDelete}
              onPress={handleDeleteTask}
            />
            <SecondaryButton
              title="Cancel"
              onPress={() => setShowDeleteConfirm(false)}
            />
          </View>
        </View>
      </Modal>

      {/* 2. DELETE SUCCESS MODAL */}
      <Modal
        visible={showDeleteSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image
              source={successIcon}
              style={styles.successIcon}
            />
            <Text style={styles.modalTitle}>Task deleted successfully</Text>
            <PrimaryButton
              title="Done"
              onPress={() => {
                setShowDeleteSuccess(false);
                // Clear selected task after success modal is closed
                setSelectedTask(null); 
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListTasks;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 9,
    alignSelf: "flex-start",
  },
  checkboxIcon: {
    width: 24, 
    height: 24
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: "#1F1F1F",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#C4C4C4",
  },
  taskDateTime: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  trashIcon: {
    width: 24, 
    height: 24
  },
  noTasksContainer: {
    padding: 20, 
    alignItems: "center" 
  },
  noTasksText: { 
    color: "#999" 
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    width: "85%",
    borderRadius: 16, // Slightly larger radius for aesthetics
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#3A3A3A",
    marginBottom: 20,
  },
  modalIcon: {
    width: 24, 
    height: 24, 
    marginBottom: 10 
  },
  successIcon: {
    width: 57, 
    height: 57, 
    marginBottom: 15
  },
});