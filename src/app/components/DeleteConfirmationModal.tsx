// src/components/DeleteConfirmModal.tsx

import { colors, typography } from '@/src/core/styles';
import { ms, vs, rbr } from '@/src/core/styles/scaling';
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
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface DeleteConfirmModalProps {
  visible: boolean;
  onDelete: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const trash = require('@/src/assets/images/trash.png');

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onDelete,
  onCancel,
  title = 'Delete Account',
  message = 'Are you sure you want to delete your account permanently?.',
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible, scaleValue]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Delete Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.deleteIconWrapper}>
              <Image source={trash}/>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Delete Button */}
          <PrimaryButton
            title="Delete"
            onPress={onDelete}
            style={styles.deleteButton}
          />

          {/* Cancel Button */}
          <SecondaryButton
            title="Cancel"
            onPress={onCancel}
            style={styles.cancelButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(24),
  },
  modalContainer: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    paddingVertical: vs(32),
    paddingHorizontal: ms(24),
    width: '100%',
    maxWidth: ms(400),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: vs(20),
  },
  deleteIconWrapper: {
    width: ms(64),
    height: ms(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: vs(12),
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: 22,
  },
  deleteButton: {
    width: '100%',
    marginBottom: vs(12),
  },
  cancelButton: {
    width: '100%',
  },
});