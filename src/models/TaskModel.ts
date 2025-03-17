import type { AxiosInstance, AxiosResponse } from "axios";

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
}

export { TaskModel };
export type { TaskResponse };
