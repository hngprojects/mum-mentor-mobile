import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { categories } from "./editForm";

export interface JournalItems {
  id: number;
  title: string;
  imageUrl: ImageSourcePropType | string;
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const parts = dateString.split("-");
  const year = parts[0];
  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);
  const monthName = months[month - 1];
  return `${monthName} ${day}, ${year}`;
}

const JournalCard = ({ journal }: JournalCardProps) => {
  const matchedCategory = categories.find(
    (cat) => cat.title === journal.category
  );
  const moodEmoji = journal.mood.split(" ")[1] || "";

  const imageSource =
    typeof journal.imageUrl === "string"
      ? { uri: journal.imageUrl }
      : journal.imageUrl;

  return (
    <View style={styles.cardContainer}>
      {journal.imageUrl ? (
        <Image
          source={imageSource}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={24} color={colors.textGrey1} />
        </View>
      )}

      <View style={styles.contentContainer}>
        {/* Header: Category & Mood */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor:
                  matchedCategory?.bgColor || colors.backgroundSubtle,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: matchedCategory?.color || colors.textPrimary },
              ]}
            >
              {journal.category}
            </Text>
          </View>
          <Text style={styles.moodText}>{moodEmoji}</Text>
        </View>

        {/* Title & Thoughts */}
        <Text style={styles.title} numberOfLines={1}>
          {journal.title}
        </Text>
        <Text style={styles.thoughts} numberOfLines={2} ellipsizeMode="tail">
          {journal.thoughts}
        </Text>

        {/* Footer: Date */}
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textGrey1}
          />
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
    height: ms(80),
    borderRadius: ms(8),
    backgroundColor: colors.backgroundSubtle,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
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
