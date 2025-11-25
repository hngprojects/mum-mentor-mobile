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

// --- Component Imports ---
import EditProfileModal from "./EditProfileScreen";
import LogoutModal from "./LogoutModal";
import { colors, typography } from "@/src/core/styles";

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
    role: "New mom",
    image: "https://i.pravatar.cc/150?img=5",
  };

  const child = {
    id: 1,
    name: "Child's info",
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
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
                <Feather name="user" size={20} color="#666" />
                <View style={styles.childTextContainer}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childDescription}>
                    {child.description}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
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
              <Feather name="shield" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Data & Privacy</Text>
                <Text style={styles.menuSubtitle}>Manage your personal data</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            {/* Password */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBottom]}
              onPress={() => router.push("/profile/ChangePasswordScreen")}
              accessibilityRole="button"
            >
              <Feather name="lock" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Password</Text>
                <Text style={styles.menuSubtitle}>
                  Change or reset your account password
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Preferences Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuItemWrapper}>
            {/* Notification */}
            <TouchableOpacity style={styles.menuItem} accessibilityRole="button"
              onPress={() => router.push("/profile/NotificationSettings")}
            >
              <Feather name="bell" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Notification</Text>
                <Text style={styles.menuSubtitle}>
                  Choose what notifications you'd like to receive
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
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
              onPress={() => router.push("/profile/AboutScreen")}
              accessibilityRole="button"
            >
              <Feather name="info" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>About Mum Meetup At Home</Text>
                <Text style={styles.menuSubtitle}>
                  Learn more about the app and our mission
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            {/* Log Out */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBottom]}
              onPress={() => setShowLogout(true)}
              accessibilityRole="button"
              accessibilityLabel="Log out of the account"
            >
              <Feather name="log-out" size={20} color="#E63946" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: colors.error }]}>
                  Log Out
                </Text>
                <Text style={styles.menuSubtitle}>
                  Sign out of your account safely
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    ...typography.heading2
  },
  profileCard: {
    backgroundColor: colors.backgroundMain,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfoCard: {
    flexDirection: "column",
    flex: 1,
  },
  profileInfo: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
    ...typography.bodyLarge,
  },
  userRole: {
    color: "#666",
    ...typography.bodyMedium
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start", // Keep button tight to text
  },
  editButtonText: {
    color: colors.backgroundMain,
    ...typography.labelMedium
  },
  section: {
    marginTop: 25, // Increased spacing between sections
  },
  sectionTitle: {
    paddingHorizontal: 4,
    marginBottom: 10,
    color: "#333",
  },
  childCard: {
    backgroundColor: colors.backgroundMain,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  childTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  childName: {
    ...typography.labelLarge,
    marginBottom: 4,
    color: "#333",
  },
  childDescription: {
    ...typography.labelMedium,
    color: "#666",
  },
  menuItemWrapper: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#F0F0F0",
  },
  menuItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  menuItemTop: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0", // Separator line for items
  },
  menuItemBottom: {
    // Last item in the group, no bottom border needed within the wrapper
  },
  menuTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    ...typography.labelLarge,
    marginBottom: 4,
    color: "#333",
  },
  menuSubtitle: {
    ...typography.labelMedium,
    color: "#666",
  },
});