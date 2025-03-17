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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useMemo } from "react";
import { UserModel } from "../../models/UserModel";
import { useDeleteAccountViewModel } from "../../viewmodels/profile/useDeleteAccountViewModel";
import { cn } from "@libs/shadcn";

function DeleteAccountView() {
  const { retryWithRefresh } = useAxiosContext();
  const userModel = useMemo((): UserModel => {
    return new UserModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const deleteAccountViewModel = useDeleteAccountViewModel(userModel);

  return (
    <>
      <div className="bg-[#D9534F] rounded-2xl p-6 mx-6">
        <p className="text-white font-bold text-sm flex items-center gap-3.5 mb-4">
          <ExclamationTriangleIcon className="text-white w-6 h-6 shrink-0" />
          Ingin hapus akun? klik tombol di bawah ini
        </p>

        <Button
          onClick={() => deleteAccountViewModel.setIsOpen(true)}
          type="button"
          className="bg-white hover:bg-white/90 text-[#D9534F] w-full"
        >
          Hapus Akun
        </Button>
      </div>

      <AlertDialog
        open={deleteAccountViewModel.isOpen}
        onOpenChange={deleteAccountViewModel.setIsOpen}
      >
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
              disabled={deleteAccountViewModel.isLoading}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#363636] hover:bg-[#363636] hover:text-white w-full"
              )}
              type="button"
            >
              Batal
            </AlertDialogCancel>

            <Button
              disabled={deleteAccountViewModel.isLoading}
              onClick={deleteAccountViewModel.deleteAccount}
              type="button"
              variant="outline"
              className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
            >
              {deleteAccountViewModel.isLoading ? "Loading..." : "Hapus"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { DeleteAccountView };
