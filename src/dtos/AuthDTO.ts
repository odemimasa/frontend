import type { UserResponse } from "./UserDTO";

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

export type { RegisterRequest, LoginRequest, AuthResponse };
