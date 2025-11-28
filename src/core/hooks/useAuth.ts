// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../constants";
import { api } from "../../lib/api";
import { auth } from "../../lib/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: any;
  };
}

export const useAuth = () => {
  const loginMutation = useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      const { access_token, refresh_token } = data.data;
      await auth.setTokens(access_token, refresh_token);
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: async (userData: RegisterPayload) => {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    },
    onSuccess: async (data) => {
      const { access_token, refresh_token } = data.data;
      await auth.setTokens(access_token, refresh_token);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await auth.logout();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
