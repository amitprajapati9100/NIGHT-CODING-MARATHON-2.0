import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f5f3ec]">
    <div className="rounded-4xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.25em] text-orange-500">
        Loading
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Preparing your workspace...
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "18px",
            padding: "14px 16px",
            fontSize: "14px",
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
