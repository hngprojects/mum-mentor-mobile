// src/components/shared/PageHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs } from '@/src/core/styles/scaling';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showClose?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBack = false,
  showClose = false,
  onBackPress,
  rightIcon,
  onRightPress,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={handleBackPress}
        style={styles.iconButton}
      >
        {(showBack || showClose) && (
          <Ionicons 
            name={showClose ? "close" : "arrow-back"} 
            size={28} 
            color={colors.textPrimary} 
          />
        )}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Ionicons name={rightIcon} size={28} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(60),
    paddingBottom: vs(spacing.md),
    backgroundColor: colors.backgroundMain,
  },
  iconButton: {
    width: ms(28),
    height: ms(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
});