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

class UserModel {
  constructor() {}
}

export { UserModel };
export type { UserResponse };
