import { z } from "zod";
import type { TaskModel, TaskRequest } from "../../models/TaskModel";
import { useToast } from "@hooks/shadcn/useToast";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "../../stores";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tidak boleh kosong." }),
  description: z.string().min(1, { message: "Tidak boleh kosong." }),
});

function useCreateTaskViewModel(taskModel: TaskModel) {
  const [isLoading, setIsLoading] = useState(false);

  const setTasks = useStore((state) => state.setTasks);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTask = async (
    taskRequest: TaskRequest,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    try {
      const res = await taskModel.createTask(taskRequest);
      toast({ description: "Berhasil membuat ibadah.", variant: "default" });
      setIsOpen(false);
      setTasks((tasks) => {
        return [...tasks, res.data];
      });
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 400) {
          console.error(new Error("invalid request body", { cause: error }));
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, form, formSchema, createTask };
}

export { useCreateTaskViewModel };
