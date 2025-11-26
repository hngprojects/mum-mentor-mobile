// src/components/shared/EmptyState.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../PrimaryButton";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={colors.textGrey1} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {buttonText && onButtonPress && (
        <View style={styles.buttonContainer}>
          <PrimaryButton title={buttonText} onPress={onButtonPress} />
        </View>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(spacing.xl),
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginTop: vs(spacing.lg),
    textAlign: "center",
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
    marginTop: vs(spacing.sm),
  },
  buttonContainer: {
    width: "100%",
    maxWidth: ms(280),
    marginTop: vs(spacing.xl),
  },
});
