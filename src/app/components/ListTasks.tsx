import { deleteTask, toggleTaskStatus } from "@/src/core/services/tasksService";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CreateTaskFormModal from "./CreateTask";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const trashIcon = require("../../assets/images/trash.png");
const tickChecked = require("../../assets/images/tick-square-checked.png");
const tickUnchecked = require("../../assets/images/tick-square.png");
const successIcon = require("../../assets/images/success-icon.png");

const ListTasks = ({
  tasks,
  callback,
  setAppAction,
}: {
  tasks: any;
  callback: () => void;
  setAppAction: () => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    setIsLoadingDelete(true);

    try {
      await deleteTask(selectedTask);

      setShowDeleteConfirm(false);

      setShowDeleteSuccess(true);
      await callback();
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete task. Try again.");
    } finally {
      setIsLoadingDelete(false);
      setSelectedTask(null);
    }
  };

  const handleToggleStatus = async (taskId: string, status: string) => {
    setIsLoadingDelete(true);
    const newStatus = status === "completed" ? false : true;
    try {
      await toggleTaskStatus(taskId, newStatus);
      await callback(); // Only runs if toggleTaskStatus succeeds
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Failed to update task. Try again.");
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.taskListContainer}>
        {tasks?.map((task: any) => (
          <View key={task.id} style={styles.taskItem}>
            {/* Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleToggleStatus(task.id, task.status)}
            >
              <View>
                {task.status === "completed" ? (
                  <Image
                    source={tickChecked}
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <Image
                    source={tickUnchecked}
                    style={{ width: 24, height: 24 }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Task Content - Make it clickable for pending tasks */}
            <TouchableOpacity
              style={styles.taskContent}
              onPress={() => {
                if (task.status === "pending") {
                  setTaskToEdit(task);
                  setIsEditModalVisible(true);
                }
              }}
              disabled={task.status === "completed"}
            >
              <Text
                style={[
                  styles.taskTitle,
                  task.status === "completed" && styles.taskTitleCompleted,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {task.name}
              </Text>
              <Text style={styles.taskDateTime}>
                {format(parseISO(task.due_date), "yyyy-MM-dd h:mma")}
              </Text>
            </TouchableOpacity>

            {/* Delete Icon */}
            <TouchableOpacity
              onPress={() => {
                setSelectedTask(task.id);
                setShowDeleteConfirm(true);
              }}
            >
              <Image source={trashIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* DELETE CONFIRMATION MODAL */}
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
              style={{ width: 24, height: 24, marginBottom: 10 }}
            />

            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to delete this task?{"\n"}
              All information and progress will be lost.
            </Text>

            <PrimaryButton
              title="Delete"
              isLoading={isLoadingDelete}
              onPress={() => handleDeleteTask()}
              style={{ marginTop: 0 }}
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => setShowDeleteConfirm(false)}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>

      {/* DELETE SUCCESS MODAL */}
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
              style={{ width: 57, height: 57, marginBottom: 15 }}
            />

            <Text style={styles.modalTitle}>Task deleted successfully</Text>

            <PrimaryButton
              title="Done"
              onPress={() => setShowDeleteSuccess(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>

      <CreateTaskFormModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setTaskToEdit(null);
        }}
        onTaskCreated={() => {
          setIsEditModalVisible(false);
          setTaskToEdit(null);
          callback(); // Refresh tasks
        }}
        initData={taskToEdit}
      />
    </View>
  );
};

export default ListTasks;

const styles = StyleSheet.create({
  taskListContainer: {
    gap: 12,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
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
    color: "#999999",
  },
  taskDateTime: {
    fontSize: 14,
    color: "#6B6B6B",
  },

  addTaskButton: {
    marginTop: 8,
  },
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
    borderRadius: 8,
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
    wordWrap: "nowrap",
    color: "#3A3A3A",
    marginBottom: 20,
  },

  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5F9EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
});
