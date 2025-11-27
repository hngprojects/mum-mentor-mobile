import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../lib/api";

interface Memory {
  id: string;
  note: string;
  photoUrl: string;
  createdAt: string;
}

interface AlbumWithMemories {
  id: string;
  title: string;
  description?: string;
  coverPhoto?: string;
  createdAt: string;
  memories: Memory[];
}

interface ApiResponse<T> {
  message: string;
  data: T;
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
