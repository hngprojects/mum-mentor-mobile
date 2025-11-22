import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Header from "@/src/components/community/Header";
import UploadProgressBar from "@/src/components/community/UploadProgressBar";
import { useCreatePost } from "@/src/hooks/useCreatePost";
import { colors, spacing, typography } from "@/src/core/styles";

export default function UploadPostScreen() {
  const { submitPost } = useCreatePost();
  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState<"uploading" | "done" | "error">(
    "uploading"
  );

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    // Fake progress UI
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 300);

    const run = async () => {
      try {
        await submitPost();
        if (!mounted) return;
        setProgress(100);
        setStatus("done");
      } catch (e) {
        if (!mounted) return;
        setStatus("error");
      }
    };

    run();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [submitPost]);

  return (
    <View style={styles.container}>
      <Header title="Uploading" />
      <View style={styles.content}>
        <Text style={styles.title}>
          {status === "uploading"
            ? "Uploading your post..."
            : status === "done"
            ? "Post uploaded!"
            : "Something went wrong"}
        </Text>

        <UploadProgressBar progress={progress} />

        {status === "uploading" && (
          <ActivityIndicator
            style={{ marginTop: spacing.md }}
            color={colors.primary}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});
