import type { AxiosInstance, AxiosResponse } from "axios";

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

class TaskModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getTasks(): Promise<AxiosResponse<TaskResponse[]>> {
    return this.fetch.get<TaskResponse[]>("/tasks");
  }

  async createTask(
    createTaskRequest: CreateTaskRequest
  ): Promise<AxiosResponse<TaskResponse>> {
    return this.fetch.post<
      TaskResponse,
      AxiosResponse<TaskResponse>,
      CreateTaskRequest
    >("/tasks", createTaskRequest);
  }

  async updateTask(
    id: string,
    updateTaskRequest: UpdateTaskRequest
  ): Promise<AxiosResponse<TaskResponse>> {
    return this.fetch.put<
      TaskResponse,
      AxiosResponse<TaskResponse>,
      UpdateTaskRequest
    >(`/tasks/${id}`, updateTaskRequest);
  }

  async deleteTask(id: string): Promise<AxiosResponse> {
    return this.fetch.delete(`/tasks/${id}`);
  }
}

export { TaskModel };
export type { TaskResponse, CreateTaskRequest, UpdateTaskRequest };
