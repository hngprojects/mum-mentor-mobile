// src/features/community/utils/mapApiPost.ts

import type { CommunityPost } from '../types/Post.types';

/**
 * If your API returns snake_case or different shapes,
 * do the mapping here.
 * For now, it's a pass-through helper.
 */
export const mapApiPost = (post: any): CommunityPost => {
  return {
    id: post.id,
    author: post.author,
    caption: post.caption,
    media: post.media ?? [],
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    isLikedByCurrentUser: post.isLikedByCurrentUser ?? false,
    createdAt: post.createdAt,
  };
};
