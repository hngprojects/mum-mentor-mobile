// src/features/community/hooks/useUploadMedia.ts

import { useMutation } from '@tanstack/react-query';
import { communityApi } from '../api/communityApi';
import type { CommunityMedia } from '../types/Post.types';

interface UploadFileInput {
  uri: string;
  type: string;
  name: string;
}

interface UploadMediaResponse {
  media: CommunityMedia[];
}

export const useUploadMedia = () => {
  return useMutation<CommunityMedia[], unknown, UploadFileInput[]>({
    mutationFn: (files) => communityApi.uploadMedia(files),
  });
};
