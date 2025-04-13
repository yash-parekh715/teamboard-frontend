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

    return response.data;
  },
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    // window.location.href = "/";
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
      return response.data; // This should return the user object
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Register new user
  signup: async (credentials: SignupCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/signup",
      credentials
    );

    return response.data;
  },

  checkAuthStatus: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: async () => {
    try {
      const user = await authService.checkAuthStatus();
      return !!user;
    } catch {
      return false;
    }
  },
};

export default authService;
