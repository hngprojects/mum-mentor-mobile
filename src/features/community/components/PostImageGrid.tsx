// src/features/community/components/PostImageGrid.tsx

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { CommunityMedia } from '../types/Post.types';
import { spacing } from '@/styles';

interface PostImageGridProps {
  media: CommunityMedia[];
  onPressImage?: (index: number) => void;
}

export const PostImageGrid: React.FC<PostImageGridProps> = ({ media, onPressImage }) => {
  if (!media?.length) return null;

  if (media.length === 1) {
    return (
      <TouchableOpacity onPress={() => onPressImage?.(0)} activeOpacity={0.9}>
        <Image source={{ uri: media[0].url }} style={styles.singleImage} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.grid}>
      {media.slice(0, 4).map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={styles.gridItem}
          activeOpacity={0.9}
          onPress={() => onPressImage?.(index)}
        >
          <Image source={{ uri: item.url }} style={styles.image} />
          {index === 3 && media.length > 4 && (
            <View style={styles.overlay}>
              <View>
                {/* You can show +X more, etc. */}
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  singleImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
