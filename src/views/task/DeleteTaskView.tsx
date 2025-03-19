import { useMemo, type Dispatch, type SetStateAction } from "react";
import { TaskModel } from "../../models/TaskModel";
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
import { cn } from "@libs/shadcn";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useDeleteTaskViewModel } from "../../viewmodels/task/useDeleteTaskViewModel";
import type { TaskResponse } from "../../dtos/TaskDTO";

interface DeleteTaskViewProps {
  task: TaskResponse;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function DeleteTaskView({ task, isOpen, setIsOpen }: DeleteTaskViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const deleteTaskViewModel = useDeleteTaskViewModel(taskModel);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus ibadah&nbsp;
            <strong>{task.name}</strong>?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Ibadah <strong>{task.name}</strong> akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel
            disabled={deleteTaskViewModel.isLoading}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#363636] hover:bg-[#363636] hover:text-white w-full"
            )}
            type="button"
          >
            Batal
          </AlertDialogCancel>

          <Button
            disabled={deleteTaskViewModel.isLoading}
            onClick={() => deleteTaskViewModel.deleteTask(task.id, setIsOpen)}
            type="button"
            variant="outline"
            className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
          >
            {deleteTaskViewModel.isLoading ? "Loading..." : "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteTaskView };
