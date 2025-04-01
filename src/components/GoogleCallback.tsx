// src/pages/GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/api/authService";
import ErrorAlert from "../components/ErrorAlert";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error("Authentication failed: No token received");
        }

        // Store the token
        localStorage.setItem("authToken", token);

        // Optional: Fetch user data using the token
        const user = await authService.getCurrentUser();

        // Redirect to dashboard
        navigate("/");
      } catch (err) {
        navigate("/", {
          state: {
            error: err instanceof Error ? err.message : "Authentication failed",
          },
        });
      }
    };

    handleAuthentication();
  }, [token, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Processing Google authentication...
        </p>

        {error && (
          <div className="mt-4 max-w-md mx-auto">
            <ErrorAlert error={error} onClose={() => navigate("/login")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
