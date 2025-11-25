// src/app/album-detail.tsx

import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import AddMemoryModal, { MemoryData } from '../components/GalleryComponents/AddMemoryModal';
import * as galleryStorage from '@/src/core/services/galleryStorageService';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - ms(spacing.lg * 2) - ms(spacing.md)) / 2;

export default function AlbumDetailScreen() {
  const params = useLocalSearchParams();
  const albumId = params.albumId as string;
  const albumName = params.albumName as string || 'Album';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddMemoryModalVisible, setIsAddMemoryModalVisible] = useState(false);
  const [photos, setPhotos] = useState<galleryStorage.Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load photos when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (albumId) {
        loadPhotos();
      }
    }, [albumId])
  );

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const albumPhotos = await galleryStorage.getAlbumPhotos(albumId);
      setPhotos(albumPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddPhoto = () => {
    setIsAddMemoryModalVisible(true);
  };

  const handleMenu = () => {
    Alert.alert(
      'Album Options',
      'What would you like to do?',
      [
        { text: 'Edit Album Name', onPress: () => console.log('Edit album') },
        { text: 'Delete Album', onPress: () => handleDeleteAlbum(), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteAlbum = () => {
    Alert.alert(
      'Delete Album',
      `Are you sure you want to delete "${albumName}"? This will delete all photos in this album.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await galleryStorage.deleteAlbum(albumId);
              Alert.alert('Success', 'Album deleted successfully');
              router.back();
            } catch (error) {
              console.error('Error deleting album:', error);
              Alert.alert('Error', 'Failed to delete album');
            }
          },
        },
      ]
    );
  };

  const handleSaveMemory = async (memoryData: MemoryData) => {
    try {
      console.log('Saving memory:', memoryData);
      
      // Save photo to album
      const newPhoto = await galleryStorage.addPhotoToAlbum(albumId, {
        uri: memoryData.photoUri,
        note: memoryData.note,
        category: memoryData.category,
        date: memoryData.date,
      });
      
      console.log('Photo saved:', newPhoto);
      
      Alert.alert('Success', 'Your memory has been saved successfully!');
      
      // Close modal
      setIsAddMemoryModalVisible(false);
      
      // Reload photos
      await loadPhotos();
    } catch (error) {
      console.error('Error saving memory:', error);
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    }
  };

  const handleCloseAddMemoryModal = () => {
    setIsAddMemoryModalVisible(false);
  };

  const handlePhotoPress = (photo: galleryStorage.Photo) => {
    router.push({
      pathname: '../Gallery/PhotoDetail',
      params: { photoId: photo.id }
    });
  };

  // Filter photos based on search query
  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const note = photo.note.toLowerCase();
    const category = photo.category.toLowerCase();
    const date = new Date(photo.date).toLocaleDateString('en-US').toLowerCase();
    
    return note.includes(query) || category.includes(query) || date.includes(query);
  });

  const renderPhotoItem = ({ item }: { item: galleryStorage.Photo }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => handlePhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
    </TouchableOpacity>
  );

  const hasPhotos = photos.length > 0;
  const hasFilteredResults = filteredPhotos.length > 0;

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left Group: Back button + Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={handleBack} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              {albumName}
            </Text>
          </View>
          
          {/* Right: Menu button */}
          <TouchableOpacity 
            onPress={handleMenu} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <CustomInput
            placeholder="Search photos by note, category, or date"
            value={searchQuery}
            onChangeText={setSearchQuery}
            iconName="search-outline"
          />
        </View>

        {/* Photo Count */}
        {hasPhotos && (
          <View style={styles.photoCountContainer}>
            <Text style={styles.photoCount}>
              {filteredPhotos.length} of {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && !refreshing ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptySubtitle}>Loading photos...</Text>
          </View>
        ) : !hasPhotos ? (
          /* Empty State - No Photos */
          <View style={styles.emptyContainer}>
            <Image 
              source={require('../../assets/images/gallery.png')} 
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Photos yet</Text>
            <Text style={styles.emptySubtitle}>
              You currently have no photos added.
            </Text>
          </View>
        ) : (
          /* Photo Grid */
          <FlatList
            data={filteredPhotos}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.photoGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searchQuery.trim() ? (
                <View style={styles.emptySearchContainer}>
                  <Ionicons name="search-outline" size={60} color={colors.textGrey2} />
                  <Text style={styles.emptyTitle}>No photos found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try searching with different keywords
                  </Text>
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
          />
        )}

        {/* Floating Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.textWhite} />
        </TouchableOpacity>

        {/* Add Memory Modal */}
        <AddMemoryModal
          visible={isAddMemoryModalVisible}
          onClose={handleCloseAddMemoryModal}
          onSaveMemory={handleSaveMemory}
          albumName={albumName}
        />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: ms(spacing.md),
  },
  backButton: {
    marginRight: ms(spacing.sm),
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: ms(spacing.lg),
    marginBottom: vs(spacing.sm),
  },
  photoCountContainer: {
    paddingHorizontal: ms(spacing.lg),
    marginBottom: vs(spacing.sm),
  },
  photoCount: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    fontSize: rfs(13),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.xl),
  },
  emptyImage: {
    width: ms(80),
    height: ms(80),
    marginBottom: vs(spacing.md),
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(spacing.xs),
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    fontSize: rfs(14),
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.xl),
    paddingTop: vs(100),
    minHeight: vs(300),
  },
  photoGrid: {
    paddingHorizontal: ms(spacing.md),
    paddingBottom: vs(120),
    paddingTop: vs(spacing.xs),
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    margin: ms(spacing.sm / 2),
    borderRadius: ms(12),
    overflow: 'hidden',
    backgroundColor: colors.backgroundSubtle,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: vs(100),
    right: ms(spacing.lg),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(8),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});