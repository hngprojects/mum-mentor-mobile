// src/app/components/journal/journalCard.tsx

import { colors, spacing, typography } from '@/src/core/styles';
import { ms, rfs, vs } from '@/src/core/styles/scaling';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { categories } from './editForm'; // Assuming this exists based on your code

export interface JournalItems {
  id: number;
  title: string;
  imageUrl: ImageSourcePropType;
  mood: string;
  thoughts: string;
  date: string;
  category: string;
}

export interface JournalCardProps {
  journal: JournalItems;
}

// Helper to format date
export function formatDate(dateString: string) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const parts = dateString.split("-");
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const monthName = months[month - 1];

  return `${monthName} ${day}, ${year}`;
}

export const journalEntries: JournalItems[] = [
  {
    id: 1,
    title: "First Steps!",
    category: "Milestones",
    mood: "Happy 😊",
    thoughts: "Today Maya took her first steps! I can’t believe how fast she’s growing. We were in living room and she she just let go of the couch and walked three steps towards me.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/mom-walking-baby.png")
  },
  {
    id: 2,
    title: "The Struggle with Sleep Training",
    category: "Challenges",
    mood: "Sad 😞",
    thoughts: "Night 3 of my sleep training and it’s so hard. listening to her cry breaks my heart when she struggles to sleep.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/worried-mom.png")
  },
  {
    id: 3,
    title: "A Day To Remember",
    category: "Memories",
    mood: "Happy ❤️",
    thoughts: "Today I found an old photo from our first picnic the way the sunlight hit the trees, the stories, laughter and ambience is something i hold and cherish.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/smiling-mom-and-preteen.png")
  },
  {
    id: 4,
    title: "Finally Made Time For Myself",
    category: "Selfcare",
    mood: "Self 💕",
    thoughts: "Took a 30-minute bath while grandma watched Maya. It was the first time in weeks since i had an alone time.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/mum-bubble-bath.png")
  },
];

const JournalCard = ({ journal }: JournalCardProps) => {
  const matchedCategory = categories.find((cat) => cat.title === journal.category);
  // Extract emoji safely
  const moodEmoji = journal.mood.split(" ")[1] || "";

  return (
    <View style={styles.cardContainer}>
      <Image 
        source={journal.imageUrl} 
        style={styles.thumbnail} 
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        {/* Header: Category & Mood */}
        <View style={styles.metaRow}>
          <View style={[
            styles.categoryBadge, 
            { backgroundColor: matchedCategory?.bgColor || colors.backgroundSubtle }
          ]}>
            <Text style={[
              styles.categoryText, 
              { color: matchedCategory?.color || colors.textPrimary }
            ]}>
              {journal.category}
            </Text>
          </View>
          <Text style={styles.moodText}>{moodEmoji}</Text>
        </View>

        {/* Title & Thoughts */}
        <Text style={styles.title} numberOfLines={1}>{journal.title}</Text>
        <Text style={styles.thoughts} numberOfLines={2} ellipsizeMode="tail">
          {journal.thoughts}
        </Text>

        {/* Footer: Date */}
        <View style={styles.dateRow}>
          {/* Using Ionicons instead of png for better styling control */}
          <Ionicons name="calendar-outline" size={16} color={colors.textGrey1} />
          <Text style={styles.dateText}>{formatDate(journal.date)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: ms(spacing.md),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.backgroundMain,
    gap: ms(spacing.md),
    marginBottom: vs(spacing.sm),
  },
  thumbnail: {
    width: ms(80),
    height: ms(80), // Fixed height to prevent layout shift
    borderRadius: ms(8),
    backgroundColor: colors.backgroundSubtle,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(4),
  },
  categoryBadge: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  categoryText: {
    ...typography.labelSmall,
    fontSize: rfs(10),
    fontWeight: "600",
  },
  moodText: {
    fontSize: rfs(14),
  },
  title: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(2),
  },
  thoughts: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: vs(8),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(4),
  },
  dateText: {
    ...typography.labelSmall,
    color: colors.textGrey1,
  },
});

export default JournalCard;