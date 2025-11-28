import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../lib/api";

interface PhotoData {
  id: string;
  image_url: string;
}

interface Memory {
  album_id: string;
  id: string;
  note: string;
  photo_data: PhotoData;
  saved_on: string;
}

interface AlbumWithMemories {
  created_at: string;
  id: string;
  memories: Memory[];
  name: string;
  updated_at: string;
  user_id: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
  memories?: Memory[];
}

export const useGetAlbum = (albumId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<AlbumWithMemories>, Error>({
    queryKey: ["album", albumId],
    enabled: !!albumId && enabled,

    queryFn: async () => {
      const res = await authApi.get(`/api/v1/albums/${albumId}`);
      return res.data;
    },
  });
};
