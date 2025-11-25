import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { router } from "expo-router";
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

import { fetchTasks } from "@/src/core/services/tasksService";
import { logoutUser } from "@/src/core/services/authService";
import { getCurrentUser } from "@/src/core/services/userService";

import TaskCreationFlow from "../components/CreateTask";
import ListTasks from "../components/ListTasks";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import TaskCreationSuccessModal from "../components/TaskSuccess";

const heroImage = require("../../assets/images/home-image.png");
const profileImage = require("../../assets/images/profile-image.png");
const notificationIcon = require("../../assets/images/notification.png");
const resourceIcon = require("../../assets/images/resource-icon.png");
const journalIcon = require("../../assets/images/journal-icon.png");
const taskIcon = require("../../assets/images/task-icon.png");

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
};

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

/**
 * Get greeting based on current time of day
 * Morning: 5:00 AM - 11:59 AM
 * Afternoon: 12:00 PM - 4:59 PM
 * Evening: 5:00 PM - 8:59 PM
 * Night: 9:00 PM - 4:59 AM
 */
const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

const Home = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isAppAction, setIsAppAction] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const [greeting, setGreeting] = useState<string>(getGreeting());

  async function loadUser() {
    setIsLoadingUser(true);
    try {
      const response = await getCurrentUser();
      
      // Set user directly from response
      setUser(response || null); 
    } catch (error) {
      console.log("User fetch error:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function listUserTasks() {
    setIsLoadingTasks(true);
    try {
      const response = await fetchTasks();
      setTasks(response.data.details || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTasks(false);
    }
  }

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleTaskCreated = async () => {
    setIsFormModalVisible(false);
    setIsSuccessModalVisible(true);
    await listUserTasks();
  };

  const handleSuccessDone = () => {
    setIsSuccessModalVisible(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const response = await logoutUser();
              console.log("Logout success:", response);
              router.push("/SignInScreen");
            } catch (error: any) {
              console.error("Logout error:", error);
              Alert.alert(
                "Error",
                error?.response?.data?.message ||
                  error?.message ||
                  "Failed to logout. Please try again."
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    loadUser();
    listUserTasks();

    // Update greeting every minute in case the time period changes
    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute

    return () => clearInterval(greetingInterval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundMain}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <View style={styles.greetingRow}>
              <Image source={profileImage} style={styles.profileAvatar} />

              {/* Greeting displays only the first name using split(" ")[0] */}
              <Text style={styles.greetingLabel}>
                Hi, {isLoadingUser ? "..." : user?.full_name?.split(" ")[0] || "User"}
              </Text>
            </View>

            <Text style={styles.greetingTitle}>{greeting}</Text>
          </View>

          <Image source={notificationIcon} style={styles.notificationIcon} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrapper}>
            <Image source={heroImage} style={styles.heroImage} />
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
              onPress={() => {}}
              style={styles.heroButton}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <View key={action.id} style={styles.quickActionCard}>
                {action.id === "journal" ? (
                  <Image
                    source={journalIcon}
                    style={[styles.quickActionImage, styles.quickActionIconSpacing]}
                  />
                ) : action.id === "resources" ? (
                  <Image
                    source={resourceIcon}
                    style={[styles.quickActionImage, styles.quickActionIconSpacing]}
                  />
                ) : (
                  <Feather
                    name={action.icon}
                    size={18}
                    color={colors.primary}
                    style={styles.quickActionIconSpacing}
                  />
                )}
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Task Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Today's Task"}</Text>
            <TouchableOpacity onPress={() => { router.push('../components/TaskPage')}}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoadingTasks && !isAppAction ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : tasks.length === 0 ? (
            <View style={styles.taskCard}>
              <Image source={taskIcon} style={styles.taskIcon} />
              <Text style={styles.taskEmptyTitle}>No task added yet</Text>
              <Text style={styles.taskEmptySubtitle}>
                {"Your today's task will be displayed here"}
              </Text>
              <SecondaryButton
                title="Add Task"
                onPress={() => setIsFormModalVisible(true)}
                style={styles.taskButton}
              />
            </View>
          ) : (
            <ListTasks
              tasks={tasks}
              callback={listUserTasks}
              setAppAction={() => setIsAppAction(true)}
            />
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <SecondaryButton
            title={isLoggingOut ? "Logging out..." : "Logout"}
            onPress={handleLogout}
            style={styles.logoutButton}
            disabled={isLoggingOut}
          />
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      {tasks.length !== 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsFormModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* MODALS */}
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

// --- STYLES BELOW ----
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
    borderColor: "#dc2626",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    zIndex: 999,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 25,
    marginTop: -3,
  },
});