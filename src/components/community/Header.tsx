// src/components/community/Header.tsx

import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/src/core/styles/index"


export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderColor: colors.outlineVariant,
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
});
