import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel = "View all",
  onPressAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onPressAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <Feather
            name="chevron-right"
            size={ms(18)}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(spacing.xs),
  },
  actionLabel: {
    fontSize: rfs(typography.labelMedium.fontSize),
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.primary,
  },
});

export default SectionHeader;
