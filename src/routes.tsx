import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "@components/RootLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AxiosProvider } from "./contexts/AxiosProvider";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
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
            <Home />
          </Suspense>
        ),
      },

      {
        path: "dashboard",
        element: (
          <Suspense fallback={<></>}>
            <Dashboard />
          </Suspense>
        ),
      },

      {
        path: "profile",
        element: (
          <Suspense fallback={<></>}>
            <Profile />
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
