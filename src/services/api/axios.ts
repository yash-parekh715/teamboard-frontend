// src/services/api/axios.ts
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosInstance } from "axios";

// Create a base axios instance with common configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for adding auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     // Try to get token from cookie via JavaScript (may not work due to HttpOnly)
//     const cookies = document.cookie.split(";");
//     let authToken = null;

//     for (const cookie of cookies) {
//       const [name, value] = cookie.trim().split("=");
//       if (name === "authToken") {
//         authToken = value;
//         break;
//       }
//     }

//     // If token exists in cookie, add it as a header
//     if (authToken) {
//       config.headers["Authorization"] = `Bearer ${authToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for handling common errors
apiClient.interceptors.response.use((response) => response);

export default apiClient;
