import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { categories } from "./editForm";
import { formatDate, type JournalCardProps } from "./journalCard";

const JournalDetails = ({ journal }: JournalCardProps) => {
  const matchedCategory = categories.find(
    (cat) => cat.title === journal.category
  );
  const moodEmoji = journal.mood.split(" ")[1] || "";

  const imageSource =
    typeof journal.imageUrl === "string"
      ? { uri: journal.imageUrl }
      : journal.imageUrl;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Meta Info */}
        <View style={styles.headerRow}>
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

        {/* Title */}
        <Text style={styles.title}>{journal.title}</Text>

        {/* Date */}
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.textGrey1}
          />
          <Text style={styles.dateText}>{formatDate(journal.date)}</Text>
        </View>

        {/* Big Image - only show if exists */}
        {journal.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* Thoughts Body */}
        <Text style={styles.bodyText}>{journal.thoughts}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: vs(40),
    paddingHorizontal: ms(spacing.md),
  },
  container: {
    width: "100%",
    padding: ms(spacing.md),
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(12),
    backgroundColor: colors.backgroundMain,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    marginBottom: vs(12),
  },
  categoryBadge: {
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  categoryText: {
    ...typography.labelMedium,
    fontWeight: "600",
  },
  moodText: {
    fontSize: rfs(16),
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(6),
    marginBottom: vs(spacing.lg),
  },
  dateText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.2,
    marginBottom: vs(spacing.lg),
    borderRadius: ms(8),
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  bodyText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});

export default JournalDetails;
