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
import ResourceSection, {
  ResourceListItem,
} from "../components/resources/ResourceSection";
import SearchBar from "../components/resources/SearchBar";

type Category = {
  id: string;
  label: string;
};

type ResourceSectionData = {
  id: string;
  title: string;
  categoryId: string;
  resources: ResourceListItem[];
};

const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "parenting", label: "Parenting" },
  { id: "selfCare", label: "Self-care" },
  { id: "recipe", label: "Quick recipe" },
];

// Temporary demo data to mirror the design. This will be replaced by API data once available.
const resourceSections: ResourceSectionData[] = [
  {
    id: "parenting-hacks",
    title: "Parenting Hacks",
    categoryId: "parenting",
    resources: [
      {
        id: "quick-diaper",
        title: "Quick Diaper Change",
        description: "Use a portable changing pad and keep essentials organized.",
        image: { uri: "" },
      },
      {
        id: "soothing-crying-baby",
        title: "Soothing a Crying Baby",
        description: "Try swaddling, gentle rocking, or white noise to calm your baby.",
        image: { uri: "" },
      },
    ],
  },
  {
    id: "quick-recipes",
    title: "Quick Recipes",
    categoryId: "recipe",
    resources: [
      {
        id: "easy-smoothie",
        title: "Easy Smoothie",
        description: "Whip up a vitamin-rich smoothie to keep energy levels up.",
        image: { uri: "" },
      },
      {
        id: "avocado-toast",
        title: "Avocado Toast",
        description: "Layer avocado on toast for a fast, filling bite.",
        image: { uri: "" },
      },
    ],
  },
  {
    id: "child-development",
    title: "Child Development",
    categoryId: "parenting",
    resources: [
      {
        id: "encouraging-crawling",
        title: "Encouraging Crawling",
        description: "Place toys just out of reach to motivate your baby to crawl.",
        image: { uri: "" },
      },
      {
        id: "first-words",
        title: "First Words",
        description: "Talk to your baby often and repeat simple words to encourage speech.",
        image: { uri: "" },
      },
    ],
  },
];

const ResourcesScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);

  const visibleSections = useMemo(() => {
    if (activeCategoryId === "all") {
      return resourceSections;
    }

    return resourceSections.filter(
      (section) => section.categoryId === activeCategoryId,
    );
  }, [activeCategoryId]);

  const handleViewAll = (_sectionTitle: string) => {
    // TODO: Wire up navigation to category-specific list once endpoints are available.
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
              // TODO: Navigate to saved resources when feature is available.
            }}
            style={styles.viewSavedButton}
            accessibilityRole="button"
          >
            <Text style={styles.viewSavedLabel}>View Saved</Text>
          </TouchableOpacity>
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionLabel}>Categories</Text>
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </View>

        {visibleSections.map((section) => (
          <ResourceSection
            key={section.id}
            title={section.title}
            resources={section.resources}
            onPressViewAll={() => handleViewAll(section.title)}
            style={styles.sectionSpacing}
          />
        ))}
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
});

export default ResourcesScreen;
