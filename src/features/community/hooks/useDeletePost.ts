// src/features/community/hooks/useDeletePost.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../api/communityApi';
import { communityQueryKeys } from '../api/communityQueryKeys';
import type { DeletePostPayload } from '../types/Post.types';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeletePostPayload) => communityApi.deletePost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
    },
  });
};
