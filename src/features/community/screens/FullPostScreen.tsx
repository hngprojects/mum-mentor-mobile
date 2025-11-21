import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/core/styles';
import { rfs, ms } from '@/core/styles/scaling';

export const FullPostScreen = ({ post }: any) => {
  const data = post ?? {
    id: '1',
    author: 'Anonymous Mum',
    text: 'This is a full post view. Connect this to your backend later.',
    images: [],
    createdAt: 'Just now',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.author}>{data.author}</Text>
      <Text style={styles.text}>{data.text}</Text>

      {data.images?.map((img: string, i: number) => (
        <Image key={i} source={{ uri: img }} style={styles.image} />
      ))}

      <Text style={styles.timestamp}>{data.createdAt}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.backgroundMain,
  },
  author: {
    ...typography.heading3,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  text: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
    lineHeight: rfs(22),
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: ms(12),
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundSoft,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textGrey1,
    marginTop: spacing.sm,
  },
});
