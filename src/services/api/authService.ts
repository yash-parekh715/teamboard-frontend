// src/services/api/authService.ts
import apiClient from "./axios";
import { LoginCredentials } from "../../components/Interfaces/LoginCredentials";
import { SignupCredentials } from "../../components/Interfaces/SignupCredentials";
import { AuthResponse } from "../../components/Interfaces/AuthResponse";
const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Store auth data
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Login with Google
  loginWithGoogle: async (tokenId: string) => {
    const response = await apiClient.post<AuthResponse>("/auth/google", {
      tokenId,
    });

    // Store auth data
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Register new user
  signup: async (credentials: SignupCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/signup",
      credentials
    );

    // Store auth data
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Get current authenticated user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;
