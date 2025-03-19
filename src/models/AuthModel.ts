import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../dtos/AuthDTO";

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
