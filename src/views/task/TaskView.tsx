import type { TaskResponse } from "../../models/TaskModel";

function TaskView({ task }: { task: TaskResponse }) {
  console.log(task);
  return <></>;
}

export { TaskView };
