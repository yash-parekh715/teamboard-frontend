// src/pages/GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      console.error("Authentication error:", error);
      navigate("/", {
        state: { error: "Authentication failed" },
      });
      return;
    }

    const checkAuthStatus = async () => {
      try {
        await refreshUser();
        navigate("/dashboard");
      } catch (error) {
        console.error("Error checking auth status:", error);
        navigate("/"); // Redirect to login page if there's an error
      }
    };

    checkAuthStatus();
  }, [navigate, searchParams, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
