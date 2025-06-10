import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiError } from '../../types/auth';
import { BASE_URL } from './config';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    // Normalize error structure
    const normalizedError: ApiError = {
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        'An error occured',
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  }
);
