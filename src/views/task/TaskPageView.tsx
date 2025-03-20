import { useMemo } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { TaskModel } from "../../models/TaskModel";
import { useTaskPageViewModel } from "../../viewmodels/task/useTaskPageViewModel";
import { TaskView } from "./TaskView";
import { TaskSkeletonView } from "./TaskSkeletonView";

function TaskPageView() {
  const { retryWithRefresh } = useAxiosContext();
  const taskModel = useMemo((): TaskModel => {
    return new TaskModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const taskPageViewModel = useTaskPageViewModel(taskModel);

  if (taskPageViewModel.isLoading) {
    return <TaskSkeletonView />;
  }

  if (taskPageViewModel.tasks === undefined) {
    return (
      <p className="text-[#D9534F] text-center font-medium border border-[#D9534F] rounded-2xl p-6 mx-6 mt-6">
        Tidak dapat menampilkan daftar ibadah.
      </p>
    );
  }

  if (taskPageViewModel.tasks.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-6">
        Belum ada daftar ibadah.
      </p>
    );
  }

  return taskPageViewModel.tasks.map((item) => (
    <TaskView key={item.id} task={item} />
  ));
}

export { TaskPageView };
