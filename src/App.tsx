import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";
import { AxiosProvider } from "./contexts/AxiosProvider";
import { lazy, Suspense } from "react";
import { ProtectedRouteView } from "./views/ProtectedRouteView";

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

const TaskLayoutView = lazy(() =>
  import("./views/task/TaskLayoutView").then(({ TaskLayoutView }) => ({
    default: TaskLayoutView,
  }))
);

const TaskPageView = lazy(() =>
  import("./views/task/TaskPageView").then(({ TaskPageView }) => ({
    default: TaskPageView,
  }))
);

const ErrorBoundaryView = lazy(() =>
  import("./views/ErrorBoundaryView").then(({ ErrorBoundaryView }) => ({
    default: ErrorBoundaryView,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <AuthProvider>
          <Routes>
            <Route
              element={
                <Suspense fallback={<></>}>
                  <ProtectedRouteView />
                </Suspense>
              }
              errorElement={
                <Suspense fallback={<></>}>
                  <ErrorBoundaryView />
                </Suspense>
              }
            >
              <Route
                path="/"
                element={
                  <Suspense fallback={<></>}>
                    <HomePageView />
                  </Suspense>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<></>}>
                    <DashboardPageView />
                  </Suspense>
                }
              />

              <Route
                path="/profile"
                element={
                  <Suspense fallback={<></>}>
                    <ProfilePageView />
                  </Suspense>
                }
              />

              <Route
                element={
                  <Suspense fallback={<></>}>
                    <TaskLayoutView />
                  </Suspense>
                }
              >
                <Route
                  path="/tasks"
                  element={
                    <Suspense fallback={<></>}>
                      <TaskPageView />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export { App };
