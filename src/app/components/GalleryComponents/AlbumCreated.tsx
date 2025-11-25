// src/components/GalleryComponents/AlbumCreatedModal.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

interface AlbumCreatedModalProps {
  visible: boolean;
  onAddPhotos: () => void;
  onCancel: () => void;
  albumName: string;
}

const AlbumCreatedModal: React.FC<AlbumCreatedModalProps> = ({
  visible,
  onAddPhotos,
  onCancel,
  albumName,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Icon */}
              <Image 
                source={require('../../../assets/images/gallery.png')} 
                style={styles.icon}
                resizeMode="contain"
              />

              {/* Title */}
              <Text style={styles.title}>Album Created</Text>
              
              {/* Subtitle */}
              <Text style={styles.subtitle}>
                Your memories are safe here
              </Text>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <PrimaryButton
                  title="Add Photos"
                  onPress={onAddPhotos}
                />
                <SecondaryButton
                  title="Cancel"
                  onPress={onCancel}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlbumCreatedModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.xl),
  },
  modalContainer: {
    backgroundColor: colors.backgroundMain,
    borderRadius: ms(16),
    paddingHorizontal: ms(spacing.xl),
    paddingTop: vs(spacing.xl * 2),
    paddingBottom: vs(spacing.xl),
    width: '100%',
    maxWidth: ms(320),
    alignItems: 'center',
  },
  icon: {
    width: ms(30),
    height: ms(30),
    marginBottom: vs(spacing.lg),
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(spacing.xs),
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    marginBottom: vs(spacing.xl),
    fontSize: rfs(14),
  },
  buttonsContainer: {
    width: '100%',
    gap: vs(spacing.sm),
  },
});