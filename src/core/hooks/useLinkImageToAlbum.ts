import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../lib/api";

interface LinkParams {
  photoId: string;
  albumId: string;
  note?: string;
}

interface LinkResponse {
  message: string;
  data: any;
}

export const useLinkImageToAlbum = (queryKey?: string | string[]) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<LinkResponse, Error, LinkParams>({
    mutationFn: async ({ photoId, albumId, note }) => {
      const url = `/api/v1/images/${photoId}/link-to-album`;

      const res = await authApi.post(url, null, {
        params: {
          album_id: albumId,
          note: note || "",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        });
      }
    },
  });

  return {
    linkImage: mutation.mutateAsync,
    isLinking: mutation.isPending,
    linkError: mutation.error,
    linkResult: mutation.data,
  };
};
