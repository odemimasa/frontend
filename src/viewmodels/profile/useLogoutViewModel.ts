import { useState } from "react";
import type { AuthModel } from "../../models/AuthModel";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { tokenStorage } from "@utils/token";

function useLogoutViewModel(authModel: AuthModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      const res = await authModel.logout(refreshToken);

      if (res.status === 200) {
        toast({ description: "Logout berhasil.", variant: "default" });
      } else if (res.status === 401) {
        toast({ description: "Sesi telah berakhir.", variant: "destructive" });
      }

      setIsOpen(false);
      tokenStorage.removeAccessToken();
      tokenStorage.removeRefreshToken();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      handleAxiosError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isOpen, logout, setIsOpen };
}

export { useLogoutViewModel };
