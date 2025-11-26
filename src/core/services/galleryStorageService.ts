// src/core/services/galleryStorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  ALBUMS: '@gallery_albums',
  PHOTOS: '@gallery_photos',
};

// TypeScript Interfaces
export interface Photo {
  id: string;
  uri: string;
  albumId: string;
  note: string;
  category: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Album {
  id: string;
  name: string;
  coverPhotoUri?: string;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== ALBUMS ====================

/**
 * Get all albums
 */
export const getAlbums = async (): Promise<Album[]> => {
  try {
    const albumsJson = await AsyncStorage.getItem(STORAGE_KEYS.ALBUMS);
    if (!albumsJson) return [];
    
    const albums: Album[] = JSON.parse(albumsJson);
    return albums;
  } catch (error) {
    console.error('Error getting albums:', error);
    return [];
  }
};

/**
 * Get a single album by ID
 */
export const getAlbumById = async (albumId: string): Promise<Album | null> => {
  try {
    const albums = await getAlbums();
    return albums.find(album => album.id === albumId) || null;
  } catch (error) {
    console.error('Error getting album by ID:', error);
    return null;
  }
};

/**
 * Create a new album
 */
export const createAlbum = async (albumName: string): Promise<Album> => {
  try {
    const albums = await getAlbums();
    
    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      name: albumName,
      photoCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    albums.push(newAlbum);
    await AsyncStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
    
    return newAlbum;
  } catch (error) {
    console.error('Error creating album:', error);
    throw error;
  }
};

/**
 * Update album (e.g., cover photo, name)
 */
export const updateAlbum = async (
  albumId: string,
  updates: Partial<Omit<Album, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const albums = await getAlbums();
    const albumIndex = albums.findIndex(album => album.id === albumId);
    
    if (albumIndex === -1) {
      throw new Error('Album not found');
    }
    
    albums[albumIndex] = {
      ...albums[albumIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
  } catch (error) {
    console.error('Error updating album:', error);
    throw error;
  }
};

/**
 * Delete an album
 */
export const deleteAlbum = async (albumId: string): Promise<void> => {
  try {
    // Delete all photos in the album first
    const photos = await getPhotos();
    const remainingPhotos = photos.filter(photo => photo.albumId !== albumId);
    await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(remainingPhotos));
    
    // Delete the album
    const albums = await getAlbums();
    const filteredAlbums = albums.filter(album => album.id !== albumId);
    await AsyncStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(filteredAlbums));
  } catch (error) {
    console.error('Error deleting album:', error);
    throw error;
  }
};

// ==================== PHOTOS ====================

/**
 * Get all photos
 */
export const getPhotos = async (): Promise<Photo[]> => {
  try {
    const photosJson = await AsyncStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (!photosJson) return [];
    
    const photos: Photo[] = JSON.parse(photosJson);
    return photos;
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
};

/**
 * Get photos for a specific album
 */
export const getAlbumPhotos = async (albumId: string): Promise<Photo[]> => {
  try {
    const photos = await getPhotos();
    return photos.filter(photo => photo.albumId === albumId);
  } catch (error) {
    console.error('Error getting album photos:', error);
    return [];
  }
};

/**
 * Get a single photo by ID
 */
export const getPhotoById = async (photoId: string): Promise<Photo | null> => {
  try {
    const photos = await getPhotos();
    return photos.find(photo => photo.id === photoId) || null;
  } catch (error) {
    console.error('Error getting photo by ID:', error);
    return null;
  }
};

/**
 * Add a photo to an album
 */
export const addPhotoToAlbum = async (
  albumId: string,
  photoData: {
    uri: string;
    note: string;
    category: string;
    date: Date;
  }
): Promise<Photo> => {
  try {
    const photos = await getPhotos();
    
    const newPhoto: Photo = {
      id: `photo_${Date.now()}`,
      albumId,
      uri: photoData.uri,
      note: photoData.note,
      category: photoData.category,
      date: photoData.date.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    photos.push(newPhoto);
    await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    
    // Update album photo count and cover photo
    await updateAlbumPhotoCount(albumId);
    
    return newPhoto;
  } catch (error) {
    console.error('Error adding photo to album:', error);
    throw error;
  }
};

/**
 * Delete a photo
 */
export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    const photos = await getPhotos();
    const photo = photos.find(p => p.id === photoId);
    
    if (!photo) {
      throw new Error('Photo not found');
    }
    
    const filteredPhotos = photos.filter(p => p.id !== photoId);
    await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(filteredPhotos));
    
    // Update album photo count
    await updateAlbumPhotoCount(photo.albumId);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

/**
 * Update photo details
 */
export const updatePhoto = async (
  photoId: string,
  updates: Partial<Omit<Photo, 'id' | 'albumId' | 'createdAt'>>
): Promise<void> => {
  try {
    const photos = await getPhotos();
    const photoIndex = photos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex === -1) {
      throw new Error('Photo not found');
    }
    
    photos[photoIndex] = {
      ...photos[photoIndex],
      ...updates,
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (error) {
    console.error('Error updating photo:', error);
    throw error;
  }
};

// ==================== HELPERS ====================

/**
 * Update album photo count and cover photo
 */
const updateAlbumPhotoCount = async (albumId: string): Promise<void> => {
  try {
    const albumPhotos = await getAlbumPhotos(albumId);
    const photoCount = albumPhotos.length;
    
    // Get the most recent photo as cover
    const coverPhotoUri = albumPhotos.length > 0 
      ? albumPhotos[albumPhotos.length - 1].uri 
      : undefined;
    
    await updateAlbum(albumId, {
      photoCount,
      coverPhotoUri,
    });
  } catch (error) {
    console.error('Error updating album photo count:', error);
  }
};

/**
 * Clear all gallery data (for testing/logout)
 */
export const clearAllGalleryData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ALBUMS,
      STORAGE_KEYS.PHOTOS,
    ]);
  } catch (error) {
    console.error('Error clearing gallery data:', error);
    throw error;
  }
};