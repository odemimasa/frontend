import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "@components/RootLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AxiosProvider } from "./contexts/AxiosProvider";

const HomePageView = lazy(() =>
  import("./views/home/HomePageView").then(({ HomePageView }) => ({
    default: HomePageView,
  }))
);

const DashboardPageView = lazy(() =>
  import("./views/dashboard/DashboardPageView").then(
    ({ DashboardPageView }) => ({
      default: DashboardPageView,
    })
  )
);

const ProfilePageView = lazy(() =>
  import("./views/profile/ProfilePageView").then(({ ProfilePageView }) => ({
    default: ProfilePageView,
  }))
);

const ToDoList = lazy(() => import("./pages/ToDoList"));

const ErrorBoundary = lazy(() =>
  import("@components/ErrorBoundary").then(({ ErrorBoundary }) => ({
    default: ErrorBoundary,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <AxiosProvider>
          <RootLayout />
        </AxiosProvider>
        <Analytics />
        <SpeedInsights />
      </>
    ),
    errorElement: (
      <Suspense fallback={<></>}>
        <ErrorBoundary />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<></>}>
            <HomePageView />
          </Suspense>
        ),
      },

      {
        path: "dashboard",
        element: (
          <Suspense fallback={<></>}>
            <DashboardPageView />
          </Suspense>
        ),
      },

      {
        path: "profile",
        element: (
          <Suspense fallback={<></>}>
            <ProfilePageView />
          </Suspense>
        ),
      },

      {
        path: "to-do-list",
        element: (
          <Suspense fallback={<></>}>
            <ToDoList />
          </Suspense>
        ),
      },
    ],
  },
]);
