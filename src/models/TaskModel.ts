import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from "../dtos/TaskDTO";

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
