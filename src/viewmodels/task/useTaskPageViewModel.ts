import { useEffect, useState } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useStore } from "../../stores";
import { useAxiosContext } from "../../contexts/AxiosProvider";

function useTaskPageViewModel(taskModel: TaskModel) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (tasks.length > 0) {
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const res = await taskModel.getTasks();
        if (res.data.length > 0) {
          setTasks(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [tasks, taskModel, handleAxiosError, setTasks]);

  return { isLoading, isOpen, tasks, setIsOpen };
}

export { useTaskPageViewModel };
