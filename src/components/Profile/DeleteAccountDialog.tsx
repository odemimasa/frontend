import { useState, type Dispatch, type SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { Button, buttonVariants } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { cn } from "@libs/shadcn";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";
import { useAuthContext } from "../../contexts/AuthProvider";
import { tokenStorage } from "@utils/token";

interface DeleteAccountDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function DeleteAccountDialog({ open, setOpen }: DeleteAccountDialogProps) {
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { retryWithRefresh } = useAuthContext();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.delete(`/users/${user?.id}`);
      if (res.status === 204) {
        setOpen(false);
        toast({
          description:
            "Akun berhasil dihapus. Kamu akan diarahkan ke halaman Beranda dalam 3 detik.",
          variant: "default",
        });

        setTimeout(() => {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (
        axiosRetry.isNetworkError(error as AxiosError) ||
        (status || 0) >= 500
      ) {
        toast({
          description: "Gagal menghapus akun, silakan coba kembali.",
          variant: "destructive",
        });
      }

      console.error(
        new Error("failed to delete user account", { cause: error })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus akun?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Kami akan menghapus semua data kamu secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel
            disabled={isLoading}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#363636] hover:bg-[#363636] hover:text-white w-full"
            )}
            type="button"
          >
            Batal
          </AlertDialogCancel>

          <Button
            disabled={isLoading}
            onClick={handleDeleteAccount}
            type="button"
            variant="outline"
            className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
          >
            {isLoading ? "Loading..." : "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteAccountDialog };
