import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { useMemo } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { AuthModel } from "../../models/AuthModel";
import { useLogoutViewModel } from "../../viewmodels/profile/useLogoutViewModel";
import { Button, buttonVariants } from "@components/shadcn/Button";
import { cn } from "@libs/shadcn";

function LogoutView() {
  const { retryWithoutRefresh } = useAxiosContext();
  const authModel = useMemo((): AuthModel => {
    return new AuthModel(retryWithoutRefresh);
  }, [retryWithoutRefresh]);

  const logoutViewModel = useLogoutViewModel(authModel);

  return (
    <>
      <div className="border border-[#E1E1E1] rounded-2xl p-6 mx-6">
        <p className="text-black text-center text-sm mb-4">
          Ingin keluar akun? klik tombol di bawah ini
        </p>

        <Button
          onClick={() => logoutViewModel.setIsOpen(true)}
          type="button"
          variant="outline"
          className="text-[#2F3D4A] w-full"
        >
          Keluar
        </Button>
      </div>

      <AlertDialog
        open={logoutViewModel.isOpen}
        onOpenChange={logoutViewModel.setIsOpen}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin ingin logout?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel
              disabled={logoutViewModel.isLoading}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#363636] hover:bg-[#363636] hover:text-white w-full"
              )}
              type="button"
            >
              Batal
            </AlertDialogCancel>

            <Button
              disabled={logoutViewModel.isLoading}
              onClick={logoutViewModel.logout}
              type="button"
              variant="outline"
              className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
            >
              {logoutViewModel.isLoading ? "Loading..." : "Logout"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { LogoutView };
