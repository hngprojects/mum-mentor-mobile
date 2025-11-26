import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    GestureResponderEvent,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";

interface SavedResourceCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  categoryLabel: string;
  categoryId: string;
  onPress?: () => void;
  onRemovePress?: () => void;
}

const CATEGORY_BADGE_STYLES: Record<string, { backgroundColor: string; textColor: string }> = {
  parenting: { backgroundColor: "#E7F6ED", textColor: "#207245" },
  selfCare: { backgroundColor: "#ECE8FF", textColor: "#5146C1" },
  recipe: { backgroundColor: "#FFF5D9", textColor: "#C17E00" },
};

const getBadgeColors = (categoryId: string) => {
  const colorsForCategory = CATEGORY_BADGE_STYLES[categoryId];
  if (colorsForCategory) {
    return colorsForCategory;
  }

  return { backgroundColor: colors.secondaryExtraLight, textColor: colors.primary };
};

const SavedResourceCard: React.FC<SavedResourceCardProps> = ({
  title,
  description,
  image,
  categoryLabel,
  categoryId,
  onPress,
  onRemovePress,
}) => {
  const badgeColors = getBadgeColors(categoryId);

  const handleRemovePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemovePress?.();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      <Image source={image} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: badgeColors.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badgeColors.textColor }]}>{categoryLabel}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemovePress}
        accessibilityRole="button"
        accessibilityLabel="Remove saved resource"
      >
        <MaterialCommunityIcons name="bookmark-check" size={ms(24)} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: colors.outline,
    padding: ms(spacing.md),
    gap: ms(spacing.md),
  },
  thumbnail: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(12),
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    gap: ms(spacing.xs),
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: ms(spacing.sm),
    paddingVertical: ms(6),
    borderRadius: ms(12),
  },
  badgeText: {
    fontSize: rfs(typography.labelSmall.fontSize),
    fontFamily: typography.labelSmall.fontFamily,
  },
  title: {
    fontSize: rfs(typography.labelLarge.fontSize),
    fontFamily: typography.labelLarge.fontFamily,
    color: colors.textPrimary,
  },
  description: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
  },
  removeButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SavedResourceCard;
