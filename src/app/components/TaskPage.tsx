// TasksScreen.tsx - Updated with theme styles
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { fetchTasks } from '@/src/core/services/tasksService';
import ListTasks from '../components/ListTasks';
import CreateTaskFormModal from '../components/CreateTask';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../core/styles/index';
import { router } from 'expo-router'

const arrowIcon = require('../../assets/images/arrow.png');
const taskIcon = require('../../assets/images/task.png');

const TasksScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      const response = await fetchTasks({
        page: 1,
        per_page: 100,
      });
      
      if (response?.data?.details && Array.isArray(response.data.details)) {
        setTasks(response.data.details);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const formatDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
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
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTaskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
    }
    loadTasks(false);
  };

  const hasTasks = !isLoading && tasks.length > 0;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.textWhite} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={() => { router.push('/Home')}}>
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
                  </TouchableOpacity>
                );
              })}
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
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ListTasks
                tasks={tasks}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    backgroundColor: colors.textWhite,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  arrowImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSubtle,
  },
  calendarDay: {
    alignItems: 'center',
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
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 30,
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '300',
    marginTop: -2,
  },
});

export default TasksScreen;