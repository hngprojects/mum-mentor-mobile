import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Local Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

import { fetchTasks } from "@/src/core/services/tasksService";
import { getCurrentUser } from "@/src/core/services/userService";

import { showToast } from "@/src/core/utils/toast";
import TaskCreationFlow from "../components/CreateTask";
import ListTasks from "../components/ListTasks";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import TaskCreationSuccessModal from "../components/TaskSuccess";

// --- Asset Imports ---
const heroImage = require("../../assets/images/home-image.png");
const profileImage = require("../../assets/images/profile-image.png");
const notificationIcon = require("../../assets/images/notification.png");
const resourceIcon = require("../../assets/images/resource-icon.png");
const journalIcon = require("../../assets/images/journal-icon.png");
const taskIcon = require("../../assets/images/task-icon.png");

// --- Types ---
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
};

// --- Static Data ---
const quickActions: QuickAction[] = [
  {
    id: "resources",
    title: "Resources",
    subtitle: "Track your daily Activity with ease",
    icon: "book",
  },
  {
    id: "journal",
    title: "Journal",
    subtitle: "Write about what you like to remember later",
    icon: "book-open",
  },
];

// --- Greeting Function ---
/**
 * Determines the appropriate greeting based on the current time of day.
 * @returns {string} The time-based greeting.
 */
const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
};

/**
 * @fileoverview Home screen component displaying user data, quick actions, and tasks.
 * @exports Home
 */
const Home = () => {
  // --- State Variables ---
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isAppAction, setIsAppAction] = useState(false); // Used to differentiate initial load from subsequent actions (e.g., refreshing after completion)

  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // --- Data Fetching Functions ---

  /** Fetches the current user data. */
  const loadUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const response = await getCurrentUser();
      setUser(response || null);
    } catch (error) {
      console.log("User fetch error:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  /** Fetches the list of user tasks and filters for today's tasks. */
  const listUserTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    setIsAppAction(true);
    try {
      const response = await fetchTasks();
      if (!response || !response.data) {
        console.warn("fetchTasks returned invalid response:", response);
        setTasks([]);
        return;
      }

      // Filter tasks to show only today's tasks
      const allTasks = response.data.details || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysTasks = allTasks.filter((task: any) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

      setTasks(todaysTasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      showToast.error(
        "Unable to load tasks",
        error?.response?.data?.message ||
          "Something went wrong while fetching your tasks."
      );
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
      setIsAppAction(false);
    }
  }, []);

  // --- Task Modal Handlers ---

  /** Handler executed after a task is successfully created. */
  const handleTaskCreated = useCallback(async () => {
    setIsFormModalVisible(false);
    setIsSuccessModalVisible(true);
    await listUserTasks(); // Refresh the task list
  }, [listUserTasks]);

  /** Handler to dismiss the task success modal. */
  const handleSuccessDone = useCallback(() => {
    setIsSuccessModalVisible(false);
  }, []);

  /** Effect to initialize data loading and set up the greeting timer. */
  useEffect(() => {
    loadUser();
    listUserTasks();

    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Updates every minute

    return () => clearInterval(greetingInterval);
  }, [loadUser, listUserTasks]);

  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundMain}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* === Top Bar: Greeting & Notifications === */}
        <View style={styles.topBar}>
          <View>
            <TouchableOpacity
              onPress={() => router.push("../profile/ProfileScreen")}
              accessibilityRole="button"
            >
              <View style={styles.greetingRow}>
                <Image
                  source={profileImage}
                  style={styles.profileAvatar}
                  accessibilityLabel="User Profile Picture"
                />
                <Text style={styles.greetingLabel}>
                  Hi,{" "}
                  {isLoadingUser
                    ? "..."
                    : user?.full_name?.split(" ")[0] || "User"}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.greetingTitle}>{greeting}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("../notifications")}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Image source={notificationIcon} style={styles.notificationIcon} />
          </TouchableOpacity>
        </View>

        {/* === Hero Card === */}
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrapper}>
            <Image
              source={heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>You are Amazing</Text>
            <Text style={styles.heroSubtitle}>
              {
                "You're growing right alongside your child,\nand that's something to be proud of"
              }
            </Text>
            <PrimaryButton
              title="Chat with Nora AI"
              onPress={() => router.push("./AiChat")}
              style={styles.heroButton}
            />
          </View>
        </View>

        {/* === Quick Actions Section === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.9}
                onPress={() => {
                  if (action.id === "resources") router.push("/resources");
                  if (action.id === "journal")
                    router.push("/components/journal/journalList");
                  // Add journal navigation here
                }}
                accessibilityRole="button"
                accessibilityLabel={`Go to ${action.title}`}
              >
                {/* Use the correct asset based on action ID */}
                {action.id === "journal" ? (
                  <Image
                    source={journalIcon}
                    style={[
                      styles.quickActionImage,
                      styles.quickActionIconSpacing,
                    ]}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={resourceIcon}
                    style={[
                      styles.quickActionImage,
                      styles.quickActionIconSpacing,
                    ]}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* === Today's Task Section === */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Today's Task"}</Text>
            <TouchableOpacity
              onPress={() => router.push("../components/TaskPage")}
              accessibilityRole="link"
              accessibilityLabel="View All Tasks"
            >
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoadingTasks && isAppAction ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : tasks.length === 0 ? (
            /* Empty State */
            <View style={styles.taskCard}>
              <Image source={taskIcon} style={styles.taskIcon} />
              <Text style={styles.taskEmptyTitle}>
                No task created for today
              </Text>

              <Text
                style={[
                  styles.viewAllLink,
                  { textDecorationLine: "underline" },
                ]}
                onPress={() => router.push("../components/TaskPage")}
              >
                Click to view all tasks
              </Text>
              <SecondaryButton
                title="Add Task"
                onPress={() => setIsFormModalVisible(true)}
                style={styles.taskButton}
              />
            </View>
          ) : (
            /* Task List */
            <ListTasks
              tasks={tasks}
              callback={listUserTasks}
              setAppAction={() => setIsAppAction(true)}
            />
          )}
        </View>
      </ScrollView>

      {/* === Floating Add Task Button === */}
      {tasks.length !== 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsFormModalVisible(true)}
          accessibilityLabel="Add New Task"
          accessibilityRole="button"
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* === Modals === */}
      <TaskCreationFlow
        isVisible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onTaskCreated={handleTaskCreated}
      />
      <TaskCreationSuccessModal
        isVisible={isSuccessModalVisible}
        onDone={handleSuccessDone}
      />
    </SafeAreaView>
  );
};

export default Home;

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  } as ViewStyle,
  scrollView: { flex: 1 },
  scrollContent: {
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xl * 1.5),
    paddingHorizontal: ms(spacing.lg),
    gap: ms(spacing.xl),
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(spacing.sm),
  },
  profileAvatar: {
    width: ms(24),
    height: ms(24),
    resizeMode: "cover",
  },
  notificationIcon: {
    width: ms(28),
    height: ms(28),
    resizeMode: "contain",
    alignSelf: "flex-start",
  },
  greetingLabel: {
    fontFamily: fontFamilies.medium,
    color: colors.textSecondary,
    marginBottom: ms(spacing.xs),
  },
  greetingTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.heading2.fontSize,
    color: colors.textPrimary,
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: colors.outline,
    padding: ms(spacing.lg),
    paddingRight: ms(70),
  },
  heroImageWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    pointerEvents: "none",
    opacity: 0.8,
  } as ViewStyle,
  heroText: {
    gap: ms(10),
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: fontFamilies.extraBold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: fontFamilies.medium,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.fontSize * 1.3,
    color: colors.textGrey1,
  },
  heroButton: {
    marginTop: ms(spacing.sm),
    alignSelf: "flex-start",
    width: ms(170),
  },
  heroImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    right: 0,
    resizeMode: "cover",
  },
  section: { gap: ms(spacing.md) },
  sectionTitle: {
    fontFamily: fontFamilies.extraBold,
    fontSize: typography.heading3.fontSize,
    color: colors.textPrimary,
  },
  quickActions: {
    flexDirection: "row",
    gap: ms(spacing.md),
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.textWhite,
    borderRadius: ms(spacing.lg),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: ms(spacing.md),
    gap: ms(spacing.sm),
  },
  quickActionImage: {
    width: ms(18),
    height: ms(18),
    resizeMode: "contain",
  },
  quickActionIconSpacing: {
    marginBottom: ms(spacing.xs),
  },
  quickActionTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textPrimary,
  },
  quickActionSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllLink: {
    fontSize: 14,
    textDecorationLine: "underline",
    color: colors.textSecondary,
    fontFamily: fontFamilies.medium,
  },
  taskCard: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(spacing.lg),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: ms(spacing.lg),
    alignItems: "center",
    gap: ms(spacing.sm),
  },
  taskIcon: {
    marginBottom: ms(spacing.sm),
    width: ms(32),
    height: ms(32),
    resizeMode: "contain",
  },
  taskEmptyTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textPrimary,
  },
  taskEmptySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "75%",
    alignSelf: "center",
  },
  taskButton: {
    marginTop: ms(spacing.sm),
    width: "55%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutSection: {
    marginTop: ms(spacing.md),
    paddingTop: ms(spacing.md),
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.error,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: ms(56),
    height: ms(56),
    borderRadius: ms(8),
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
    color: colors.textWhite,
    fontSize: ms(32),
    fontFamily: fontFamilies.regular,
    fontWeight: "300" as any,
    marginTop: ms(-2),
  },
});
