import { useState } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";

function useTaskViewModel(taskModel: TaskModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const setTasks = useStore((state) => state.setTasks);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const checkTask = async (id: string, checked: boolean) => {
    setIsLoading(true);
    try {
      const res = await taskModel.updateTask(id, { checked });
      if (res.status === 200) {
        toast({
          description: res.data.checked
            ? "Berhasil mencentang ibadah."
            : "Berhasil tidak mencentang ibadah.",
          variant: "default",
        });

        setTasks((tasks) => {
          const idx = tasks.findIndex((item) => item.id === id);
          tasks[idx].checked = res.data.checked;
          return tasks;
        });
      }
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 400) {
          console.error(new Error("invalid request body", { cause: error }));
        } else if (response.status === 404) {
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

  return {
    isLoading,
    isUpdateOpen,
    isDeleteOpen,
    setIsUpdateOpen,
    setIsDeleteOpen,
    checkTask,
  };
}

export { useTaskViewModel };
