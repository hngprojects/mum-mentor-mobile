// src/features/community/types/Post.types.ts

export interface CommunityUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface CommunityMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface CommunityPost {
  id: string;
  author: CommunityUser;
  caption: string;
  media: CommunityMedia[];
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string; // ISO string
}

export interface CreatePostPayload {
  caption: string;
  mediaIds: string[];
}

export interface DeletePostPayload {
  postId: string;
}
