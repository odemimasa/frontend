import type { StateCreator } from "zustand";
import type { TaskResponse } from "../dtos/TaskDTO";

interface TaskSlice {
  tasks: TaskResponse[] | undefined;
  setTasks: (
    tasks:
      | ((tasks: TaskResponse[] | undefined) => TaskResponse[] | undefined)
      | TaskResponse[]
      | undefined
  ) => void;
}

const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  tasks: undefined,
  setTasks: (tasks) => {
    set((state) => {
      if (typeof tasks === "function") {
        return { tasks: tasks(state.tasks) };
      }
      return { tasks };
    });
  },
});

export { createTaskSlice };
export type { TaskSlice };
