// src/features/community/components/CreatePostInput.tsx

import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/styles';
import { COMMUNITY_CONSTANTS } from '../constants/communityConstants';

interface CreatePostInputProps {
  caption: string;
  onChangeCaption: (value: string) => void;
  onPressAddPhotos: () => void;
}

export const CreatePostInput: React.FC<CreatePostInputProps> = ({
  caption,
  onChangeCaption,
  onPressAddPhotos,
}) => {
  const remaining = COMMUNITY_CONSTANTS.CAPTION_MAX_LENGTH - caption.length;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Share your thoughts..."
        placeholderTextColor={colors.textGrey2}
        multiline
        value={caption}
        onChangeText={onChangeCaption}
        maxLength={COMMUNITY_CONSTANTS.CAPTION_MAX_LENGTH}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={onPressAddPhotos} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Add Photos</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{remaining}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.backgroundSoft,
  },
  input: {
    minHeight: 80,
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  photoButtonText: {
    ...typography.labelSmall,
    color: colors.textWhite,
  },
  counter: {
    ...typography.caption,
    color: colors.textGrey1,
  },
});
