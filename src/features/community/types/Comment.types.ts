// src/features/community/types/Comment.types.ts

import type { CommunityUser } from './Post.types';

export interface CommunityComment {
  id: string;
  postId: string;
  author: CommunityUser;
  content: string;
  createdAt: string;
}
