// src/features/community/components/PostHeader.tsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { CommunityUser } from '../types/Post.types';
import { colors, typography, spacing } from '@/styles';
import { formatPostDate } from '../utils/formatPostDate';

interface PostHeaderProps {
  author: CommunityUser;
  createdAt: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ author, createdAt }) => {
  return (
    <View style={styles.container}>
      {author.avatarUrl ? (
        <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>{author.name?.[0]}</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{author.name}</Text>
        <Text style={styles.time}>{formatPostDate(createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  avatarPlaceholder: {
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  textContainer: {
    marginLeft: spacing.sm,
  },
  name: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  time: {
    ...typography.caption,
    color: colors.textGrey1,
  },
});
