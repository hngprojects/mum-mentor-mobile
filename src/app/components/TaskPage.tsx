// TasksScreen.tsx - Updated with theme styles
// TasksScreen.tsx - Updated with sorting, filtering, and search
import { fetchTasks } from "@/src/core/services/tasksService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../core/styles/index";
import CreateTaskFormModal from "../components/CreateTask";
import ListTasks from "../components/ListTasks";
import SortModal, { SortOption } from "../components/SortModal";

const arrowIcon = require("../../assets/images/arrow.png");
const taskIcon = require("../../assets/images/task.png");

const TasksScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption | undefined>();
  const [taskStatus, setTaskStatus] = useState<string | undefined>();

  const generateCalendarDays = () => {
    const days = [];
    const centerDate = selectedDate;

    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const loadTasks = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      const params: any = {
        page: 1,
        per_page: 100,
      };

      // Add sorting parameters if selected
      if (selectedSort) {
        params.order_by = selectedSort.orderBy;
        params.order_direction = selectedSort.orderDirection;
      }

      // Add status filter if selected
      if (taskStatus) {
        params.task_status = taskStatus;
      }

      const response = await fetchTasks(params);

      if (response?.data?.details && Array.isArray(response.data.details)) {
        setTasks(response.data.details);
        filterTasksByDate(response.data.details, selectedDate, searchQuery);
      } else {
        setTasks([]);
        setFilteredTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const filterTasksByDate = (
    taskList: any[],
    date: Date,
    query: string = ""
  ) => {
    let filtered = taskList;

    // Filter by selected date
    filtered = taskList.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return isSameDay(taskDate, date);
    });

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(lowerQuery) ||
          task.description?.toLowerCase().includes(lowerQuery) ||
          task.name?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    loadTasks();
  }, [selectedSort, taskStatus]);

  useEffect(() => {
    filterTasksByDate(tasks, selectedDate, searchQuery);
  }, [selectedDate, searchQuery, tasks]);

  const formatDayOfWeek = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const formatDayOfMonth = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const handleTaskUpdate = (updatedTaskId?: string, newStatus?: string) => {
    if (updatedTaskId && newStatus) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskId ? { ...task, status: newStatus } : task
        )
      );
    }
    loadTasks(false);
  };

  const handleSortApply = (option: SortOption) => {
    setSelectedSort(option);
  };

  const handleSortReset = () => {
    setSelectedSort(undefined);
  };

  const handleStatusFilter = (status?: string) => {
    setTaskStatus(status);
  };

  const hasTasks = !isLoading && tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.textWhite} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  router.push("/Home");
                }}
              >
                <Image source={arrowIcon} style={styles.arrowImage} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Task</Text>
            </View>
            {hasTasks && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsCreateModalVisible(true)}
              >
                <Text style={styles.addText}>+</Text>
                <Text style={styles.addLabel}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Calendar - Only show when tasks exist */}
          {hasTasks && (
            <View style={styles.calendarContainer}>
              {calendarDays.map((date, index) => {
                const isSelected = isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                // Count tasks for this date
                const taskCount = tasks.filter((task) => {
                  if (!task.due_date) return false;
                  const taskDate = new Date(task.due_date);
                  return isSameDay(taskDate, date);
                }).length;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isSelected && styles.calendarDaySelected,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      style={[
                        styles.calendarDayOfWeek,
                        isSelected && styles.calendarTextSelected,
                      ]}
                    >
                      {formatDayOfWeek(date)}
                    </Text>
                    <Text
                      style={[
                        styles.calendarDayOfMonth,
                        isSelected && styles.calendarTextSelected,
                        isTodayDate && !isSelected && styles.calendarTodayText,
                      ]}
                    >
                      {formatDayOfMonth(date)}
                    </Text>
                    {taskCount > 0 && (
                      <View
                        style={[
                          styles.taskBadge,
                          isSelected && styles.taskBadgeSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.taskBadgeText,
                            isSelected && styles.taskBadgeTextSelected,
                          ]}
                        >
                          {taskCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Search and Filter Bar */}
          {hasTasks && (
            <View style={styles.filterBar}>
              {/* <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  // Toggle between all, pending, and completed
                  if (!taskStatus) {
                    handleStatusFilter("pending");
                  } else if (taskStatus === "pending") {
                    handleStatusFilter("completed");
                  } else {
                    handleStatusFilter(undefined);
                  }
                }}
              >
                <Text style={styles.filterIcon}>☰</Text>
                <Text style={styles.filterText}>
                  {!taskStatus
                    ? "Filter"
                    : taskStatus === "pending"
                      ? "Pending"
                      : "Completed"}
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setIsSortModalVisible(true)}
              >
                <Text style={styles.sortIcon}>⇅</Text>
                <Text style={styles.sortText}>Sort</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image source={taskIcon} style={styles.taskIcon} />
              <Text style={styles.emptyText}>No task added yet</Text>
              <Text style={styles.emptySubtext}>
                Your today&apos;s task will be displayed here
              </Text>
            </View>
          ) : !hasFilteredTasks ? (
            <View style={styles.emptyContainer}>
              <Image source={taskIcon} style={styles.taskIcon} />
              <Text style={styles.emptyText}>No tasks for this date</Text>
              <Text style={styles.emptySubtext}>
                Select another date or add a new task
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ListTasks
                tasks={filteredTasks}
                callback={handleTaskUpdate}
                setAppAction={() => {}}
              />
            </ScrollView>
          )}

          {/* Floating Add Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setIsCreateModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>

          {/* Create Task Modal */}
          <CreateTaskFormModal
            isVisible={isCreateModalVisible}
            onClose={() => setIsCreateModalVisible(false)}
            onTaskCreated={() => {
              setIsCreateModalVisible(false);
              loadTasks();
            }}
          />

          {/* Sort Modal */}
          <SortModal
            isVisible={isSortModalVisible}
            onClose={() => setIsSortModalVisible(false)}
            onApply={handleSortApply}
            onReset={handleSortReset}
            selectedOption={selectedSort}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.textWhite,
  },
  container: {
    flex: 1,
    backgroundColor: colors.textWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    backgroundColor: colors.textWhite,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xs,
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  addText: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: typography.bodyMedium.fontFamily,
  },
  addLabel: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  calendarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSubtle,
  },
  calendarDay: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + spacing.xs,
    borderRadius: 8,
    minWidth: 45,
  },
  calendarDaySelected: {
    backgroundColor: colors.textWhite,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calendarDayOfWeek: {
    ...typography.caption,
    color: colors.textGrey1,
    marginBottom: spacing.sm,
  },
  calendarDayOfMonth: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  calendarTextSelected: {
    color: colors.primary,
  },
  calendarTodayText: {
    color: colors.primary,
  },
  taskIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl + spacing.sm,
  },
  emptyText: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    textAlign: "center",
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "ios" ? 40 : 30,
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 32,
    color: colors.textWhite,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: "300",
    marginTop: -2,
  },
  taskBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  taskBadgeSelected: {
    backgroundColor: colors.textWhite,
  },
  taskBadgeText: {
    fontSize: 10,
    color: colors.textWhite,
    fontWeight: "bold",
  },
  taskBadgeTextSelected: {
    color: colors.primary,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.textWhite,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundStrong,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundMuted,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.textPrimary,
    // fontFamily: typography,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSoft,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    color: colors.textPrimary,
    // fontFamily: typography.bodyMedium,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSoft,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
  },
  sortIcon: {
    fontSize: 16,
  },
  sortText: {
    fontSize: 14,
    color: colors.textPrimary,
    // fontFamily: typography.fontFamily.medium,
  },
});

export default TasksScreen;
