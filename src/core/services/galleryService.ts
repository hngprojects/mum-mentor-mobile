// src/core/services/galleryService.ts

import apiClient from "./apiClient";

const ALBUMS_ENDPOINT = "/api/v1/album";
const ALBUMS_ENDPOINT_LIST = "/api/v1/albums";
const MEMORIES_ENDPOINT = "/api/v1/memories";

// ========== ALBUM ENDPOINTS ==========

export interface Album {
  id: string;
  name: string;
  album_id?: string;
  cover_photo_uri?: string;
  photo_count: number;
  created_at: string;
  updated_at: string;
  last_image?: string;
}

export interface Memory {
  id: string;
  album_id: string;
  photo_uri: string;
  caption?: string;
  created_at: string;
}

/**
 * Fetch all albums
 */
export async function fetchAlbums(): Promise<Album[]> {
  try {
    const response = await apiClient.get(ALBUMS_ENDPOINT_LIST);

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error("Failed to fetch albums");
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw error;
  }
}

/**
 * Get a single album with its details
 */
export async function fetchAlbumById(albumId: string): Promise<Album> {
  try {
    const response = await apiClient.get(`${ALBUMS_ENDPOINT_LIST}/${albumId}`);

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error("Failed to fetch album");
    }
  } catch (error) {
    console.error("Error fetching album:", error);
    throw error;
  }
}

/**
 * Create a new album
 */
export async function createAlbum(albumName: string): Promise<Album> {
  try {
    const response = await apiClient.post(ALBUMS_ENDPOINT, {
      name: albumName,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data?.message || "Failed to create album");
    }
  } catch (error) {
    console.error("Error creating album:", error);
    throw error;
  }
}

/**
 * Delete an album
 */
export async function deleteAlbum(albumId: string): Promise<void> {
  try {
    const response = await apiClient.delete(`${ALBUMS_ENDPOINT}/${albumId}`);

    if (response.status >= 200 && response.status < 300) {
      return;
    } else {
      throw new Error("Failed to delete album");
    }
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
}

// ========== MEMORY ENDPOINTS ==========

/**
 * Get all memories in an album
 */
export async function fetchAlbumMemories(albumId: string): Promise<Memory[]> {
  try {
    const response = await apiClient.get(
      `${ALBUMS_ENDPOINT_LIST}/${albumId}/memories`
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error("Failed to fetch memories");
    }
  } catch (error) {
    console.error("Error fetching memories:", error);
    throw error;
  }
}

/**
 * Create a new memory (photo) in an album
 */
export async function createMemory(data: {
  album_id: string;
  photo_uri: string;
  caption?: string;
}): Promise<Memory> {
  try {
    const response = await apiClient.post(MEMORIES_ENDPOINT, data);

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data?.message || "Failed to create memory");
    }
  } catch (error) {
    console.error("Error creating memory:", error);
    throw error;
  }
}

/**
 * Upload a photo as FormData (if your API requires file upload)
 */
export async function uploadMemoryPhoto(data: {
  album_id: string;
  photo: {
    uri: string;
    name: string;
    type: string;
  };
  caption?: string;
}): Promise<Memory> {
  try {
    const formData = new FormData();
    formData.append("album_id", data.album_id);

    // Append the photo file
    formData.append("photo", {
      uri: data.photo.uri,
      name: data.photo.name,
      type: data.photo.type,
    } as any);

    if (data.caption) {
      formData.append("caption", data.caption);
    }

    const response = await apiClient.post(MEMORIES_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data?.message || "Failed to upload photo");
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
}

/**
 * Delete a memory (photo)
 */
export async function deleteMemory(memoryId: string): Promise<void> {
  try {
    const response = await apiClient.delete(`${MEMORIES_ENDPOINT}/${memoryId}`);

    if (response.status >= 200 && response.status < 300) {
      return;
    } else {
      throw new Error("Failed to delete memory");
    }
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw error;
  }
}
