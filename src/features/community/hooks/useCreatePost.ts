// src/features/community/hooks/useCreatePost.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../api/communityApi';
import { communityQueryKeys } from '../api/communityQueryKeys';
import type { CreatePostPayload } from '../types/Post.types';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => communityApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
    },
  });
};
