import type { AxiosInstance, AxiosResponse } from "axios";
import type { UserRequest, UserResponse } from "../dtos/UserDTO";

class UserModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async getUser(): Promise<AxiosResponse<UserResponse>> {
    return await this.fetch.get<UserResponse>("/users/me");
  }

  async updateUser(
    userRequest: UserRequest
  ): Promise<AxiosResponse<UserResponse>> {
    return await this.fetch.put<
      UserResponse,
      AxiosResponse<UserResponse>,
      UserRequest
    >("/users/me", userRequest);
  }

  async deleteUser(): Promise<AxiosResponse> {
    return await this.fetch.delete("/users/me");
  }
}

export { UserModel };
