// src/app/photo-detail.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';
import { Ionicons } from '@expo/vector-icons';
import * as galleryStorage from '@/src/core/services/galleryStorageService';

export default function PhotoDetailScreen() {
  const params = useLocalSearchParams();
  const photoId = params.photoId as string;
  const [photo, setPhoto] = useState<galleryStorage.Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhoto();
  }, [photoId]);

  const loadPhoto = async () => {
    try {
      setIsLoading(true);
      const loadedPhoto = await galleryStorage.getPhotoById(photoId);
      setPhoto(loadedPhoto);
    } catch (error) {
      console.error('Error loading photo:', error);
      Alert.alert('Error', 'Failed to load photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (photo) {
                await galleryStorage.deletePhoto(photo.id);
                Alert.alert('Success', 'Photo deleted successfully');
                router.back();
              }
            } catch (error) {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { date: formattedDate, time: time.toLowerCase() };
  };

  const calculateAge = (photoDate: string) => {
    // This is a simple calculation - you might want to get baby's birthdate from user profile
    const date = new Date(photoDate);
    const now = new Date();
    const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    return `${months} months old`;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Photo not found</Text>
      </View>
    );
  }

  const { date: formattedDate, time } = formatDate(photo.date);
  const age = calculateAge(photo.date);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerDate}>{formattedDate}</Text>
            <Text style={styles.headerTime}>{time}</Text>
          </View>

          <TouchableOpacity
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo */}
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Name and Age */}
            <View style={styles.nameContainer}>
              <Text style={styles.babyName}>Maya</Text>
              <View style={styles.dotSeparator} />
              <Text style={styles.ageText}>{age}</Text>
            </View>

            {/* Note */}
            {photo.note ? (
              <View style={styles.noteContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={colors.textGrey1}
                  style={styles.noteIcon}
                />
                <Text style={styles.noteText}>{photo.note}</Text>
              </View>
            ) : null}

            {/* Category */}
            <View style={styles.categoryContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{photo.category}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(60),
    paddingBottom: vs(spacing.md),
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerDate: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontSize: rfs(16),
  },
  headerTime: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    fontSize: rfs(12),
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    marginTop: vs(100),
  },
  scrollContent: {
    paddingBottom: vs(spacing.xl),
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 0.75,
    paddingHorizontal: ms(spacing.lg),
    marginBottom: vs(spacing.lg),
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: ms(16),
  },
  detailsSection: {
    paddingHorizontal: ms(spacing.lg),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(spacing.md),
  },
  babyName: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontSize: rfs(18),
  },
  dotSeparator: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: colors.primary,
    marginHorizontal: ms(spacing.sm),
  },
  ageText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    fontSize: rfs(14),
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(spacing.md),
    borderRadius: ms(12),
    marginBottom: vs(spacing.md),
  },
  noteIcon: {
    marginRight: ms(spacing.sm),
    marginTop: vs(2),
  },
  noteText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    fontSize: rfs(14),
  },
  categoryContainer: {
    marginBottom: vs(spacing.md),
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight,
    paddingVertical: vs(spacing.xs),
    paddingHorizontal: ms(spacing.md),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontSize: rfs(13),
  },
});