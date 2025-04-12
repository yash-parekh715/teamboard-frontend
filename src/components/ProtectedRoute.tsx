import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = () => {
  const { user, loading } = useUser();
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { user, loading });
  }, [user, loading]);

  // While checking authentication, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
