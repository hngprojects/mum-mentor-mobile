import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ResourceCard from "./ResourceCard";
import SearchBar from "./SearchBar";

import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";
import { ResourceListItem } from "../../resources/types";

interface ResourceListViewProps {
  title: string;
  resources: ResourceListItem[];
  searchPlaceholder?: string;
  initialQuery?: string;
  onBack?: () => void;
  onResourcePress?: (resourceId: string) => void;
}

const ResourceListView: React.FC<ResourceListViewProps> = ({
  title,
  resources,
  searchPlaceholder,
  initialQuery = "",
  onBack,
  onResourcePress,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return resources;
    }

    return resources.filter((resource) =>
      `${resource.title} ${resource.description}`.toLowerCase().includes(query),
    );
  }, [resources, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={ms(22)} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        <Text style={styles.screenTitle}>{title}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={searchPlaceholder}
      />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredResources.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No resources match your search.
          </Text>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              description={resource.description}
              image={resource.image}
              onPress={onResourcePress ? () => onResourcePress(resource.id) : undefined}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ms(spacing.lg),
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
  backButtonPlaceholder: {
    width: ms(40),
    height: ms(40),
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
  listContent: {
    gap: ms(spacing.md),
    paddingBottom: ms(spacing.xl * 1.25),
  },
  emptyStateText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: ms(spacing.lg),
  },
});

export default ResourceListView;
