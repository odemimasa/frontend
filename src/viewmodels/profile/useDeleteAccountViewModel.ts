import { useState } from "react";
import type { UserModel } from "../../models/UserModel";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { tokenStorage } from "@utils/token";

function useDeleteAccountViewModel(userModel: UserModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      await userModel.deleteUser();
      toast({ description: "Akun berhasil dihapus.", variant: "default" });
      setIsOpen(false);
      tokenStorage.removeAccessToken();
      tokenStorage.removeRefreshToken();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 404) {
          toast({
            description: "Gagal menghapus akun. Akun tidak ditemukan.",
            variant: "destructive",
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isOpen, deleteAccount, setIsOpen };
}

export { useDeleteAccountViewModel };
