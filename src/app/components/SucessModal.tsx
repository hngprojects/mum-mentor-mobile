import { colors, typography } from '../../core/styles/index';
import { ms, rfs, vs } from '../../core/styles/scaling';
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title = 'Setup complete',
  message = 'Your setup is complete. You can now start using Mum Mentor AI.',
  actionLabel = 'Continue',
  onAction,
  onClose,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const handleAction = () => {
    onAction?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.modalContainer, { opacity, transform: [{ scale }] }]}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('@/assets/icons/icon_success.png')}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAction}>
            <Text style={styles.primaryButtonText}>{actionLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(24),
  },
  modalContainer: {
    width: '100%',
    borderRadius: ms(20),
    backgroundColor: colors.backgroundMain,
    paddingHorizontal: ms(20),
    paddingVertical: vs(24),
    alignItems: 'center',
  },
  iconWrapper: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  icon: {
    width: ms(32),
    height: ms(32),
    resizeMode: 'contain',
  },
  title: {
    ...typography.heading3,
    textAlign: 'center',
    marginBottom: vs(8),
    color: colors.textPrimary,
  },
  message: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textGrey1,
    marginBottom: vs(20),
  },
  primaryButton: {
    width: '100%',
    paddingVertical: vs(10),
    borderRadius: ms(999),
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginBottom: vs(8),
  },
  primaryButtonText: {
    fontSize: rfs(14),
    color: colors.textWhite,
    fontFamily: typography.buttonText.fontFamily,
  },
  closeButton: {
    paddingVertical: vs(6),
    paddingHorizontal: ms(12),
  },
  closeButtonText: {
    ...typography.caption,
    color: colors.textGrey1,
  },
});

// Export a hook for easier usage
export const useSuccessModal = () => {
  const [visible, setVisible] = React.useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return {
    visible,
    show,
    hide,
  };
};
