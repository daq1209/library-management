/**
 * HTTP Client with Automatic Token Refresh
 * 
 * Features:
 * - Attaches Authorization header automatically
 * - Intercepts 401 errors and refreshes token
 * - Retries failed request once after refresh
 * - Centralized error handling
 */

import axios from "axios";

// 🔧 Backend của bạn đang chạy PORT=4000 trong .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Request interceptor - Attach access token
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('novalib_access_token');
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 and refresh token
 */
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return http(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('novalib_refresh_token');

    if (!refreshToken) {
      isRefreshing = false;
      // Clear invalid session
      localStorage.removeItem('novalib_access_token');
      localStorage.removeItem('novalib_refresh_token');
      localStorage.removeItem('novalib_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Call refresh endpoint
      const response = await axios.post(
        `${BASE_URL}/v1/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );

      const { accessToken } = response.data;

      // Update stored token
      localStorage.setItem('novalib_access_token', accessToken);

      // Update original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process queued requests
      processQueue(null, accessToken);

      isRefreshing = false;

      // Retry original request
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;

      // Refresh failed - clear session and redirect to login
      localStorage.removeItem('novalib_access_token');
      localStorage.removeItem('novalib_refresh_token');
      localStorage.removeItem('novalib_user');
      
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);
