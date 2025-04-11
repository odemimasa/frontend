interface UserRequest {
  username?: string;
  email?: string;
  password?: string;
  latitude?: string;
  longitude?: string;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  payment_id: string;
  start_date: string;
  end_date: string;
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
  subscription: UserSubscription | null;
}

export type { UserRequest, UserResponse, UserSubscription };
