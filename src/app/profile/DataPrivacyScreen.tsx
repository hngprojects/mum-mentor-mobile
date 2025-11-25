// screens/DataPrivacyScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomToggle from "../components/CustomToggle";

export default function DataPrivacyScreen() {
  const [shareData, setShareData] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Description */}
        <Text style={styles.description}>
          Manage your personal data and privacy preferences
        </Text>

        {/* Share Data Toggle */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Share data with third parties</Text>
          <CustomToggle value={shareData} onValueChange={setShareData} />
        </View>

        {/* Personalized Ads Toggle */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Allow personalized ads</Text>
          <CustomToggle
            value={personalizedAds}
            onValueChange={setPersonalizedAds}
          />
        </View>

        {/* Download Data */}
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Download Data</Text>
          <Feather name="download-cloud" size={20} color="#666" />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.settingItem, styles.deleteItem]}
          onPress={() => router.push("/profile/DeleteAccountScreen")}
        >
          <Text style={styles.deleteLabel}>Delete Account</Text>
        </TouchableOpacity>

        {/* Privacy Policy Link */}
        <TouchableOpacity style={styles.privacyLink}>
          <Text style={styles.privacyLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingLabel: {
    fontSize: 16,
    color: "#000",
  },
  deleteItem: {
    marginTop: 24,
    borderBottomWidth: 0,
  },
  deleteLabel: {
    fontSize: 16,
    color: "#E63946",
    fontWeight: "500",
  },
  privacyLink: {
    alignItems: "center",
    paddingVertical: 32,
  },
  privacyLinkText: {
    fontSize: 14,
    color: "#E63946",
    textDecorationLine: "underline",
  },
});
