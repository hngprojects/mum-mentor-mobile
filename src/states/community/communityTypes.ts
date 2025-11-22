// src/state/community/communityTypes.ts

export interface CommunityPost {
  id: string;
  userName: string;
  userImage: string;
  caption: string;
  images: string[];
  createdAt: string;
}

export interface GalleryPhoto {
  uri: string;
  selected: boolean;
}

export interface CreatePostState {
  caption: string;
  galleryPhotos: GalleryPhoto[];
  selectedPhotos: GalleryPhoto[];
}
