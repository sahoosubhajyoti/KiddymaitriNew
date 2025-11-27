// utility/axiosInstance.ts
import axios from 'axios';

// 1. Define the interface for the items in your queue
interface FailedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;

// 2. Apply the interface to the queue array
let failedQueue: FailedRequest[] = [];

// 3. Type the error argument as 'Error | null'
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`, {}, {
          withCredentials: true
        });
        
        // Process queued requests
        processQueue(null);
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        // Cast refreshError to Error or unknown, but Error is safe here for the queue
        processQueue(refreshError as Error, null);
        
        // Clear user data and redirect
        localStorage.removeItem("user");
        window.location.href = '/Login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;