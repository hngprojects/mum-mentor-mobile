// screens/DataPrivacyScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomToggle from "../components/CustomToggle";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

export default function DataPrivacyScreen() {
  const [shareData, setShareData] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(false);

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
        <Text style={styles.headerTitle}>Data & Privacy</Text>
        <View style={{ width: ms(24) }} />
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
        <TouchableOpacity
          style={styles.settingItem}
          accessibilityRole="button"
          accessibilityLabel="Download your data"
        >
          <Text style={styles.settingLabel}>Download Data</Text>
          <Feather name="download-cloud" size={ms(20)} color={colors.textGrey1} />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.settingItem, styles.deleteItem]}
          onPress={() => router.push("/profile/DeleteAccountScreen")}
          accessibilityRole="button"
          accessibilityLabel="Delete your account"
        >
          <Text style={styles.deleteLabel}>Delete Account</Text>
        </TouchableOpacity>

        {/* Privacy Policy Link */}
        <TouchableOpacity
          style={styles.privacyLink}
          accessibilityRole="link"
          accessibilityLabel="View privacy policy"
        >
          <Text style={styles.privacyLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
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
  content: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.lg),
  },
  description: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    marginBottom: ms(spacing.xl),
    lineHeight: typography.bodyMedium.fontSize * 1.4,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ms(spacing.md),
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  settingLabel: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
  },
  deleteItem: {
    marginTop: ms(spacing.lg),
    borderBottomWidth: 0,
  },
  deleteLabel: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.error,
  },
  privacyLink: {
    alignItems: "center",
    paddingVertical: ms(spacing.xl),
  },
  privacyLinkText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.medium,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});