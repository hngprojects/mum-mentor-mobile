import { useAuthCrud } from "./useCrud";

export const useChangePassword = () => {
  return useAuthCrud<
    {
      old_password: string;
      new_password: string;
      confirm_password: string;
    },
    any
  >("/api/v1/auth/change-password", {
    queryKey: "change-password",
    enabled: false,
  });
};
