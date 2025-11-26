import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../../core/styles";
import { ms, rfs } from "../../core/styles/scaling";
import CategoryTabs from "../components/resources/CategoryTabs";
import ResourceSection from "../components/resources/ResourceSection";
import SearchBar from "../components/resources/SearchBar";
import { categories, resourceSections } from "./data";

const ResourcesScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);

  const filteredSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    let sections =
      activeCategoryId === "all"
        ? resourceSections
        : resourceSections.filter((section) => section.categoryId === activeCategoryId);

    if (!normalizedQuery) {
      return sections;
    }

    sections = sections
      .map((section) => {
        const visibleResources = section.resources.filter((resource) =>
          `${resource.title} ${resource.description}`.toLowerCase().includes(normalizedQuery),
        );

        return { ...section, resources: visibleResources };
      })
      .filter((section) => section.resources.length > 0);

    return sections;
  }, [activeCategoryId, searchQuery]);

  const handleViewAll = (sectionId: string) => {
    router.push({ pathname: "/resources/[sectionId]", params: { sectionId } });
  };

  const handleResourcePress = (resourceId: string) => {
    router.push({
      pathname: "/resources/detail/[resourceId]",
      params: { resourceId },
    });
  };

  const hasResults = filteredSections.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button, title, and View Saved action */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={ms(22)} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.screenTitle}>Resources</Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/resources/saved");
            }}
            style={styles.viewSavedButton}
            accessibilityRole="button"
          >
            <Text style={styles.viewSavedLabel}>View Saved</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
        />

        {/* Category filter tabs */}
        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionLabel}>Categories</Text>
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </View>

        {/* Resource sections or empty state */}
        {hasResults ? (
          filteredSections.map((section) => {
            const displayedResources = searchQuery
              ? section.resources
              : section.resources.slice(0, 2);

            return (
              <ResourceSection
                key={section.id}
                title={section.title}
                resources={displayedResources}
                onPressViewAll={() => handleViewAll(section.id)}
                onPressResource={handleResourcePress}
                style={styles.sectionSpacing}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptyDescription}>
              Try a different search term or choose another category.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xl * 1.5),
    gap: ms(spacing.xl),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: ms(spacing.sm),
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
  },
  viewSavedButton: {
    paddingVertical: ms(spacing.xs),
    paddingHorizontal: ms(spacing.xs),
  },
  viewSavedLabel: {
    fontSize: rfs(typography.labelMedium.fontSize),
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.primary,
  },
  sectionSpacing: {
    gap: ms(spacing.md),
  },
  sectionLabel: {
    fontSize: rfs(typography.labelLarge.fontSize),
    fontFamily: typography.labelLarge.fontFamily,
    color: colors.textPrimary,
  },
  emptyState: {
    gap: ms(spacing.xs),
    paddingVertical: ms(spacing.lg),
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
  },
  emptyDescription: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default ResourcesScreen;
