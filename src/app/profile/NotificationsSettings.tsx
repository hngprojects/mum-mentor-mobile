// app/notifications/NotificationSettingsScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

// --- Component Imports ---
import { showToast } from "@/src/core/utils/toast";
import CustomToggle from "../components/CustomToggle";

interface NotificationSettings {
  muteAll: boolean;
  newMilestones: boolean;
  pendingMilestone: boolean;
  aiInsights: boolean;
  noraCheckins: boolean;
  taskReminders: boolean;
  communityNotifications: boolean;
}

export default function NotificationSettingsScreen() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    muteAll: false,
    newMilestones: true,
    pendingMilestone: true,
    aiInsights: true,
    noraCheckins: true,
    taskReminders: true,
    communityNotifications: true,
  });

  // Load settings from API or local storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Load settings from API
      // const response = await apiClient.get("/api/v1/notification-settings");
      // setSettings(response.data);
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    try {
      // If toggling "Mute All", update all other settings
      if (key === "muteAll") {
        const newSettings = {
          ...settings,
          muteAll: value,
          // Disable all notifications when muting all
          newMilestones: !value && settings.newMilestones,
          pendingMilestone: !value && settings.pendingMilestone,
          aiInsights: !value && settings.aiInsights,
          noraCheckins: !value && settings.noraCheckins,
          taskReminders: !value && settings.taskReminders,
          communityNotifications: !value && settings.communityNotifications,
        };
        setSettings(newSettings);
      } else {
        setSettings((prev) => ({
          ...prev,
          [key]: value,
          // If enabling any notification, disable "Mute All"
          muteAll: value ? false : prev.muteAll,
        }));
      }

      // TODO: Save to API
      // await apiClient.patch("/api/v1/notification-settings", { [key]: value });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      showToast.error("Error", "Failed to update notification settings");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={ms(24)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mute All Notifications */}
        <View style={styles.topSection}>
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="bell-off"
                    size={ms(20)}
                    color={colors.textPrimary}
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>
                    Mute All Notifications
                  </Text>
                  <Text style={styles.settingDescription}>
                    Quickly disable all notifications
                  </Text>
                </View>
              </View>
              <CustomToggle
                value={settings.muteAll}
                onValueChange={(value) => updateSetting("muteAll", value)}
              />
            </View>
          </View>
        </View>

        {/* Milestone Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestone Alerts</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="award"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>
                      New Milestones Achieved
                    </Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.newMilestones}
                  onValueChange={(value) =>
                    updateSetting("newMilestones", value)
                  }
                  disabled={settings.muteAll}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="clock"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>
                      Remind Pending Milestone
                    </Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.pendingMilestone}
                  onValueChange={(value) =>
                    updateSetting("pendingMilestone", value)
                  }
                  disabled={settings.muteAll}
                />
              </View>
            </View>
          </View>
        </View>

        {/* AI Mentor Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Mentor Insights</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="zap"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>AI Mentor Insights</Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.aiInsights}
                  onValueChange={(value) => updateSetting("aiInsights", value)}
                  disabled={settings.muteAll}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Check-ins & Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-ins & Reminder</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="check-circle"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>Nora Check-ins</Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.noraCheckins}
                  onValueChange={(value) =>
                    updateSetting("noraCheckins", value)
                  }
                  disabled={settings.muteAll}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="bell"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>Task Reminders</Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.taskReminders}
                  onValueChange={(value) =>
                    updateSetting("taskReminders", value)
                  }
                  disabled={settings.muteAll}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Community */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name="users"
                      size={ms(20)}
                      color={colors.textPrimary}
                    />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>
                      Community Notifications
                    </Text>
                  </View>
                </View>
                <CustomToggle
                  value={settings.communityNotifications}
                  onValueChange={(value) =>
                    updateSetting("communityNotifications", value)
                  }
                  disabled={settings.muteAll}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
    gap: ms(spacing.md),
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  backButton: {
    padding: ms(spacing.xs),
  },
  headerTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ms(spacing.xxl),
  },
  topSection: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.lg),
  },
  section: {
    marginTop: ms(spacing.lg),
    paddingHorizontal: ms(spacing.lg),
  },
  sectionTitle: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.md),
  },
  settingsGroup: {
    gap: ms(spacing.sm),
  },
  settingCard: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ms(spacing.md),
    paddingHorizontal: ms(spacing.md),
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: ms(spacing.md),
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: colors.backgroundMain,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ms(spacing.sm),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
  },
  settingDescription: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodySmall.fontSize * 1.3,
    marginTop: ms(2),
  },
  footer: {
    height: ms(spacing.xl),
  },
});
