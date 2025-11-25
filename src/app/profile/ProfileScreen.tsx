// screens/ProfileScreen.tsx
import { logoutUser } from "@/src/core/services/authService";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditProfileModal from "./EditProfileScreen";
import LogoutModal from "./LogoutModal";

export default function ProfileScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/SignInScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <View style={styles.profileInfoCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Children</Text>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              style={styles.childCard}
              onPress={() => router.push("/profile/ChildInfoScreen")}
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

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/DataPrivacyScreen")}
            >
              <Feather name="shield" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Data & Privacy</Text>
                <Text style={styles.menuSubtitle}>
                  Manage your personal data
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/ChangePasswordScreen")}
            >
              <Feather name="settings" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Password</Text>
                <Text style={styles.menuSubtitle}>
                  Manage app settings, email, and preferences
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="bell" size={20} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Notification</Text>
                <Text style={styles.menuSubtitle}>
                  Choose what notifications you&apos;d like to receive
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Others */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Others</Text>

          <View style={styles.menuItemWrapper}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/profile/AboutScreen")}
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowLogout(true)}
            >
              <Feather name="log-out" size={20} color="#E63946" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: "#E63946" }]}>
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
      </ScrollView>

      {/* Edit Profile Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileInfoCard: {
    flexDirection: "column",
  },
  profileInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#E63946",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 10,
    color: "#333",
  },
  childCard: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#F0F0F0",
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  childDescription: {
    fontSize: 12,
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
  },
  menuTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#666",
  },
});
