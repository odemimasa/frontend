import type { StateCreator } from "zustand";
import type { TaskResponse } from "../models/TaskModel";

interface TaskSlice {
  tasks: TaskResponse[];
  setTasks: (
    tasks: ((tasks: TaskResponse[]) => TaskResponse[]) | TaskResponse[]
  ) => void;
}

const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  tasks: [],
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
