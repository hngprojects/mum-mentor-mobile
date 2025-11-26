import { logoutUser } from "@/src/core/services/authService";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

// --- Component Imports ---
import EditProfileModal from "./EditProfileScreen";
import LogoutModal from "./LogoutModal";

// --- API Imports ---
import apiClient from "../../core/services/apiClient";

/**
 * @fileoverview ProfileScreen component displaying user information and settings menu.
 * @exports ProfileScreen
 */

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  profile_image?: string;
  mom_status?: string;
  goals?: string[];
  partner?: {
    name: string;
    email: string;
  };
  children?: any[];
}

export default function ProfileScreen({ navigation }: any) {
  // --- State Variables ---
  const [modalVisible, setModalVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Profile Setup ---
  const fetchProfileSetup = async (baseProfile: UserProfile) => {
    try {
      const response = await apiClient.get("/api/v1/profile-setup/");
      console.log("Profile setup response:", response.data);
      
      if (response.data) {
        setUserProfile({
          ...baseProfile,
          mom_status: response.data.mom_status,
          goals: response.data.goals,
          partner: response.data.partner,
          children: response.data.children,
        });
      }
    } catch (err: any) {
      console.log("Profile setup not available:", err.response?.status);
      // Keep base profile if setup doesn't exist
    }
  };

  // --- Fetch User Profile ---
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching user profile...");
      const response = await apiClient.get("/api/v1/auth/profile");
      console.log("Profile response:", response.data);
      
      // The actual user data is nested in response.data.data
      if (response.data?.data) {
        const userData = response.data.data;
        
        // Transform the API response to match our UserProfile interface
        const transformedProfile: UserProfile = {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name || '',
          profile_image: userData.profile?.avatar_url || undefined,
        };
        
        setUserProfile(transformedProfile);
        
        // Fetch additional profile setup data (mom_status, goals, etc.)
        await fetchProfileSetup(transformedProfile);
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // --- Handlers ---
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  const handleProfileUpdated = useCallback(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // --- Helper Functions ---
  const getUserDisplayName = () => {
    return userProfile?.full_name || "User";
  };

  const getUserRole = () => {
    if (!userProfile?.mom_status) return "User";
    return userProfile.mom_status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getUserImage = () => {
    return userProfile?.profile_image || "https://i.pravatar.cc/150?img=5";
  };

  const child = {
    id: 1,
    name: "Child's Info",
    description: "Manage your baby's profile, age, and key details.",
  };

  // --- Loading State ---
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={ms(48)} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            source={{ uri: getUserImage() }}
            style={styles.avatar}
            accessibilityLabel="User profile avatar"
          />
          <View style={styles.profileInfoCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{getUserDisplayName()}</Text>
              <Text style={styles.userRole}>{getUserRole()}</Text>
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
              onPress={() => router.push('./NotificationsSettings')}
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
              onPress={() => router.push("./About")}
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
        onProfileUpdated={handleProfileUpdated}
        userProfile={userProfile}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: ms(spacing.md),
  },
  loadingText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(spacing.xl),
    gap: ms(spacing.md),
  },
  errorText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.error,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: ms(spacing.xl),
    paddingVertical: ms(spacing.md),
    borderRadius: ms(8),
    marginTop: ms(spacing.md),
  },
  retryButtonText: {
    color: colors.textWhite,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
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
  menuItemBottom: {},
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