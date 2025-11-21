import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';

// --- IMPORTS FROM CORE UTILITIES ---
// Path adjusted to reach core/styles from app/components/ui/
import { colors, typography, spacing } from '../../core/styles/index'; 
import { ms, rfs } from '../../core/styles/scaling';

// --- TYPES ---
interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  // Optional style prop to allow overriding the button's container style
  style?: TouchableOpacityProps['style'];
}

// --- COMPONENT ---
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  ...props
}) => {
  
  // The button should be disabled if explicitly set or if it is currently loading
  const isDisabled = disabled || isLoading;

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      backgroundColor: colors.backgroundMain,
      paddingVertical: ms(spacing.md),
      borderRadius: ms(spacing.sm), // Slightly rounded corners for a soft look
      alignItems: 'center',
      justifyContent: 'center',
      // Dynamic styles for disabled state
      opacity: isDisabled ? 0.6 : 1, 
      minHeight: ms(50), // Ensure button size consistency
      borderColor: colors.primary,
      borderWidth: 1,
    },
    text: {
      color: colors.primary, // White Text
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
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default SecondaryButton;