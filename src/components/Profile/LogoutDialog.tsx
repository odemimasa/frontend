import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { Button, buttonVariants } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { cn } from "@libs/shadcn";
import { tokenStorage } from "@utils/token";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";

interface LogoutDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function LogoutDialog({ open, setOpen }: LogoutDialogProps) {
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { retryWithoutRefresh } = useAuthContext();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      const res = await retryWithoutRefresh.post(
        "/auth/logout",
        { user_id: user?.id },
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      if (res.status === 200) {
        setOpen(false);
        toast({
          description:
            "Logout berhasil. Kamu akan diarahkan ke halaman Beranda dalam 3 detik.",
          variant: "default",
        });

        setTimeout(() => {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
          window.location.reload();
        }, 3000);
      } else if (res.status === 400) {
        throw new Error("invalid request body");
      } else if (res.status === 401) {
        setOpen(false);
        toast({
          description:
            "Sesi telah berakhir. Kamu akan diarahkan ke halaman Beranda dalam 3 detik.",
          variant: "destructive",
        });

        setTimeout(() => {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(`unhandled response status ${res.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to logout", { cause: error }));
      toast({
        description: "Logout gagal, silakan coba kembali.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin ingin logout?</AlertDialogTitle>
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
            onClick={handleLogout}
            type="button"
            variant="outline"
            className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
          >
            {isLoading ? "Loading..." : "Logout"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { LogoutDialog };
