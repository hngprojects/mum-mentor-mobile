import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import ResourceCard from "./ResourceCard";
import SectionHeader from "./SectionHeader";

import { spacing } from "../../../core/styles";
import { ms } from "../../../core/styles/scaling";

import { ResourceListItem } from "../../resources/types";

interface ResourceSectionProps {
  title: string;
  resources: ResourceListItem[];
  style?: StyleProp<ViewStyle>;
  onPressViewAll?: () => void;
  onPressResource?: (resourceId: string) => void;
}

// Groups a titled resource collection with an optional "View all" action.
const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  resources,
  style,
  onPressViewAll,
  onPressResource,
}) => {
  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={title} onPressAction={onPressViewAll} />
      <View style={styles.cardsStack}>
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            title={resource.title}
            description={resource.description}
            image={resource.image}
            onPress={onPressResource ? () => onPressResource(resource.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: ms(spacing.md),
  },
  cardsStack: {
    gap: ms(spacing.md),
  },
});

export default ResourceSection;
