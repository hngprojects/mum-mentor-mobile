// src/features/community/api/communityApi.ts

import type {
  CommunityPost,
  CreatePostPayload,
  DeletePostPayload,
  CommunityMedia,
} from '../types/Post.types';
// Adjust this import to your actual axios instance
import { apiClient } from '@/core/api/client';

export const communityApi = {
  async getPosts(): Promise<CommunityPost[]> {
    const { data } = await apiClient.get('/community/posts');
    return data;
  },

  async getPostById(postId: string): Promise<CommunityPost> {
    const { data } = await apiClient.get(`/community/posts/${postId}`);
    return data;
  },

  async createPost(payload: CreatePostPayload): Promise<CommunityPost> {
    const { data } = await apiClient.post('/community/posts', payload);
    return data;
  },

  async deletePost({ postId }: DeletePostPayload): Promise<void> {
    await apiClient.delete(`/community/posts/${postId}`);
  },

  async uploadMedia(files: { uri: string; type: string; name: string }[]): Promise<CommunityMedia[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    const { data } = await apiClient.post('/community/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },
};
