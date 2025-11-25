import { logoutUser } from "@/src/core/services/authService";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Image,
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
import EditProfileModal from "./EditProfileScreen";
import LogoutModal from "./LogoutModal";

/**
 * @fileoverview ProfileScreen component displaying user information and settings menu.
 * @exports ProfileScreen
 */
export default function ProfileScreen({ navigation }: any) {
  // --- State Variables ---
  const [modalVisible, setModalVisible] = useState(false); // Controls Edit Profile Modal
  const [showLogout, setShowLogout] = useState(false); // Controls Logout Confirmation Modal

  // --- Mock Data (Replace with real data fetch/context) ---
  const user = {
    name: "Tracy Michaels",
    role: "New mum",
    image: "https://i.pravatar.cc/150?img=5",
  };

  const child = {
    id: 1,
    name: "Child's Info",
    description: "Manage your baby's profile, age, and key details.",
  };

  // --- Handlers ---

  /** Handles the final logout action after confirmation. */
  const handleLogout = useCallback(async () => {
    try {
      // Execute the logout service call
      await logoutUser();
      // Navigate to the sign-in screen
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally show an alert if logout fails
    }
  }, []);

  // --- Render ---
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={ms(24)} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* --- Profile Card --- */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user.image }}
            style={styles.avatar}
            accessibilityLabel="User profile avatar"
          />
          <View style={styles.profileInfoCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
              accessibilityLabel="Edit Profile"
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Your Children Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Children</Text>
          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              style={styles.childCard}
              onPress={() => router.push("/profile/ChildInfoScreen")}
              accessibilityRole="button"
              accessibilityLabel="Manage child's profile details"
            >
              <View style={styles.childInfo}>
                <View style={styles.iconContainer}>
                  <Feather name="user" size={ms(20)} color={colors.textPrimary} />
                </View>
                <View style={styles.childTextContainer}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childDescription}>
                    {child.description}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Account Settings Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuItemWrapper}>
            {/* Data & Privacy */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemTop]}
              onPress={() => router.push("/profile/DataPrivacyScreen")}
              accessibilityRole="button"
            >
              <View style={styles.iconContainer}>
                <Feather name="shield" size={ms(20)} color={colors.textPrimary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Data & Privacy</Text>
                <Text style={styles.menuSubtitle}>Control what you share</Text>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>

            {/* Password */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBottom]}
              onPress={() => router.push("./ChangePasswordScreen")}
              accessibilityRole="button"
            >
              <View style={styles.iconContainer}>
                <Feather name="lock" size={ms(20)} color={colors.textPrimary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Password</Text>
                <Text style={styles.menuSubtitle}>Keep your account safe.</Text>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Preferences Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuItemWrapper}>
            {/* Notification */}
            <TouchableOpacity 
              style={styles.menuItem} 
              accessibilityRole="button"
              onPress={() => router.push('../notifications')}
            >
              <View style={styles.iconContainer}>
                <Feather name="bell" size={ms(20)} color={colors.textPrimary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Notification</Text>
                <Text style={styles.menuSubtitle}>
                  Choose alerts and reminders you'd like to receive.
                </Text>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Others Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Others</Text>
          <View style={styles.menuItemWrapper}>
            {/* About */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemTop]}
              onPress={() => router.push("./profile/AboutScreen")}
              accessibilityRole="button"
            >
              <View style={styles.iconContainer}>
                <Feather name="info" size={ms(20)} color={colors.textPrimary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>About Mum Mentor AI (Nora)</Text>
                <Text style={styles.menuSubtitle}>
                  Learn more about the app and our mission.
                </Text>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>

            {/* Log Out */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBottom]}
              onPress={() => setShowLogout(true)}
              accessibilityRole="button"
              accessibilityLabel="Log out of the account"
            >
              <View style={styles.iconContainer}>
                <Feather name="log-out" size={ms(20)} color={colors.error} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: colors.error }]}>
                  Log Out
                </Text>
                <Text style={styles.menuSubtitle}>
                  Sign out of your account safely.
                </Text>
              </View>
              <Feather name="chevron-right" size={ms(20)} color={colors.textGrey1} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* --- Modals --- */}
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <LogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContent: {
    paddingBottom: ms(spacing.xl),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
    gap: ms(spacing.md),
  },
  backButton: {
    padding: ms(spacing.xs),
  },
  headerTitle: {
    fontSize: typography.heading2.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  profileCard: {
    backgroundColor: colors.textWhite,
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.xl),
    alignItems: "center",
    flexDirection: "row",
    gap: ms(spacing.md),
  },
  avatar: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
  },
  profileInfoCard: {
    flexDirection: "column",
    flex: 1,
  },
  profileInfo: {
    marginBottom: ms(spacing.md),
  },
  userName: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    marginBottom: ms(spacing.xs),
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.sm),
    borderRadius: ms(8),
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: colors.textWhite,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
  section: {
    marginTop: ms(spacing.lg),
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    paddingHorizontal: ms(spacing.lg),
    marginBottom: ms(spacing.md),
    color: colors.textPrimary,
  },
  menuItemWrapper: {
    backgroundColor: colors.textWhite,
    marginHorizontal: ms(spacing.lg),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: "hidden",
  },
  childCard: {
    padding: ms(spacing.md),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: ms(spacing.sm),
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: colors.backgroundMain,
    justifyContent: "center",
    alignItems: "center",
  },
  childTextContainer: {
    flex: 1,
  },
  childName: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    marginBottom: ms(spacing.xs / 2),
    color: colors.textPrimary,
  },
  childDescription: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  menuItem: {
    padding: ms(spacing.md),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.textWhite,
    gap: ms(spacing.sm),
  },
  menuItemTop: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  menuItemBottom: {
    // Last item in the group, no bottom border needed
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    marginBottom: ms(spacing.xs / 2),
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodySmall.fontSize * 1.3,
  },
  footerSpacing: {
    height: ms(spacing.xl),
  },
});