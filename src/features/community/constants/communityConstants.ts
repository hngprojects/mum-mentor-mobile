// src/features/community/constants/communityConstants.ts

export const COMMUNITY_CONSTANTS = {
  MAX_PHOTOS_PER_POST: 10,
  CAPTION_MAX_LENGTH: 1000,
};

export const COMMUNITY_QUERY_KEYS = {
  ALL: ['community'] as const,
  POSTS: () => [...COMMUNITY_QUERY_KEYS.ALL, 'posts'] as const,
  POST: (postId: string) => [...COMMUNITY_QUERY_KEYS.ALL, 'post', postId] as const,
};
