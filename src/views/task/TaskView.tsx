import { Button } from "@components/shadcn/Button";
import { TaskModel } from "../../models/TaskModel";
import {
  BoxIcon,
  CheckboxIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useTaskViewModel } from "../../viewmodels/task/useTaskViewModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useMemo } from "react";
import { UpdateTaskView } from "./UpdateTaskView";
import { DeleteTaskView } from "./DeleteTaskView";
import type { TaskResponse } from "../../dtos/TaskDTO";

function TaskView({ task }: { task: TaskResponse }) {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const taskViewModel = useTaskViewModel(taskModel);

  return (
    <div className="break-words border border-[#C2C2C2] rounded-lg p-5 mx-6 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[#363636] font-bold text-lg">{task.name}</h3>
        <Button
          disabled={taskViewModel.isLoading}
          onClick={() => taskViewModel.checkTask(task.id, !task.checked)}
          type="button"
          variant="link"
          className="[&_svg]:size-6"
        >
          {task.checked ? <CheckboxIcon /> : <BoxIcon />}
        </Button>
      </div>

      <div className="flex items-center my-1">
        <Button
          onClick={() => taskViewModel.setIsUpdateOpen(true)}
          type="button"
          variant="link"
          className="text-[#7B7B7B] hover:no-underline font-semibold flex items-center gap-2 min-w-16 p-0"
        >
          <Pencil1Icon />
          Edit
        </Button>

        <UpdateTaskView
          task={task}
          isOpen={taskViewModel.isUpdateOpen}
          setIsOpen={taskViewModel.setIsUpdateOpen}
        />

        <div className="bg-[#7B7B7B] w-0.5 h-5 mx-4"></div>

        <Button
          onClick={() => taskViewModel.setIsDeleteOpen(true)}
          type="button"
          variant="link"
          className="text-[#7B7B7B] hover:no-underline font-semibold flex items-center gap-2 min-w-16 p-0"
        >
          <TrashIcon />
          Hapus
        </Button>

        <DeleteTaskView
          task={task}
          isOpen={taskViewModel.isDeleteOpen}
          setIsOpen={taskViewModel.setIsDeleteOpen}
        />
      </div>

      <p className="text-[#7B7B7B]">{task.description}</p>
    </div>
  );
}

export { TaskView };
