import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Link } from "expo-router";
import Header from "@/src/components/community/Header";
import PhotoThumbnail from "@/src/components/community/PhotoThumbnail";
import { useCreatePost } from "@/src/hooks/useCreatePost";
import { colors, spacing, typography } from "@/src/core/styles";

export default function SelectPhotosScreen() {
  const {
    galleryPhotos,
    selectedPhotos,
    setGalleryPhotos,
    toggleSelectPhoto,
  } = useCreatePost();

  // TEMP: fill with mock gallery data so UI works
  useEffect(() => {
    if (galleryPhotos.length === 0) {
      const mock = Array.from({ length: 12 }).map((_, i) => ({
        uri: `https://picsum.photos/seed/gallery-${i}/400/400`,
        selected: false,
      }));
      setGalleryPhotos(mock);
    }
  }, [galleryPhotos.length, setGalleryPhotos]);

  const canContinue = selectedPhotos.length > 0;

  return (
    <View style={styles.container}>
      <Header title="Select Photos" />

      <FlatList
        data={galleryPhotos}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        renderItem={({ item }) => (
          <PhotoThumbnail
            photo={item}
            selected={item.selected}
            onPress={() => toggleSelectPhoto(item.uri)}
          />
        )}
      />

      <Link href="/community/create/preview" asChild disabled={!canContinue}>
        <TouchableOpacity
          style={[styles.button, !canContinue && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Next</Text>
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
  button: {
    margin: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.outline,
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },
});
