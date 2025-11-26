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

import DeleteConfirmModal from "../components/DeleteConfirmationModal";
import CategoryTabs from "../components/resources/CategoryTabs";
import SavedResourceCard from "../components/resources/SavedResourceCard";
import SearchBar from "../components/resources/SearchBar";

import { useSavedResources } from "../../core/services/savedResourcesContext";
import { colors, spacing, typography } from "../../core/styles";
import { ms, rfs } from "../../core/styles/scaling";
import { categories, resourceSections } from "./data";
import { ResourceListItem } from "./types";

interface EnrichedResource extends ResourceListItem {
  categoryId: string;
  categoryLabel: string;
}

const ResourcesSavedScreen: React.FC = () => {
  const router = useRouter();
  const { savedResourceIds, removeResource } = useSavedResources();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const resourceIndex = useMemo(() => {
    const index = new Map<string, { resource: ResourceListItem; categoryId: string }>();

    resourceSections.forEach((section) => {
      section.resources.forEach((resource) => {
        if (!index.has(resource.id)) {
          index.set(resource.id, { resource, categoryId: section.categoryId });
        }
      });
    });

    return index;
  }, []);

  const savedResources = useMemo(() => {
    return savedResourceIds
      .map<EnrichedResource | null>((id) => {
        const entry = resourceIndex.get(id);
        if (!entry) {
          return null;
        }

        const category = categories.find((item) => item.id === entry.categoryId);
        return {
          ...entry.resource,
          categoryId: entry.categoryId,
          categoryLabel: category ? category.label : "All",
        };
      })
      .filter((item): item is EnrichedResource => Boolean(item));
  }, [savedResourceIds, resourceIndex]);

  const filteredResources = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return savedResources.filter((resource) => {
      if (activeCategoryId !== "all" && resource.categoryId !== activeCategoryId) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = `${resource.title} ${resource.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [savedResources, searchQuery, activeCategoryId]);

  const hasSavedResources = savedResources.length > 0;
  const hasFilteredResources = filteredResources.length > 0;

  const resourcePendingDeletion = pendingDeleteId ? resourceIndex.get(pendingDeleteId) : null;

  const handleRemoveRequest = (resourceId: string) => {
    setPendingDeleteId(resourceId);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setPendingDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      removeResource(pendingDeleteId);
    }
    setIsDeleteModalVisible(false);
    setPendingDeleteId(null);
  };

  const handleResourcePress = (resourceId: string) => {
    router.push({
      pathname: "/resources/detail/[resourceId]",
      params: { resourceId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={ms(22)} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.screenTitle}>Saved for Later</Text>

          <View style={styles.headerSpacer} />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for Saved tips"
        />

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionLabel}>Categories</Text>
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {hasFilteredResources ? (
            filteredResources.map((resource) => (
              <SavedResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                image={resource.image}
                categoryLabel={resource.categoryLabel}
                categoryId={resource.categoryId}
                onPress={() => handleResourcePress(resource.id)}
                onRemovePress={() => handleRemoveRequest(resource.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {hasSavedResources ? "No saved tips found" : "No tips saved yet"}
              </Text>
              <Text style={styles.emptyDescription}>
                {hasSavedResources
                  ? "Try a different search term or choose another category."
                  : "Save tips to revisit them later."}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        title="Remove Saved Tip"
        message={resourcePendingDeletion?.resource
          ? `Are you sure you want to remove "${resourcePendingDeletion.resource.title}" from your saved tips?`
          : "Are you sure you want to remove this tip from your saved tips?"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ms(spacing.lg),
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
    marginHorizontal: ms(spacing.sm),
    fontSize: rfs(typography.heading2.fontSize),
    fontFamily: typography.heading2.fontFamily,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: ms(40),
  },
  categoriesSection: {
    marginTop: ms(spacing.lg),
    gap: ms(spacing.md),
  },
  sectionLabel: {
    fontSize: rfs(typography.labelLarge.fontSize),
    fontFamily: typography.labelLarge.fontFamily,
    color: colors.textPrimary,
  },
  listContent: {
    paddingVertical: ms(spacing.xl),
    gap: ms(spacing.md),
    paddingBottom: ms(spacing.xl * 1.5),
  },
  emptyState: {
    alignItems: "center",
    gap: ms(spacing.sm),
    paddingVertical: ms(spacing.lg),
  },
  emptyTitle: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
    textAlign: "center",
    paddingHorizontal: ms(spacing.lg),
  },
});

export default ResourcesSavedScreen;
