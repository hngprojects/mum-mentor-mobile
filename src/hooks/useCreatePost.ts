// src/hooks/useCreatePost.ts

import { useCommunityStore } from "@/state/community/communityStore";
import { uploadImages } from "@/services/community/upload.api";
import { createPost } from "@/services/community/community.api";
import { router } from "expo-router";

export const useCreatePost = () => {
  const { createPost: state } = useCommunityStore();
  const store = useCommunityStore();

  const setCaption = (caption: string) => store.setCaption(caption);
  const setGalleryPhotos = (photos: any[]) =>
    store.setGalleryPhotos(photos);
  const toggleSelectPhoto = (uri: string) => store.toggleSelectPhoto(uri);

  // Upload + Create Post
  const submitPost = async () => {
    const selected = state.selectedPhotos;
    if (!selected.length) return;

    // 1️⃣ Upload images
    const imageUrls = await uploadImages(selected);

    // 2️⃣ Create post metadata
    const response = await createPost({
      caption: state.caption,
      imageUrls,
    });

    // 3️⃣ Reset creation state
    store.resetCreatePost();

    // 4️⃣ Go back to feed
    router.replace("/community");

    return response;
  };

  return {
    caption: state.caption,
    galleryPhotos: state.galleryPhotos,
    selectedPhotos: state.selectedPhotos,

    setCaption,
    setGalleryPhotos,
    toggleSelectPhoto,

    submitPost,
  };
};
