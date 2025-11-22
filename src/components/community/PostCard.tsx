import { View, Text, Image, StyleSheet } from "react-native";
import PostMediaGrid from "./PostMediaGrid";
import { colors, spacing, typography } from "@/src/core/styles/index";
import { Ionicons } from "@expo/vector-icons";

export default function PostCard({ post, full }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: post?.userImage }} style={styles.userImage} />
        <Text style={styles.userName}>{post?.userName}</Text>
      </View>

      <Text style={styles.caption}>{post?.caption}</Text>

      <PostMediaGrid images={post?.images} full={full} />

      <View style={styles.actionsRow}>
        <Ionicons name="heart-outline" size={22} color={colors.textGrey1} />
        <Ionicons name="chatbubble-outline" size={22} color={colors.textGrey1} />
        <Ionicons name="arrow-redo-outline" size={22} color={colors.textGrey1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.textWhite,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.outlineVariant,
  },
  userName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  caption: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
});
