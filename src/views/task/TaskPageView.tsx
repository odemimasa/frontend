import { useMemo } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { TaskModel } from "../../models/TaskModel";
import { useTaskPageViewModel } from "../../viewmodels/task/useTaskPageViewModel";
import { Button } from "@components/shadcn/Button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@components/shadcn/Skeleton";
import { CreateTaskView } from "./CreateTaskView";
import { TaskView } from "./TaskView";

function TaskPageView() {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const taskPageViewModel = useTaskPageViewModel(taskModel);

  if (taskPageViewModel.isLoading) {
    return (
      <>
        <div className="flex justify-between items-center mx-6 mt-6">
          <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>

          <Button
            onClick={() => taskPageViewModel.setIsOpen(true)}
            type="button"
            className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
          >
            Buat
            <PlusIcon />
          </Button>

          <CreateTaskView
            isOpen={taskPageViewModel.isOpen}
            setIsOpen={taskPageViewModel.setIsOpen}
          />
        </div>

        <div className="animate-pulse border border-[#C2C2C2] rounded-lg flex flex-col space-y-3 mx-6 mt-6 p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mx-6 mt-6">
        <h1 className="text-[#363636] font-bold text-xl">Daftar Ibadah</h1>

        <Button
          onClick={() => taskPageViewModel.setIsOpen(true)}
          type="button"
          className="bg-[#6594AB] hover:bg-[#6594AB]/90 text-white font-semibold [&_svg]:size-5"
        >
          Buat
          <PlusIcon />
        </Button>

        <CreateTaskView
          isOpen={taskPageViewModel.isOpen}
          setIsOpen={taskPageViewModel.setIsOpen}
        />
      </div>

      {taskPageViewModel.tasks.length > 0 ? (
        <div className="flex flex-col gap-4 mt-6 mx-6">
          {taskPageViewModel.tasks.map((item) => (
            <TaskView key={item.id} task={item} />
          ))}
        </div>
      ) : (
        <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-6">
          Belum ada daftar ibadah
        </p>
      )}
    </>
  );
}

export { TaskPageView };
