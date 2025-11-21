// src/features/community/screens/CreatePostScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { CreatePostInput } from '../components/CreatePostInput';
import { PostImageGrid } from '../components/PostImageGrid';
import { UploadProgressBar } from '../components/UploadProgressBar';
import { useCreatePostStore } from '../stores/createPostStore';
import { useCreatePost } from '../hooks/useCreatePost';
import { useUploadMedia } from '../hooks/useUploadMedia';
import { COMMUNITY_CONSTANTS } from '../constants/communityConstants';
import { colors, spacing } from '@/core/styles';
import { useRouter } from 'expo-router';

export const CreatePostScreen: React.FC = () => {
  const router = useRouter();
  const { caption, selectedMedia, setCaption, addMedia, reset } = useCreatePostStore();
  const [uploadProgress] = useState(0);
  const createPostMutation = useCreatePost();
  const uploadMediaMutation = useUploadMedia();

  const handleAddPhotos = async () => {
    Alert.alert('Image Picker', 'Integrate Expo ImagePicker here.');
  };

  const handleSubmit = async () => {
    if (!caption.trim() && selectedMedia.length === 0) {
      Alert.alert('Validation', 'Please add a caption or photos.');
      return;
    }

    try {
      let mediaIds: string[] = selectedMedia.map((m) => m.id);

      await createPostMutation.mutateAsync({
        caption: caption.trim(),
        mediaIds,
      });

      reset();
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Unable to create post. Please try again.');
    }
  };

  const canPost = caption.trim().length > 0 || selectedMedia.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <CreatePostInput
          caption={caption}
          onChangeCaption={setCaption}
          onPressAddPhotos={handleAddPhotos}
        />

        <View style={styles.mediaContainer}>
          <PostImageGrid media={selectedMedia} />
        </View>

        <UploadProgressBar progress={uploadProgress} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Post"
          onPress={handleSubmit}
          disabled={!canPost || createPostMutation.isPending}
          color={colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSoft },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  mediaContainer: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.backgroundMain,
  },
});
