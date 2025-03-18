import type { AxiosInstance, AxiosResponse } from "axios";
import type { UserResponse } from "./UserModel";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

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
    loginRequest: LoginRequest
  ): Promise<AxiosResponse<AuthResponse>> {
    return await this.fetch.post<
      AuthResponse,
      AxiosResponse<AuthResponse>,
      LoginRequest
    >("/auth/login", loginRequest);
  }

  async register(
    registerRequest: RegisterRequest
  ): Promise<AxiosResponse<AuthResponse>> {
    return await this.fetch.post<
      AuthResponse,
      AxiosResponse<AuthResponse>,
      RegisterRequest
    >("/auth/register", registerRequest);
  }

  async logout(refreshToken: string): Promise<AxiosResponse> {
    return await this.fetch.post("/auth/logout", undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  }
}

export { AuthModel };
