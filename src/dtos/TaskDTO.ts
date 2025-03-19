interface CreateTaskRequest {
  name: string;
  description: string;
}

interface UpdateTaskRequest {
  name?: string;
  description?: string;
  checked?: boolean;
}

interface TaskResponse {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export type { CreateTaskRequest, UpdateTaskRequest, TaskResponse };
