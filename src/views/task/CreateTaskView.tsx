import type { Dispatch, SetStateAction } from "react";

interface CreateTaskViewProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateTaskView({ isOpen, setIsOpen }: CreateTaskViewProps) {
  console.log(isOpen);
  console.log(setIsOpen);
  return <></>;
}

export { CreateTaskView };
