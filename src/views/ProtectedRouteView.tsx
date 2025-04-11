import { Toaster } from "@components/shadcn/Toaster";
import { useAuthContext } from "../contexts/AuthProvider";
import { useStore } from "../stores";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NavigationView } from "./NavigationView";
import { lazy, Suspense, useEffect } from "react";
import { DemiMasaHeaderView } from "./DemiMasaHeaderView";

const DashboardPageSkeletonView = lazy(() =>
  import("./dashboard/DashboardPageSkeletonView").then(
    ({ DashboardPageSkeletonView }) => ({
      default: DashboardPageSkeletonView,
    })
  )
);

const TaskPageSkeletonView = lazy(() =>
  import("./task/TaskPageSkeletonView").then(({ TaskPageSkeletonView }) => ({
    default: TaskPageSkeletonView,
  }))
);

const ProfilePageSkeletonView = lazy(() =>
  import("./profile/ProfilePageSkeletonView").then(
    ({ ProfilePageSkeletonView }) => ({
      default: ProfilePageSkeletonView,
    })
  )
);

function ProtectedRouteView() {
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
      } else if (
        user !== undefined &&
        user.subscription === null &&
        location.pathname === "/tasks"
      ) {
        navigate("/dashboard");
      }
    }
  }, [isLoading, location.pathname, navigate, user]);

  if (isLoading && location.pathname === "/tasks") {
    return (
      <div className="w-full min-h-screen pb-6">
        <Suspense fallback={<></>}>
          <TaskPageSkeletonView />
        </Suspense>
      </div>
    );
  }

  if (isLoading && location.pathname === "/profile") {
    return (
      <div className="w-full min-h-screen pb-6">
        <Suspense fallback={<></>}>
          <ProfilePageSkeletonView />
        </Suspense>
      </div>
    );
  }

  if ((isLoading && location.pathname === "/dashboard") || isLoading) {
    return (
      <div className="w-full min-h-screen pb-6">
        <Suspense fallback={<></>}>
          <DashboardPageSkeletonView />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <main
        className={`${user !== undefined ? "pb-28" : ""} h-screen overflow-scroll`}
      >
        {user !== undefined ? <DemiMasaHeaderView /> : <></>}
        <Outlet />
        {user !== undefined ? <NavigationView /> : <></>}
      </main>
    </>
  );
}

export { ProtectedRouteView };
