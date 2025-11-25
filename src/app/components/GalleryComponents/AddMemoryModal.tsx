// src/components/GalleryComponents/AddMemoryModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';
import PrimaryButton from '../PrimaryButton';
import CameraScreen from './CameraScreen';

interface AddMemoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveMemory: (memoryData: MemoryData) => void;
  albumName?: string;
}

export interface MemoryData {
  photoUri: string;
  note: string;
  category: string;
  date: Date;
}

const CATEGORIES = ['Baby Photos', 'Pregnancy', 'Videos', 'Album'];

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  visible,
  onClose,
  onSaveMemory,
  albumName,
}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Baby Photos');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  React.useEffect(() => {
    if (visible) {
      requestPermissions();
    }
  }, [visible]);

  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  const resetForm = () => {
    setPhotoUri(null);
    setNote('');
    setSelectedCategory('Baby Photos');
    setSelectedDate(new Date());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTakePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }
    setIsCameraVisible(true);
  };

  const handleCameraPhotoTaken = (uri: string) => {
    setPhotoUri(uri);
    setIsCameraVisible(false);
  };

  const handleCloseCamera = () => {
    setIsCameraVisible(false);
  };

  const handleUploadFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo.');
    }
  };

  const handleSaveMemory = () => {
    if (!photoUri) return Alert.alert('No Photo', 'Please select or take a photo first.');

    setIsLoading(true);

    const memoryData: MemoryData = {
      photoUri,
      note,
      category: selectedCategory,
      date: selectedDate,
    };

    setTimeout(() => {
      onSaveMemory(memoryData);
      resetForm();
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return `Today, ${date.toLocaleDateString('en-US', options)}`;
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              
              {/* DYNAMIC HEIGHT MODAL */}
              <View
                style={[
                  styles.modalContainer,
                  photoUri ? styles.fullHeight : styles.partialHeight,
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Add A Memory</Text>
                  <View style={{ width: 20 }} />
                </View>

                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {photoUri ? (
                    <View style={styles.photoPreviewContainer}>
                      <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                    </View>
                  ) : (
                    <View style={styles.photoOptionsContainer}>
                      <TouchableOpacity style={styles.photoOption} onPress={handleTakePhoto}>
                        <View style={styles.photoIconContainer}>
                          <Ionicons name="camera-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.photoOptionText}>Take a photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.photoOption} onPress={handleUploadFromGallery}>
                        <View style={styles.photoIconContainer}>
                          <Ionicons name="images-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.photoOptionText}>Upload from gallery</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Note Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Note about this moment</Text>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Add a little note"
                      placeholderTextColor={colors.textGrey2}
                      multiline
                      value={note}
                      onChangeText={setNote}
                    />
                  </View>

                  {/* Save To */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Save To:</Text>
                      <TouchableOpacity>
                        <Text style={styles.createAlbumText}>Create Album</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.categoriesContainer}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryChip,
                            selectedCategory === cat && styles.categoryChipSelected,
                          ]}
                          onPress={() => setSelectedCategory(cat)}
                        >
                          <Text
                            style={[
                              styles.categoryChipText,
                              selectedCategory === cat && styles.categoryChipTextSelected,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Date */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>Saved On:</Text>
                      <TouchableOpacity>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.dateContainer}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textGrey1} />
                      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.saveButtonContainer}>
                  <PrimaryButton
                    title="Save Memory"
                    onPress={handleSaveMemory}
                    isLoading={isLoading}
                    disabled={!photoUri || isLoading}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {isCameraVisible && (
        <CameraScreen
          visible={isCameraVisible}
          onClose={handleCloseCamera}
          onPhotoTaken={handleCameraPhotoTaken}
        />
      )}
    </>
  );
};

export default AddMemoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  /** NEW HEIGHTS **/
  partialHeight: {
    maxHeight: '92%',
  },
  fullHeight: {
    height: '100%',
  },

  modalContainer: {
    backgroundColor: colors.backgroundMain,
    paddingTop: vs(spacing.md),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: vs(spacing.md),
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontSize: rfs(16),
  },

  scrollContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: vs(spacing.lg),
  },

  photoPreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: ms(16),
    overflow: 'hidden',
    marginBottom: vs(spacing.lg),
    borderWidth: 3,
    borderColor: colors.primary,
  },
  photoPreview: { width: '100%', height: '100%' },

  photoOptionsContainer: {
    flexDirection: 'row',
    gap: ms(spacing.md),
    marginBottom: vs(spacing.lg),
  },
  photoOption: { flex: 1, alignItems: 'center' },
  photoIconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: colors.backgroundSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(spacing.xs),
  },

  photoOptionText: { ...typography.bodySmall, textAlign: 'center', fontSize: rfs(12) },

  section: { marginBottom: vs(spacing.md) },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(spacing.xs),
  },
  editText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontSize: rfs(12),
  },

  sectionLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontSize: rfs(13),
  },

  createAlbumText: { ...typography.labelMedium, color: colors.primary, fontSize: rfs(12) },

  noteInput: {
    ...typography.bodySmall,
    backgroundColor: colors.backgroundSubtle,
    minHeight: vs(60),
    padding: ms(spacing.sm),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: colors.outline,
  },

  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(spacing.xs) },

  categoryChip: {
    paddingVertical: vs(spacing.xs),
    paddingHorizontal: ms(spacing.sm),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: colors.outline,
  },
  categoryChipSelected: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.primary,
  },

  categoryChipText: { 
    ...typography.bodySmall, 
    color: colors.textGrey1, 
    fontSize: rfs(12) 
  },
  categoryChipTextSelected: { 
    color: colors.textPrimary, 
    fontWeight: '600' 
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSubtle,
    padding: ms(spacing.sm),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: colors.outline,
    gap: ms(spacing.xs),
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
    fontSize: rfs(12),
  },

  saveButtonContainer: {
    padding: ms(spacing.lg),
    paddingBottom: vs(spacing.xl),
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
});
