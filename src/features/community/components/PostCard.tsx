// src/features/community/components/PostCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { CommunityPost } from '../types/Post.types';
import { PostHeader } from './PostHeader';
import { PostImageGrid } from './PostImageGrid';
import { PostActions } from './PostActions';
import { colors, spacing, typography } from '@/styles';

interface PostCardProps {
  post: CommunityPost;
  onPress?: () => void;
  onPressComment?: () => void;
  onPressMore?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onPressComment,
  onPressMore,
}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <PostHeader author={post.author} createdAt={post.createdAt} />
      <Text style={styles.caption}>{post.caption}</Text>
      <PostImageGrid media={post.media} />
      <PostActions
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        isLiked={post.isLikedByCurrentUser}
        onPressComment={onPressComment}
        onPressMore={onPressMore}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundMain,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  caption: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
});
