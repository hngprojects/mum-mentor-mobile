import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, typography } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';
import { UploadedPhoto } from './PhotoUploader';

interface JournalEntryCardProps {
  title: string;
  category: string;
  mood: string | null;
  thoughts: string;
  date: string;
  photo?: UploadedPhoto;
  onPress?: () => void;
}

const categoryEmojis: { [key: string]: string } = {
  'Sleep': '😴',
  'Memories': '❤️',
  'Body Recovery': '💪',
  'Challenges': '😂',
  'Milestone': '😍',
  'Self-Care': '💕',
};

const categoryColors: { [key: string]: string } = {
  'Sleep': colors.primary,
  'Memories': colors.error,
  'Body Recovery': '#FF6B6B',
  'Challenges': colors.error,
  'Milestone': colors.primary,
  'Self-Care': '#FFB3BA',
};

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  title,
  category,
  mood,
  thoughts,
  date,
  photo,
  onPress,
}) => {
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const formatDate = (dateString: string): string => {
    try {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const categoryEmoji = categoryEmojis[category] || '📝';
  const categoryColor = categoryColors[category] || colors.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Image */}
        {photo ? (
          <Image
            source={require('../../assets/images/journalUploadedimage.jpg')}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Content */}
        <View style={styles.textContent}>
          {/* Category and Emoji */}
          <View style={styles.categoryRow}>
            <Text style={[styles.category, { color: categoryColor }]}>
              {category}
            </Text>
            <Text style={styles.emoji}>{categoryEmoji}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Thoughts Preview */}
          <Text style={styles.thoughts}>{truncateText(thoughts)}</Text>

          {/* Date */}
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={ms(16)}
              color={colors.textGrey1}
            />
            <Text style={styles.date}>{formatDate(date)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.textWhite,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(12),
    marginBottom: ms(16),
    marginHorizontal: 0,
    overflow: 'hidden',
  } as ViewStyle,
  cardContent: {
    flexDirection: 'row',
    padding: ms(12),
    gap: ms(12),
  } as ViewStyle,
  image: {
    width: ms(100),
    height: ms(120),
    borderRadius: ms(8),
    marginRight: ms(12),
  } as ViewStyle,
  imagePlaceholder: {
    backgroundColor: colors.backgroundSubtle,
  } as ViewStyle,
  textContent: {
    flex: 1,
    justifyContent: 'space-between',
  } as ViewStyle,
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(4),
  } as ViewStyle,
  category: {
    ...typography.labelMedium,
    fontWeight: '600',
    marginRight: ms(4),
  } as TextStyle,
  emoji: {
    fontSize: rfs(16),
  } as TextStyle,
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: ms(4),
  } as TextStyle,
  thoughts: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: ms(8),
    lineHeight: rfs(18),
  } as TextStyle,
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  } as ViewStyle,
  date: {
    ...typography.caption,
    color: colors.textGrey1,
  } as TextStyle,
});

export default JournalEntryCard;
