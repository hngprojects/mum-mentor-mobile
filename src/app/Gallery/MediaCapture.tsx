// src/app/gallery/media-capture.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '../../core/styles/scaling';
import PageHeader from '../components/shared/PageHeader';
import PrimaryButton from '../components/PrimaryButton';

export default function MediaCaptureScreen() {
  const params = useLocalSearchParams();
  const albumId = params.albumId as string;
  const category = params.category as string;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permission
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      console.warn('Camera permission not granted');
    }

    // Request media library permission
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaPermission.status !== 'granted') {
      console.warn('Media library permission not granted');
    }
  };

  // Take photo with camera
  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Upload photo from gallery
  const handleUploadPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
  };

  // Proceed to add memory details
  const handleNext = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first.');
      return;
    }

    // Navigate to add memory form with the image
    router.push({
      pathname: './gallery/ModalForm',
      params: {
        type: 'add-memory',
        albumId,
        category,
        imageUri: selectedImage,
      },
    });
  };

  // Retake/Reselect photo
  const handleRetake = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <PageHeader 
          title={selectedImage ? 'Preview' : 'Add Photo'} 
          showBack 
        />

        {/* Image Preview or Upload Options */}
        {selectedImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Ionicons name="refresh-outline" size={24} color={colors.primary} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContainer}>
            <Text style={styles.subtitle}>
              Take a photo or upload from your gallery
            </Text>

            {/* Take Photo Button */}
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={handleTakePhoto}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="camera-outline" size={48} color={colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Take a photo</Text>
              <Text style={styles.optionDescription}>
                Use your camera to capture a moment
              </Text>
            </TouchableOpacity>

            {/* Upload Photo Button */}
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={handleUploadPhoto}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="images-outline" size={48} color={colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Upload from gallery</Text>
              <Text style={styles.optionDescription}>
                Choose from your existing photos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Button - Only show when image is selected */}
        {selectedImage && (
          <View style={styles.bottomButton}>
            <PrimaryButton
              title="Next"
              onPress={handleNext}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    paddingHorizontal: ms(spacing.xl),
    marginBottom: vs(spacing.xl * 2),
  },
  uploadContainer: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(spacing.xl),
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: colors.backgroundSubtle,
    borderRadius: ms(16),
    padding: ms(spacing.xl),
    marginBottom: vs(spacing.lg),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  optionIconContainer: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(spacing.md),
  },
  optionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(spacing.xs),
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(spacing.md),
  },
  previewImage: {
    width: '100%',
    height: vs(400),
    borderRadius: ms(16),
    resizeMode: 'cover',
    backgroundColor: colors.backgroundSubtle,
  },
  previewActions: {
    alignItems: 'center',
    marginTop: vs(spacing.xl),
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(spacing.xs),
    paddingVertical: vs(spacing.sm),
    paddingHorizontal: ms(spacing.lg),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retakeText: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: ms(spacing.lg),
    paddingBottom: vs(spacing.xl),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});