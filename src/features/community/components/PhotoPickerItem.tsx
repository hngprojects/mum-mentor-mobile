// src/features/community/components/PhotoPickerItem.tsx

import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/styles';

interface PhotoPickerItemProps {
  uri: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const PhotoPickerItem: React.FC<PhotoPickerItemProps> = ({
  uri,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.8}>
      <Image source={{ uri }} style={styles.image} />
      {isSelected && <View style={styles.overlay} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
