import type { PlanResponse } from "./PlanDTO";

interface InvoiceRequest {
  coupon_code?: string;
  customer_name: string;
  customer_email: string;
  plan: Pick<
    PlanResponse,
    "id" | "type" | "name" | "price" | "duration_in_months"
  >;
}

interface InvoiceResponse {
  id: string;
  plan_id: string;
  ref_id: string;
  coupon_code: string;
  total_amount: number;
  qr_url: string;
  expires_at: string;
  created_at: string;
}

export type { InvoiceRequest, InvoiceResponse };
