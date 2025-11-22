import { TextInput, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@/src/core/styles";

export default function CaptionInput({ value, onChangeText }: any) {
  return (
    <TextInput
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder="Write a caption..."
      placeholderTextColor={colors.textGrey2}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.bodyMedium,
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.md,
    borderRadius: 12,
    color: colors.textPrimary,
  },
});
