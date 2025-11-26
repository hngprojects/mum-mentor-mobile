// hooks/useCrud.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, authApi } from "../../lib/api";

interface CrudOptions {
  queryKey?: string | string[];
  enabled?: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// For public endpoints (no authentication)
export const usePublicCrud = <TParams, TData>(
  endpoint: string,
  options?: CrudOptions
) => {
  const queryClient = useQueryClient();

  const queryKey = Array.isArray(options?.queryKey)
    ? options.queryKey
    : [options?.queryKey || endpoint];

  const getAll = useQuery<ApiResponse<TData>, Error>({
    queryKey,
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });

  const create = useMutation<ApiResponse<TData>, Error, TParams | FormData>({
    mutationFn: async (data: TParams | FormData) => {
      const res = await api.post(endpoint, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation<ApiResponse<TData>, Error, string | number>({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`${endpoint}/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation<
    ApiResponse<TData>,
    Error,
    { id?: string | number; data: Partial<TParams> | FormData }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string | number;
      data: Partial<TParams> | FormData;
    }) => {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const res = await api.patch(url, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { getAll, create, update, remove };
};

// For protected endpoints (requires authentication)
export const useAuthCrud = <TParams, TData>(
  endpoint: string,
  options?: CrudOptions
) => {
  const queryClient = useQueryClient();

  const queryKey = Array.isArray(options?.queryKey)
    ? options.queryKey
    : [options?.queryKey || endpoint];

  const getAll = useQuery<ApiResponse<TData>, Error>({
    queryKey,
    queryFn: async () => {
      const res = await authApi.get(endpoint);
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });

  const create = useMutation<ApiResponse<TData>, Error, TParams | FormData>({
    mutationFn: async (data: TParams | FormData) => {
      const res = await authApi.post(endpoint, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation<
    ApiResponse<TData>,
    Error,
    TParams | string | number
  >({
    mutationFn: async (id: TParams | string | number) => {
      const res = await authApi.delete(`${endpoint}/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation<
    ApiResponse<TData>,
    Error,
    { id?: string | number; data: Partial<TParams> | FormData }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string | number;
      data: Partial<TParams> | FormData;
    }) => {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const res = await authApi.patch(url, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { getAll, create, update, remove };
};

// Keep the original useCrud for backward compatibility
export const useCrud = usePublicCrud;
