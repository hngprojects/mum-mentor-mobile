// src/state/community/communityStore.ts

import { create } from "zustand";
import { CommunityPost, CreatePostState, GalleryPhoto } from "./communityTypes";

interface CommunityStore {
  // FEED
  posts: CommunityPost[];
  page: number;
  loading: boolean;
  hasMore: boolean;

  fetchPosts: () => Promise<void>;
  loadMore: () => Promise<void>;

  // CREATE POST
  createPost: CreatePostState;

  setCaption: (caption: string) => void;
  setGalleryPhotos: (photos: GalleryPhoto[]) => void;
  toggleSelectPhoto: (uri: string) => void;
  resetCreatePost: () => void;
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  // INITIAL STATE
  posts: [],
  page: 1,
  loading: false,
  hasMore: true,

  // MOCK FETCH — replace with API service later
  fetchPosts: async () => {
    set({ loading: true });

    // MOCK API RESPONSE
    const fake = [
      {
        id: "1",
        userName: "Sarah",
        userImage: "https://picsum.photos/200",
        caption: "Loved this moment ❤️",
        images: [
          "https://picsum.photos/500",
          "https://picsum.photos/501",
          "https://picsum.photos/502",
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    set({
      posts: fake,
      loading: false,
    });
  },

  loadMore: async () => {
    if (!get().hasMore || get().loading) return;

    set({ loading: true });

    // Mock additional data
    const more = [
      {
        id: Math.random().toString(),
        userName: "Debbie",
        userImage: "https://picsum.photos/203",
        caption: "Another beautiful day 🌞",
        images: ["https://picsum.photos/509"],
        createdAt: new Date().toISOString(),
      },
    ];

    set({
      posts: [...get().posts, ...more],
      page: get().page + 1,
      loading: false,
      hasMore: more.length > 0,
    });
  },

  // CREATE POST LOGIC
  createPost: {
    caption: "",
    galleryPhotos: [],
    selectedPhotos: [],
  },

  setCaption: (caption) =>
    set((state) => ({
      createPost: { ...state.createPost, caption },
    })),

  setGalleryPhotos: (galleryPhotos) =>
    set((state) => ({
      createPost: { ...state.createPost, galleryPhotos },
    })),

  toggleSelectPhoto: (uri) =>
    set((state) => {
      const updated = state.createPost.galleryPhotos.map((p) =>
        p.uri === uri ? { ...p, selected: !p.selected } : p
      );

      const selectedPhotos = updated.filter((p) => p.selected);

      return {
        createPost: {
          ...state.createPost,
          galleryPhotos: updated,
          selectedPhotos,
        },
      };
    }),

  resetCreatePost: () =>
    set({
      createPost: {
        caption: "",
        galleryPhotos: [],
        selectedPhotos: [],
      },
    }),
}));
