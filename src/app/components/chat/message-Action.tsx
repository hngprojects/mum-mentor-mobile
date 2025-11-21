// src/app/components/chat/MessageActions.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

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
  onCopy 
}: MessageActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>👍</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onDislike}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>👎</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onRefresh}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>🔄</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onCopy}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>📋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  actionIcon: {
    fontSize: 16,
  },
});