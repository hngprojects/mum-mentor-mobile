import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";

interface ResourceCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, image, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Image source={image} style={styles.thumbnail} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: colors.outline,
    padding: ms(spacing.lg),
    gap: ms(spacing.lg),
  },
  textContainer: {
    flex: 1,
    gap: ms(spacing.xs),
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
  thumbnail: {
    width: ms(96),
    height: ms(64),
    borderRadius: ms(12),
    resizeMode: "cover",
  },
});

export default ResourceCard;
