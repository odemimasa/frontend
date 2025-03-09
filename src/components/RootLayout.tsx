import { Outlet, useLocation, useNavigate } from "react-router";
import { Toaster } from "@components/shadcn/Toaster";
import { useStore, type User } from "@hooks/useStore";
import { useEffect, useState } from "react";
import { useToast } from "@hooks/shadcn/useToast";
import { NavigationBar } from "./NavigationBar";
import { tokenStorage } from "@utils/token";
import type { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useAuthContext } from "../contexts/AuthProvider";

function RootLayout(): JSX.Element {
  const { retryWithRefresh } = useAuthContext();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      try {
        if (accessToken === "" || refreshToken === "") {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
        } else {
          const res = await retryWithRefresh.get<User>("/users/me");
          if (res.status === 200) {
            setUser(res.data);
          }
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;
        if (
          axiosRetry.isNetworkError(error as AxiosError) ||
          (status || 0) >= 500
        ) {
          toast({
            description: "Gagal mendapatkan data pengguna.",
            variant: "destructive",
          });
        }

        console.error(new Error("failed to get me", { cause: error }));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setUser, toast, retryWithRefresh]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user === undefined && location.pathname !== "/") {
      navigate("/");
    }

    if (user !== undefined && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user, navigate, location, isLoading]);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <Toaster />

      <main
        className={`${user !== undefined ? "pb-28" : ""} h-screen overflow-scroll`}
      >
        {user !== undefined ? (
          <div className="border border-[#E1E1E1] rounded-b-[40px] py-2.5">
            <div className="flex justify-center items-center gap-2">
              <img
                src="https://ec3q29jlfx8dke21.public.blob.vercel-storage.com/demi-masa-logo-hqkMxwY4lciC0StHA05IUeeWvw3jfq.png"
                alt="Logo Aplikasi Demi Masa"
                className="w-9"
              />

              <h2 className="text-black font-bold text-xl">Demi Masa</h2>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Outlet />
        {user !== undefined ? <NavigationBar /> : <></>}
      </main>
    </>
  );
}

export { RootLayout };
