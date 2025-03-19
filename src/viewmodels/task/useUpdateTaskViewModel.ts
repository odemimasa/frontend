import { useToast } from "@hooks/shadcn/useToast";
import type { TaskModel } from "../../models/TaskModel";
import { useStore } from "../../stores";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { UpdateTaskRequest } from "../../dtos/TaskDTO";

function useUpdateTaskViewModel(taskModel: TaskModel) {
  const [isLoading, setIsLoading] = useState(false);

  const setTasks = useStore((state) => state.setTasks);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const updateTask = async (
    id: string,
    updateTaskRequest: UpdateTaskRequest,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    try {
      const res = await taskModel.updateTask(id, updateTaskRequest);
      if (res.status === 200) {
        toast({
          description: "Berhasil mengubah ibadah.",
          variant: "default",
        });

        setIsOpen(false);
        setTasks((tasks) => {
          const idx = tasks.findIndex((item) => item.id === id);
          tasks[idx].name = res.data.name;
          tasks[idx].description = res.data.description;
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

  return { isLoading, updateTask };
}

export { useUpdateTaskViewModel };
