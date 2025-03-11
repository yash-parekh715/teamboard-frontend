// src/services/api/axios.ts
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosInstance } from "axios";

// Create a base axios instance with common configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
