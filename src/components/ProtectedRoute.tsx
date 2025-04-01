// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/api/authService";

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  // For Google auth, check both token and session validity
  if (!isAuthenticated) {
    // Optionally: Check for potential token in URL params
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
