import type { Dispatch, SetStateAction } from "react";
import type { TaskResponse } from "../../models/TaskModel";

interface UpdateTaskViewProps {
  task: TaskResponse;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function UpdateTaskView({ task, isOpen, setIsOpen }: UpdateTaskViewProps) {
  console.log(task, isOpen, setIsOpen);
  return <></>;
}

export { UpdateTaskView };
