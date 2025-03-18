import type { Dispatch, SetStateAction } from "react";
import type { TaskResponse } from "../../models/TaskModel";

interface DeleteTaskViewProps {
  task: TaskResponse;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function DeleteTaskView({ task, isOpen, setIsOpen }: DeleteTaskViewProps) {
  console.log(task, isOpen, setIsOpen);
  return <></>;
}

export { DeleteTaskView };
