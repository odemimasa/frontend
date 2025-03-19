type PlanType = "premium";

interface PlanResponse {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  duration_in_months: number;
  created_at: string;
}

export type { PlanResponse };
