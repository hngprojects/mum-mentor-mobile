import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../../core/styles";
import { ms, rfs } from "../../core/styles/scaling";
import ResourceListView from "../components/resources/ResourceListView";
import { resourceSections } from "./data";

const SectionResourcesScreen: React.FC = () => {
  const router = useRouter();
  const { sectionId } = useLocalSearchParams<{ sectionId?: string | string[] }>();

  const normalizedSectionId = Array.isArray(sectionId) ? sectionId[0] : sectionId;

  const section = useMemo(
    () => resourceSections.find((item) => item.id === normalizedSectionId),
    [normalizedSectionId],
  );

  const handleResourcePress = (resourceId: string) => {
    router.push({
      pathname: "/resources/detail/[resourceId]",
      params: { resourceId },
    });
  };

  if (!section) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
        <View style={styles.contentContainer}>
          <Text style={styles.errorTitle}>Resources not found</Text>
          <Text style={styles.errorMessage}>
            The selected resource collection is unavailable. Please try again later.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <View style={styles.contentContainer}>
        <ResourceListView
          title={section.title}
          resources={section.resources}
          searchPlaceholder={section.searchPlaceholder}
          onBack={() => router.back()}
          onResourcePress={handleResourcePress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xl * 1.5),
    gap: ms(spacing.xl),
  },
  errorTitle: {
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  errorMessage: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textSecondary,
  },
});

export default SectionResourcesScreen;
