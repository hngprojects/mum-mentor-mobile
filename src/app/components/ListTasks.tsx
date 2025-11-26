// ListTasks.tsx - Updated with style guide
import { deleteTask, toggleTaskStatus } from "@/src/core/services/tasksService";
import { showToast } from "@/src/core/utils/toast";
import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import {
  colors,
  fontFamilies,
  spacing,
  typography,
} from "../../core/styles/index";
import { ms, rfs } from "../../core/styles/scaling";
import CreateTaskFormModal from "./CreateTask";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TaskListItem from "./TaskListItem";

const trashIcon = require("../../assets/images/trash.png");
const successIcon = require("../../assets/images/success-icon.png");

const ListTasks = ({
  tasks,
  callback,
  setAppAction,
}: {
  tasks: any;
  callback: (taskId?: string, newStatus?: string) => void;
  setAppAction: () => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    setIsLoadingDelete(true);

    try {
      await deleteTask(selectedTask);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      callback();
    } catch (err) {
      console.error("Delete error:", err);
      showToast.error("Error", "Failed to delete task. Try again.");
    } finally {
      setIsLoadingDelete(false);
      setSelectedTask(null);
    }
  };

  const handleToggleStatus = async (taskId: string, status: string) => {
    const newStatus = status === "completed" ? "pending" : "completed";

    callback(taskId, newStatus);

    try {
      await toggleTaskStatus(taskId, newStatus === "completed");
    } catch (err) {
      console.error("Update error:", err);
      showToast.error("Error", "Failed to update task. Try again.");
      callback();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskListContainer}>
        {tasks?.map((task: any) => (
          <TaskListItem
            key={task.id}
            task={task}
            onToggleStatus={handleToggleStatus}
            onDelete={(taskId) => {
              setSelectedTask(taskId);
              setShowDeleteConfirm(true);
            }}
            onPress={() => {
              if (task.status === "pending") {
                setTaskToEdit(task);
                setIsEditModalVisible(true);
              }
            }}
          />
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
            <Image source={trashIcon} style={styles.trashIconImage} />

            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to delete this task?{"\n"}
              All information and progress will be lost.
            </Text>

            <PrimaryButton
              title="Delete"
              isLoading={isLoadingDelete}
              onPress={() => handleDeleteTask()}
              style={styles.deleteButton}
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => setShowDeleteConfirm(false)}
              style={styles.cancelButton}
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
            <Image source={successIcon} style={styles.successIconImage} />

            <Text style={styles.modalTitle}>Task deleted successfully</Text>

            <PrimaryButton
              title="Done"
              onPress={() => setShowDeleteSuccess(false)}
              style={styles.doneButton}
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
          callback();
        }}
        initData={taskToEdit}
      />
    </View>
  );
};

export default ListTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskListContainer: {
    backgroundColor: colors.textWhite,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalBox: {
    backgroundColor: colors.textWhite,
    padding: ms(spacing.lg),
    width: "85%",
    borderRadius: ms(8),
    alignItems: "center",
  },
  trashIconImage: {
    width: ms(24),
    height: ms(24),
    marginBottom: ms(spacing.sm),
  },
  modalTitle: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xs),
  },
  modalSubtitle: {
    textAlign: "center",
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: fontFamilies.regular,
    color: colors.textGrey1,
    marginBottom: ms(spacing.md),
    lineHeight: rfs(20),
  },
  successIconImage: {
    width: ms(57),
    height: ms(57),
    marginBottom: ms(spacing.md),
  },
  deleteButton: {
    marginTop: 0,
  },
  cancelButton: {
    marginTop: ms(spacing.sm),
  },
  doneButton: {
    marginTop: ms(spacing.md),
  },
});
