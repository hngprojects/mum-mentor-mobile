import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, spacing, typography } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (moodId: string) => void;
}

const MOODS: MoodOption[] = [
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'self', label: 'Self', emoji: '🧘' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'stressed', label: 'Stressed', emoji: '😰' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mood (Optional)</Text>
      <View style={styles.moodsGrid}>
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                isSelected && styles.moodButtonSelected,
              ]}
              onPress={() => onMoodSelect(mood.id)}
            >
              <Text
                style={[
                  styles.moodLabel,
                  isSelected && styles.moodLabelSelected,
                ]}
              >
                {mood.label}
              </Text>
              <Text style={styles.emoji}>{mood.emoji}</Text>
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
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(spacing.sm),
  },
  moodButton: {
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
    borderRadius: ms(spacing.sm),
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.textWhite,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(spacing.xs),
  },
  moodButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  emoji: {
    fontSize: rfs(16),
  },
  moodLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  moodLabelSelected: {
    color: colors.primary,
    ...typography.labelSmall,
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

export default MoodSelector;
