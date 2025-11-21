// src/features/community/components/PostActions.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles';

interface PostActionsProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onPressLike?: () => void;
  onPressComment?: () => void;
  onPressMore?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  likeCount,
  commentCount,
  isLiked,
  onPressLike,
  onPressComment,
  onPressMore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressLike} style={styles.action}>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>♥ {likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment} style={styles.action}>
          <Text style={styles.actionText}>💬 {commentCount}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onPressMore}>
        <Text style={styles.moreText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  action: {
    marginRight: spacing.md,
  },
  actionText: {
    ...typography.caption,
    color: colors.textGrey1,
  },
  likedText: {
    color: colors.primary,
  },
  moreText: {
    ...typography.bodySmall,
    color: colors.textGrey1,
  },
});
