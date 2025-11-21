// src/features/community/stores/createPostStore.ts

import { create } from 'zustand';
import type { CommunityMedia } from '../types/Post.types';

interface CreatePostState {
  caption: string;
  selectedMedia: CommunityMedia[];

  setCaption: (value: string) => void;
  setSelectedMedia: (media: CommunityMedia[]) => void;
  addMedia: (media: CommunityMedia) => void;
  removeMedia: (mediaId: string) => void;
  reset: () => void;
}

export const useCreatePostStore = create<CreatePostState>((set) => ({
  caption: '',
  selectedMedia: [],

  setCaption: (value) => set({ caption: value }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  addMedia: (media) =>
    set((state) => ({
      selectedMedia: [...state.selectedMedia, media],
    })),
  removeMedia: (mediaId) =>
    set((state) => ({
      selectedMedia: state.selectedMedia.filter((m) => m.id !== mediaId),
    })),
  reset: () => set({ caption: '', selectedMedia: [] }),
}));
