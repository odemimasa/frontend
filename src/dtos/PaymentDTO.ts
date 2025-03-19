type PaymentStatus = "paid" | "expired" | "failed" | "refund";

interface PaymentResponse {
  id: string;
  invoice_id: string;
  amount_paid: number;
  status: PaymentStatus;
  created_at: string;
}

export type { PaymentResponse };
