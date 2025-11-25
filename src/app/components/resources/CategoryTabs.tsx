import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";

type Category = {
  id: string;
  label: string;
};

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategoryId, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <TouchableOpacity
            key={category.id}
            style={styles.tabButton}
            onPress={() => onSelect(category.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {category.label}
            </Text>
            <View style={[styles.indicator, isActive && styles.indicatorActive]} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    gap: ms(spacing.lg),
    paddingRight: ms(spacing.lg),
  },
  tabButton: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: rfs(typography.labelMedium.fontSize),
    fontFamily: typography.labelMedium.fontFamily,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelInactive: {
    color: colors.textGrey1,
  },
  indicator: {
    marginTop: ms(spacing.xs),
    height: ms(2),
    width: "100%",
    borderRadius: ms(1),
    backgroundColor: "transparent",
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
});

export default CategoryTabs;
