import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import { colors, fontFamilies, spacing, typography } from "../core/styles";
import { ms } from "../core/styles/scaling";
import PrimaryButton from "./components/PrimaryButton";

const heroImage = require("../assets/images/Home-images/home-image.png");
const profileImage = require("../assets/images/Home-images/profile-image.png");
const notificationIcon = require("../assets/images/Home-images/notification.png");
const resourceIcon = require("../assets/images/Home-images/resource-icon.png");
const journalIcon = require("../assets/images/Home-images/journal-icon.png");
const taskIcon = require("../assets/images/Home-images/task-icon.png");

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const quickActions: {
  id: string;
  title: string;
  subtitle: string;
  icon: FeatherIconName;
}[] = [
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

const HeaderIconButton = ({ name, style }: { name: FeatherIconName; style?: ViewStyle }) => (
  <TouchableOpacity style={[styles.iconButton, style]} activeOpacity={0.8}>
    <Feather name={name} size={20} color={colors.textPrimary} />
  </TouchableOpacity>
);

const Home = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topBar}>
        <View>
          <View style={styles.greetingRow}>
            <Image source={profileImage} style={styles.profileAvatar} />
            <Text style={styles.greetingLabel}>Hi, Tracy</Text>
          </View>
          <Text style={styles.greetingTitle}>Good Morning</Text>
        </View>
        <Image source={notificationIcon} style={styles.notificationIcon} />
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroImageWrapper}>
          <Image source={heroImage} style={styles.heroImage} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>You are Amazing</Text>
          <Text style={styles.heroSubtitle}>
            You're growing right alongside your child,{"\n"}and that's something to be proud of
          </Text>
          <PrimaryButton title="Chat with Nora AI" onPress={() => {}} style={styles.heroButton} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <View key={action.id} style={styles.quickActionCard}>
              {action.id === "journal" ? (
                <Image source={journalIcon} style={[styles.quickActionImage, styles.quickActionIconSpacing]} />
              ) : action.id === "resources" ? (
                <Image source={resourceIcon} style={[styles.quickActionImage, styles.quickActionIconSpacing]} />
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Task</Text>
        <View style={styles.taskCard}>
          <Image source={taskIcon} style={styles.taskIcon} />
          <Text style={styles.taskEmptyTitle}>No task added yet</Text>
          <Text style={styles.taskEmptySubtitle}>
            Your today’s task will be displayed here
          </Text>
          <PrimaryButton
            title="Add Task"
            onPress={() => {}}
            style={styles.taskButton}
            textStyle={styles.taskButtonText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
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
  iconButton: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.textWhite,
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
  },
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
    width: ms(240),
    height: ms(200),
    top: -ms(17),
    right: -ms(20),
    resizeMode: "cover",
    borderTopLeftRadius: ms(32),
    borderBottomLeftRadius: ms(32),
  },
  section: {
    gap: ms(spacing.md),
  },
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
    borderWidth: 2,
    borderColor: colors.primary,
  },
  taskButtonText: {
    color: colors.primary,
  },
});
