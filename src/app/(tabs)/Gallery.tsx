// src/app/(tabs)/Gallery.tsx

import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CreateAlbumModal from '../components/GalleryComponents/CreateAlbumModal';
import AlbumCreatedModal from '../components/GalleryComponents/AlbumCreated';
import * as galleryStorage from '../../core/services/galleryStorageService';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [createdAlbumName, setCreatedAlbumName] = useState('');
  const [albums, setAlbums] = useState<galleryStorage.Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load albums when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, [])
  );

  const loadAlbums = async () => {
    try {
      setIsLoading(true);
      const loadedAlbums = await galleryStorage.getAlbums();
      setAlbums(loadedAlbums);
    } catch (error) {
      console.error('Error loading albums:', error);
      Alert.alert('Error', 'Failed to load albums');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlbums();
    setRefreshing(false);
  };

  const handleCreateAlbum = () => {
    setIsCreateModalVisible(true);
  };

  const handleSaveAlbum = async (albumName: string) => {
    try {
      const newAlbum = await galleryStorage.createAlbum(albumName);
      console.log('Album created:', newAlbum);
      
      setCreatedAlbumName(albumName);
      setIsCreateModalVisible(false);
      
      // Reload albums
      await loadAlbums();
      
      // Show success modal
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Error creating album:', error);
      Alert.alert('Error', 'Failed to create album. Please try again.');
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const handleAddPhotos = () => {
    setIsSuccessModalVisible(false);
    
    // Find the created album
    const album = albums.find(a => a.name === createdAlbumName);
    if (album) {
      router.push({
        pathname: '../Gallery/AlbumDetail',
        params: { albumId: album.id, albumName: album.name }
      });
    }
  };

  const handleCancelSuccess = () => {
    setIsSuccessModalVisible(false);
  };

  const handleViewAlbum = (album: galleryStorage.Album) => {
    router.push({
      pathname: '../Gallery/AlbumDetail',
      params: { albumId: album.id, albumName: album.name }
    });
  };

  // Filter albums based on search query
  const filteredAlbums = albums.filter((album) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const albumName = album.name.toLowerCase();
    
    return albumName.includes(query);
  });

  const hasAlbums = albums.length > 0;
  const hasFilteredResults = filteredAlbums.length > 0;

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gallery</Text>
            <Text style={styles.headerSubtitle}>
              Every moment matters, even the quiet ones
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <CustomInput
              placeholder="Search albums"
              value={searchQuery}
              onChangeText={setSearchQuery}
              iconName="search-outline"
            />
          </View>

          {/* Loading State */}
          {isLoading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptySubtitle}>Loading albums...</Text>
            </View>
          ) : !hasAlbums ? (
            /* Empty State - No Albums */
            <View style={styles.emptyContainer}>
              <Image 
                source={require('../../assets/images/gallery.png')} 
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No Album yet</Text>
              <Text style={styles.emptySubtitle}>
                You currently have no album created.
              </Text>
            </View>
          ) : !hasFilteredResults ? (
            /* No Search Results */
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color={colors.textGrey2} />
              <Text style={styles.emptyTitle}>No albums found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          ) : (
            /* Albums Grid */
            <View style={styles.albumsGrid}>
              {filteredAlbums.map((album) => (
                <TouchableOpacity
                  key={album.id}
                  style={styles.albumCard}
                  onPress={() => handleViewAlbum(album)}
                  activeOpacity={0.7}
                >
                  <View style={styles.albumCover}>
                    {album.coverPhotoUri ? (
                      <Image 
                        source={{ uri: album.coverPhotoUri }} 
                        style={styles.albumCoverImage}
                      />
                    ) : (
                      <Ionicons name="images" size={40} color={colors.textGrey1} />
                    )}
                  </View>
                  <Text style={styles.albumName} numberOfLines={1}>
                    {album.name}
                  </Text>
                  <Text style={styles.albumCount}>
                    {album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateAlbum}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.textWhite} />
        </TouchableOpacity>

        {/* Create Album Modal */}
        <CreateAlbumModal
          visible={isCreateModalVisible}
          onClose={handleCloseCreateModal}
          onSave={handleSaveAlbum}
        />

        {/* Album Created Success Modal */}
        <AlbumCreatedModal
          visible={isSuccessModalVisible}
          albumName={createdAlbumName}
          onAddPhotos={handleAddPhotos}
          onCancel={handleCancelSuccess}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: vs(100),
  },
  header: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(60),
    paddingBottom: vs(spacing.sm),
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(4),
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    fontSize: rfs(14),
  },
  searchWrapper: {
    paddingHorizontal: ms(spacing.lg),
    marginTop: vs(1),
    marginBottom: vs(spacing.md),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(spacing.xl),
    minHeight: vs(400),
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
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ms(spacing.lg),
    gap: ms(spacing.md),
  },
  albumCard: {
    width: (width - ms(spacing.lg * 2) - ms(spacing.md)) / 2,
  },
  albumCover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: vs(spacing.xs),
  },
  albumCoverImage: {
    width: '100%',
    height: '100%',
  },
  albumName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontSize: rfs(14),
  },
  albumCount: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    fontSize: rfs(12),
    marginTop: vs(2),
  },
  addButton: {
    position: 'absolute',
    bottom: vs(80),
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