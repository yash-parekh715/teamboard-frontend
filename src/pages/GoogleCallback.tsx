// src/pages/GoogleCallback.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/api/authService";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Store token and user data
      localStorage.setItem("authToken", token);

      // Fetch user details or decode token if needed
      // For now, just redirect to dashboard
      navigate("/");
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Processing Google login...</p>
    </div>
  );
};

export default GoogleCallback;
