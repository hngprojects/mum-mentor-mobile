import { colors, typography } from "@/src/core/styles";
import React, { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

interface FormInputProps extends PropsWithChildren {
  label: string;
  error?: string;
}

export default function FormInput({ children, label, error }: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // create milestone form

  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: "right",
  },

  input: {
    borderRadius: 8,
    padding: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    ...typography.caption,
    height: 48,
  },

  label: {
    ...typography.labelLarge,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  inputGroup: {
    gap: 4,
  },
});
