// src/features/community/screens/SelectPhotosScreen.tsx

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { PhotoPickerItem } from '../components/PhotoPickerItem';
import { useCreatePostStore } from '../stores/createPostStore';
import { colors, spacing } from '@/core/styles';
import { useRouter } from 'expo-router';

interface LocalPhoto {
  id: string;
  uri: string;
}

const MOCK_PHOTOS: LocalPhoto[] = []; // replace with real media query

export const SelectPhotosScreen: React.FC = () => {
  const router = useRouter();
  const { selectedMedia, setSelectedMedia } = useCreatePostStore();
  const [photos] = useState<LocalPhoto[]>(MOCK_PHOTOS);

  const isSelected = (uri: string) =>
    !!selectedMedia.find((m) => m.url === uri);

  const togglePhoto = (item: LocalPhoto) => {
    const exists = isSelected(item.uri);

    if (exists) {
      setSelectedMedia(selectedMedia.filter((m) => m.url !== item.uri));
    } else {
      if (selectedMedia.length >= 10) return;
      setSelectedMedia([
        ...selectedMedia,
        { id: item.id, url: item.uri },
      ]);
    }
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PhotoPickerItem
            uri={item.uri}
            isSelected={isSelected(item.uri)}
            onToggle={() => togglePhoto(item)}
          />
        )}
      />
      <View style={styles.footer}>
        <Button title="Done" onPress={handleDone} color={colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundMain },
  listContent: {
    padding: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.backgroundMain,
  },
});
