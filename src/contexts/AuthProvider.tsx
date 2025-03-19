import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useAxiosContext } from "./AxiosProvider";
import { useStore } from "../stores";
import { tokenStorage } from "@utils/token";
import { UserModel } from "../models/UserModel";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { useToast } from "@hooks/shadcn/useToast";

interface AuthContextValue {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useStore((state) => state.setUser);
  const setSubscription = useStore((state) => state.setSubscription);

  const { toast } = useToast();
  const { retryWithRefresh, handleAxiosError } = useAxiosContext();

  const userModel = useMemo((): UserModel => {
    return new UserModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const subscriptionModel = useMemo((): SubscriptionModel => {
    return new SubscriptionModel(retryWithRefresh);
  }, [retryWithRefresh]);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    (async () => {
      try {
        if (accessToken === "" || refreshToken === "") {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
        } else {
          const [userRes, subscriptionRes] = await Promise.all([
            userModel.getUser(),
            subscriptionModel.getActiveSubscription(),
          ]);

          setUser(userRes.data);
          if (subscriptionRes.data) {
            setSubscription(subscriptionRes.data);
          }
        }
      } catch (error) {
        handleAxiosError(error as Error, (response) => {
          if (response.status === 404) {
            toast({
              description: "Akun tidak ditemukan.",
              variant: "destructive",
            });
          }
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    userModel,
    subscriptionModel,
    toast,
    handleAxiosError,
    setUser,
    setSubscription,
  ]);

  const contextValue = useMemo(() => {
    return { isLoading };
  }, [isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function useAuthContext() {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error(
      `"useAuthContext" must be used within the "AuthContext.Provider"`
    );
  }
  return auth;
}

export { AuthProvider, useAuthContext };
