// src/app/components/ui/PrimaryButton.tsx

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

// --- IMPORTS FROM CORE UTILITIES ---
// Path adjusted to reach core/styles from app/components/ui/
import { colors, spacing, typography } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

// --- TYPES ---
interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  // Optional style prop to allow overriding the button's container style
  style?: TouchableOpacityProps['style'];
  textStyle?: TextStyle;
}

// --- COMPONENT ---
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  
  // The button should be disabled if explicitly set or if it is currently loading
  const isDisabled = disabled || isLoading;

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      backgroundColor: colors.primary, // NORA Red
      paddingVertical: ms(spacing.md),
      borderRadius: ms(spacing.sm), // Slightly rounded corners for a soft look
      alignItems: 'center',
      justifyContent: 'center',
      // Dynamic styles for disabled state
      opacity: isDisabled ? 0.6 : 1, 
      minHeight: ms(50), // Ensure button size consistency
    },
    text: {
      color: colors.textWhite, // White Text
      fontSize: rfs(typography.buttonText.fontSize),
      fontFamily: typography.buttonText.fontFamily,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.textWhite} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;