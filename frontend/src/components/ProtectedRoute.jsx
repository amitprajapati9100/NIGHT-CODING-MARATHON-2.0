import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
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
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
