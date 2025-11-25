// app/profile/AboutScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

export default function AboutScreen() {
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
        <Text style={styles.headerTitle}>About Nora</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Our Mission */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardDescription}>
              We aim to make motherhood easier by providing clear insights,
              gentle reminders, and helpful tools designed to bring confidence
              and calm to your daily experience.
            </Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          {/* Personalized Guidance */}
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={ms(20)} color={colors.textPrimary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personalized Guidance</Text>
              <Text style={styles.featureDescription}>
                Receive advice tailored to your unique journey and questions
              </Text>
            </View>
          </View>

          {/* 24/7 Support */}
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={ms(20)} color={colors.textPrimary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>24/7 Support</Text>
              <Text style={styles.featureDescription}>
                We are here for you anytime, day or night
              </Text>
            </View>
          </View>

          {/* Resource Library */}
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={ms(20)} color={colors.textPrimary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Resource Library</Text>
              <Text style={styles.featureDescription}>
                Access a curated library of articles and tips
              </Text>
            </View>
          </View>
        </View>

        {/* Our Technology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Technology</Text>

          {/* Supportive AI */}
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Feather name="bell" size={ms(20)} color={colors.textPrimary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Supportive AI</Text>
              <Text style={styles.featureDescription}>
                Our AI is trained to be an empathetic and supportive partner. It
                learns from your conversations to provide relevant and helpful
                guidance, always ensuring your privacy and data are safe and
                secure.
              </Text>
            </View>
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.lg),
    paddingBottom: ms(spacing.xxl),
  },
  section: {
    marginBottom: ms(spacing.xl),
  },
  sectionTitle: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.md),
  },
  card: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(12),
    padding: ms(spacing.lg),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardTitle: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  cardDescription: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.fontSize * 1.5,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: colors.textWhite,
    borderRadius: ms(12),
    padding: ms(spacing.md),
    marginBottom: ms(spacing.sm),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: "flex-start",
  },
  featureIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: colors.backgroundMain,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ms(spacing.sm),
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xs),
  },
  featureDescription: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    lineHeight: typography.bodySmall.fontSize * 1.4,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: ms(spacing.xl),
    paddingVertical: ms(spacing.lg),
  },
  versionText: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textGrey1,
  },
  footer: {
    height: ms(spacing.xl),
  },
});