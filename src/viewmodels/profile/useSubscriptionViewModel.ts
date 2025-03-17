import { useEffect, useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import type { SubscriptionModel } from "../../models/SubscriptionModel";
import { useStore } from "../../stores";

function useSubscriptionViewModel(subscriptionModel: SubscriptionModel) {
  const [isLoading, setIsLoading] = useState(true);

  const user = useStore((state) => state.user);
  const subscription = useStore((state) => state.subscription);
  const setSubscription = useStore((state) => state.setSubscription);

  const { handleAxiosError } = useAxiosContext();

  useEffect(() => {
    if (subscription !== undefined) {
      return;
    }

    (async () => {
      try {
        const res = await subscriptionModel.getActiveSubscription();
        if (res.data !== null) {
          setSubscription(res.data);
        }
      } catch (error) {
        handleAxiosError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [subscription, setSubscription, handleAxiosError, subscriptionModel]);

  return {
    isLoading,
    subscription,
    userTimezone: user?.timezone ?? "Asia/Jakarta",
  };
}

export { useSubscriptionViewModel };
