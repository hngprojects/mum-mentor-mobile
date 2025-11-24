import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, spacing, typography } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

export interface UploadedPhoto {
  id: string;
  uri: string;
  name: string;
}

interface PhotoUploaderProps {
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onPhotosChange,
}) => {
  const [imageName, setImageName] = useState('');

  const pickImage = async () => {
    // Add the default image when user clicks add button (replace existing)
    const newPhoto: UploadedPhoto = {
      id: Date.now().toString(),
      uri: 'placeholder', // marker to identify this as placeholder image
      name: 'journalUploadedImage.jpg',
    };
    onPhotosChange([newPhoto]); // Replace with new photo instead of appending
    setImageName('Img 35422...');
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    if (updatedPhotos.length === 0) {
      setImageName('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos (Optional)</Text>

      {/* Image Name Input with Add Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Img 35422..."
          placeholderTextColor={colors.textGrey1}
          value={imageName}
          onChangeText={setImageName}
          editable={false}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={pickImage}
        >
          <Ionicons name="add" size={ms(20)} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Selected Photo - Single Image */}
      {photos.length > 0 && (
        <View style={styles.photoContainer}>
          <View style={styles.photoWrapper}>
            <Image source={require('../../assets/images/journalUploadedimage.jpg')} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(photos[0].id)}
            >
              <Ionicons name="close" size={rfs(16)} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(spacing.lg),
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(spacing.sm),
    marginBottom: ms(spacing.md),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(spacing.sm),
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  addButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(spacing.sm),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(spacing.sm),
    marginTop: ms(spacing.md),
  },
  photoContainer: {
    marginTop: ms(spacing.md),
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(8),
    backgroundColor: colors.backgroundSubtle,
  },
  removeButton: {
    position: 'absolute',
    top: ms(-8),
    right: ms(-8),
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoUploader;
