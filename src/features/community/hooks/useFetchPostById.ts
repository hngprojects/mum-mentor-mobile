// src/features/community/hooks/useFetchPostById.ts

import { useQuery } from '@tanstack/react-query';
import { communityApi } from '../api/communityApi';
import { communityQueryKeys } from '../api/communityQueryKeys';

export const useFetchPostById = (postId: string) => {
  return useQuery({
    queryKey: communityQueryKeys.post(postId),
    queryFn: () => communityApi.getPostById(postId),
    enabled: !!postId,
  });
};
