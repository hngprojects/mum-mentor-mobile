import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, spacing, typography } from '../../core/styles/index';
import { ms } from '../../core/styles/scaling';

interface CategoryChipsProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CATEGORIES = [
  'Sleep',
  'Memories',
  'Body Recovery',
  'Challenges',
  'Milestone',
  'Self-Care',
];

const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategories,
  onCategoryToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipsGrid}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onCategoryToggle(category)}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(spacing.lg),
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(spacing.sm),
  },
  chip: {
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
    borderRadius: ms(spacing.sm),
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.textWhite,
  },
  chipSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  chipText: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
    borderRadius: ms(spacing.sm),
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.textWhite,
  },
  addButtonText: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
});

export default CategoryChips;
