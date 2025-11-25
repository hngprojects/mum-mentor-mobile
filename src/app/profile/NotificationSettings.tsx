// src/screens/NotificationSettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/src/core/styles';
import { ms, vs, rbr } from '@/src/core/styles/scaling';
import { router } from 'expo-router';
import CustomToggle from '../components/CustomToggle';

interface NotificationSettings {
  muteAll: boolean;
  newMilestones: boolean;
  remindPending: boolean;
  aiMentorInsights: boolean;
  noraCheckins: boolean;
  taskReminders: boolean;
  communityNotifications: boolean;
}

const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    muteAll: false,
    newMilestones: true,
    remindPending: true,
    aiMentorInsights: true,
    noraCheckins: true,
    taskReminders: true,
    communityNotifications: true,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // If "Mute All" is toggled, it could disable all others
  const handleMuteAll = () => {
    const newValue = !settings.muteAll;
    if (newValue) {
      // Mute all notifications
      setSettings({
        muteAll: true,
        newMilestones: false,
        remindPending: false,
        aiMentorInsights: false,
        noraCheckins: false,
        taskReminders: false,
        communityNotifications: false,
      });
    } else {
      // Unmute - restore default
      setSettings({
        muteAll: false,
        newMilestones: true,
        remindPending: true,
        aiMentorInsights: true,
        noraCheckins: true,
        taskReminders: true,
        communityNotifications: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mute All Notifications */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Mute All Notifications</Text>
              <Text style={styles.settingDescription}>
                Quickly disable all notifications
              </Text>
            </View>
            <CustomToggle
              value={settings.muteAll}
              onValueChange={handleMuteAll}
            />
          </View>
        </View>

        {/* Milestone Alerts Section */}
        <Text style={styles.sectionTitle}>Milestone Alerts</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>New Milestones Achieved</Text>
            </View>
            <CustomToggle
              value={settings.newMilestones && !settings.muteAll}
              onValueChange={() => handleToggle('newMilestones')}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Remind Pending Milestone</Text>
            </View>
            <CustomToggle
              value={settings.remindPending && !settings.muteAll}
              onValueChange={() => handleToggle('remindPending')}
            />
          </View>
        </View>

        {/* AI Mentor Insights Section */}
        <Text style={styles.sectionTitle}>AI Mentor Insights</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>AI Mentor Insights</Text>
            </View>
            <CustomToggle
              value={settings.aiMentorInsights && !settings.muteAll}
              onValueChange={() => handleToggle('aiMentorInsights')}
            />
          </View>
        </View>

        {/* Check-ins & Reminder Section */}
        <Text style={styles.sectionTitle}>Check-ins & Reminder</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Nora Check-ins</Text>
            </View>
            <CustomToggle
              value={settings.noraCheckins && !settings.muteAll}
              onValueChange={() => handleToggle('noraCheckins')}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Task Reminders</Text>
            </View>
            <CustomToggle
              value={settings.taskReminders && !settings.muteAll}
              onValueChange={() => handleToggle('taskReminders')}
            />
          </View>
        </View>

        {/* Community Section */}
        <Text style={styles.sectionTitle}>Community</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Community Notifications</Text>
            </View>
            <CustomToggle
              value={settings.communityNotifications && !settings.muteAll}
              onValueChange={() => handleToggle('communityNotifications')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: ms(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingTop: vs(20),
    paddingBottom: vs(40),
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: vs(24),
    marginBottom: vs(12),
  },
  settingCard: {
    backgroundColor: colors.backgroundMain,
    borderRadius: rbr(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: ms(16),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  settingTextContainer: {
    flex: 1,
    marginRight: ms(12),
  },
  settingTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(2),
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: vs(12),
  },
});