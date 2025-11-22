import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { deletePost } from "@/src/services/community.api";
import { colors, spacing, typography } from "@/src/core/styles";

export default function DeletePostScreen() {
  const { postId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    if (!postId || typeof postId !== "string") return;
    setLoading(true);
    try {
      await deletePost(postId);
      router.replace("/community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete this post?</Text>
      <Text style={styles.subtitle}>
        This action cannot be undone. Are you sure you want to continue?
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={confirmDelete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Deleting..." : "Yes, delete"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  cancelButton: {
    backgroundColor: colors.backgroundSoft,
  },
  buttonText: {
    ...typography.buttonText,
  },
  cancelText: {
    color: colors.textPrimary,
  },
});
