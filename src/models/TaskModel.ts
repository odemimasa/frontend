import type { AxiosInstance, AxiosResponse } from "axios";

interface TaskRequest {
  name: string;
  description: string;
}

interface TaskResponse {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

class TaskModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getTasks(): Promise<AxiosResponse<TaskResponse[]>> {
    return this.fetch.get<TaskResponse[]>("/tasks");
  }

  async createTask(
    taskRequest: TaskRequest
  ): Promise<AxiosResponse<TaskResponse>> {
    return this.fetch.post<
      TaskResponse,
      AxiosResponse<TaskResponse>,
      TaskRequest
    >("/tasks", taskRequest);
  }
}

export { TaskModel };
export type { TaskResponse, TaskRequest };
