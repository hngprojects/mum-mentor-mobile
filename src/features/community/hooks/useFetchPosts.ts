// src/features/community/hooks/useFetchPosts.ts

import { useQuery } from '@tanstack/react-query';
import { communityApi } from '../api/communityApi';
import { communityQueryKeys } from '../api/communityQueryKeys';

export const useFetchPosts = () => {
  return useQuery({
    queryKey: communityQueryKeys.posts(),
    queryFn: () => communityApi.getPosts(),
  });
};
