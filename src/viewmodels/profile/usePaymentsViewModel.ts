import { useEffect, useState } from "react";
import type { PaymentModel } from "../../models/PaymentModel";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";

function usePaymentsViewModel(paymentModel: PaymentModel) {
  const [isLoading, setIsLoading] = useState(false);

  const user = useStore((state) => state.user);
  const payments = useStore((state) => state.payments);
  const setPayments = useStore((state) => state.setPayments);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (payments.length > 0) {
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const res = await paymentModel.getPayments();
        if (res.data.length > 0) {
          setPayments(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [payments, setPayments, handleAxiosError, paymentModel]);

  return {
    userTimezone: user?.timezone ?? "Asia/Jakarta",
    isLoading,
    payments,
  };
}

export { usePaymentsViewModel };
