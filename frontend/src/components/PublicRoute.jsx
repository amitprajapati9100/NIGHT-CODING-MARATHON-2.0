import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ec]">
        <div className="rounded-4xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-500">
            Loading
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
