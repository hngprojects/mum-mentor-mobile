import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSavedResources } from "../../../core/services/savedResourcesContext";
import { colors, spacing } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";
import SuccessModal from "../../components/SuccessModal";
import ResourceDetailView from "../../components/resources/ResourceDetailView";
import { resourceSections } from "../data";
import { ResourceListItem } from "../types";

const ResourceDetailScreen: React.FC = () => {
  const router = useRouter();
  const { resourceId } = useLocalSearchParams<{ resourceId?: string | string[] }>();
  const { saveResource, isResourceSaved } = useSavedResources();
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const normalizedResourceId = Array.isArray(resourceId) ? resourceId[0] : resourceId;

  // Find the resource and its section
  const { resource, sectionId } = useMemo(() => {
    for (const section of resourceSections) {
      const found = section.resources.find((r) => r.id === normalizedResourceId);
      if (found) {
        return { resource: found, sectionId: section.id };
      }
    }
    return { resource: null, sectionId: null };
  }, [normalizedResourceId]);

  // Get related resources: prioritize same section, then add from other sections
  const relatedResources = useMemo(() => {
    if (!resource || !sectionId) return [];

    const related: ResourceListItem[] = [];
    
    // First, get resources from the same section (excluding current resource)
    const currentSection = resourceSections.find((s) => s.id === sectionId);
    if (currentSection) {
      const sameSectionResources = currentSection.resources
        .filter((r) => r.id !== resource.id)
        .slice(0, 3);
      related.push(...sameSectionResources);
    }

    // If we need more, add from other sections
    if (related.length < 3) {
      const needed = 3 - related.length;
      const otherSectionResources = resourceSections
        .filter((s) => s.id !== sectionId)
        .flatMap((s) => s.resources)
        .filter((r) => r.id !== resource.id)
        .slice(0, needed);
      related.push(...otherSectionResources);
    }

    return related;
  }, [resource, sectionId]);

  if (!resource) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Resource not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveForLater = () => {
    if (!resource) {
      return;
    }

    saveResource(resource.id);
    setIsSaveModalVisible(true);
  };

  const handleWatchNow = () => {
    if (!resource?.videoUrl) {
      return;
    }

    router.push({
      pathname: "/resources/detail/[resourceId]/watch",
      params: { resourceId: resource.id },
    });
  };

  const handleRelatedResourcePress = (relatedResourceId: string) => {
    router.push({
      pathname: "/resources/detail/[resourceId]",
      params: { resourceId: relatedResourceId },
    });
  };

  const handleCloseSaveModal = () => {
    setIsSaveModalVisible(false);
  };

  const handleViewSavedItems = () => {
    setIsSaveModalVisible(false);
    router.push("/resources/saved");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <View style={styles.container}>
        <ResourceDetailView
          resource={resource}
          relatedResources={relatedResources}
          onBack={() => router.back()}
          onSaveForLater={handleSaveForLater}
          onWatchNow={handleWatchNow}
          onRelatedResourcePress={handleRelatedResourcePress}
          saveButtonLabel={resource ? (isResourceSaved(resource.id) ? "Saved" : undefined) : undefined}
        />
      </View>
      {resource ? (
        <SuccessModal
          visible={isSaveModalVisible}
          onClose={handleCloseSaveModal}
          title="Saved for Later"
          message={`${resource.title} has been added to your saved tips.`}
          buttonText="Done"
          secondaryButtonText="View saved items"
          onSecondaryAction={handleViewSavedItems}
        />
      ) : null}
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ms(spacing.lg),
  },
  errorText: {
    fontSize: rfs(16),
    color: colors.textSecondary,
  },
});

export default ResourceDetailScreen;
