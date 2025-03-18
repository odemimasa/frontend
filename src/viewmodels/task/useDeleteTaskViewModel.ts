import { useState, type Dispatch, type SetStateAction } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useStore } from "../../stores";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useToast } from "@hooks/shadcn/useToast";

function useDeleteTaskViewModel(taskModel: TaskModel) {
  const [isLoading, setIsLoading] = useState(false);

  const setTasks = useStore((state) => state.setTasks);

  const { handleAxiosError } = useAxiosContext();
  const { toast } = useToast();

  const deleteTask = async (
    id: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    try {
      await taskModel.deleteTask(id);
      toast({ description: "Berhasil menghapus ibadah.", variant: "default" });
      setIsOpen(false);
      setTasks((tasks) => {
        const idx = tasks.findIndex((item) => item.id === id);
        tasks.splice(idx, 1);
        return [...tasks];
      });
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 404) {
          toast({
            description: "Ibadah tidak ditemukan.",
            variant: "destructive",
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, deleteTask };
}

export { useDeleteTaskViewModel };
