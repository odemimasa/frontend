interface UserRequest {
  username?: string;
  email?: string;
  password?: string;
  latitude?: string;
  longitude?: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  timezone: string;
  created_at: string;
}

export type { UserRequest, UserResponse };
