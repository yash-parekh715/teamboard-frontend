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
  handleGoogleRedirect: async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token with backend if needed
      return true;
    }
    return false;
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

  fetchUserProfile: async () => {
    try {
      const response = await apiClient.get("/auth/me");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
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
