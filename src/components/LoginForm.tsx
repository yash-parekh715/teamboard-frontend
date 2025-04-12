import React, { useState } from "react";
import { motion } from "framer-motion";
import { GoogleIcon } from "../components/UI/Icons";
import authService from "../services/api/authService";
import LoginFormProps from "../components/Interfaces/LoginFormProps";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { useUser } from "../contexts/UserContext";

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        // Redirect to dashboard on successful login
        await refreshUser();
        navigate("/dashboard");
        console.log("Login successful", response);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google?redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}`;
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      id="login"
    >
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon className="text-xl" />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-pale-50 text-gray-500">OR</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          // disabled={loading}
          className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer"
        >
          Sign up
        </button>
      </p>
    </motion.div>
  );
};

export default LoginForm;
