// src/features/community/screens/DeletePostScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDeletePost } from '../hooks/useDeletePost';
import { colors, spacing, typography } from '@/core/styles';

export const DeletePostScreen: React.FC = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const deletePostMutation = useDeletePost();

  const handleDelete = async () => {
    if (!postId) return;
    try {
      await deletePostMutation.mutateAsync({ postId });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Unable to delete post. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Post</Text>
      <Text style={styles.description}>
        Are you sure you want to delete this post? This action cannot be undone.
      </Text>

      <View style={styles.buttons}>
        <Button title="Cancel" onPress={() => router.back()} />
        <Button
          title="Delete"
          onPress={handleDelete}
          color={colors.error}
          disabled={deletePostMutation.isPending}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.backgroundMain,
  },
  title: {
    ...typography.heading3,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
