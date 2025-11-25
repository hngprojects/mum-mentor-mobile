import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '@/src/core/styles';
import { s, vs } from '@/src/core/styles/scaling';

interface MessageActionsProps {
  onLike: () => void;
  onDislike: () => void;
  onRefresh: () => void;
  onCopy: () => void;
}

export const MessageActions = ({
  onLike,
  onDislike,
  onRefresh,
  onCopy,
}: MessageActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={onCopy} activeOpacity={0.7}>
        <Image
          source={require('../../assets/images/ai-chat/copy.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onLike} activeOpacity={0.7}>
        <Image
          source={require('../../assets/images/ai-chat/like.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onDislike} activeOpacity={0.7}>
        <Image
          source={require('../../assets/images/ai-chat/dislike.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onRefresh} activeOpacity={0.7}>
        <Image
          source={require('../../assets/images/ai-chat/maximize-circle.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    gap: s(12),
  },
  actionButton: {
    padding: s(8),
  },
  icon: {
    width: s(20),
    height: s(20),
    tintColor: colors.textGrey1,
  },
});