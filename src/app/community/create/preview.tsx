import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import Header from "@/src/components/community/Header";
import { useCreatePost } from "@/src/hooks/useCreatePost";
import { colors, spacing, typography } from "@/src/core/styles";

export default function PreviewPostScreen() {
  const { caption, selectedPhotos } = useCreatePost();

  return (
    <View style={styles.container}>
      <Header title="Preview" />

      <ScrollView contentContainerStyle={styles.content}>
        {selectedPhotos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo.uri }}
            style={styles.image}
          />
        ))}

        <Text style={styles.caption}>{caption}</Text>
      </ScrollView>

      <Link href="/community/create/upload" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    padding: spacing.md,
  },
  image: {
    width: "100%",
    height: 320,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  caption: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  button: {
    margin: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },
});
