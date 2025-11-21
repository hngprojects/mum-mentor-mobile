// src/features/community/api/communityQueryKeys.ts

export const communityQueryKeys = {
  all: ['community'] as const,
  posts: () => [...communityQueryKeys.all, 'posts'] as const,
  post: (postId: string) => [...communityQueryKeys.all, 'post', postId] as const,
};
