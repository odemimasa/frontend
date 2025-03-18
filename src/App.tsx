import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";
import { AxiosProvider } from "./contexts/AxiosProvider";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

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

const TaskPageView = lazy(() =>
  import("./views/task/TaskPageView").then(({ TaskPageView }) => ({
    default: TaskPageView,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <AxiosProvider>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
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
                path="/task"
                element={
                  <Suspense fallback={<></>}>
                    <TaskPageView />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export { App };
