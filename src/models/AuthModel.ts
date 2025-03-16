import type { AxiosInstance, AxiosResponse } from "axios";
import type { UserResponse } from "./UserModel";

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  refresh_token: string;
  access_token: string;
  user: UserResponse;
}

class AuthModel {
  readonly fetch: AxiosInstance;

  constructor(fetch: AxiosInstance) {
    this.fetch = fetch;
  }

  async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await this.fetch.post<
      AuthResponse,
      AxiosResponse<AuthResponse>,
      LoginRequest
    >("/auth/login", { email, password });
  }
}

export { AuthModel };
