import { Toaster } from "@components/shadcn/Toaster";
import { useAuthContext } from "./contexts/AuthProvider";
import { useStore } from "./stores";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NavigationView } from "./views/NavigationView";
import { useEffect } from "react";

function ProtectedRoute() {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (user === undefined && location.pathname !== "/") {
        navigate("/");
      } else if (user !== undefined && location.pathname === "/") {
        navigate("/dashboard");
      }
    }
  }, [isLoading, user, location, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="animate-spin w-24 h-24 border-8 border-[#BF8E50] border-b-transparent rounded-full"></div>
      </div>
    );
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
        {user !== undefined ? <NavigationView /> : <></>}
      </main>
    </>
  );
}

export { ProtectedRoute };
