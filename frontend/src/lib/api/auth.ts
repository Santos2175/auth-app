import type { LoginCredentials, SignupData } from '../../types/auth';
import { apiClient } from './client';
import { API_PATHS } from './config';

// Auth Api
export const authApi = {
  signup: async (data: SignupData) => {
    const response = await apiClient.post(API_PATHS.AUTH.SIGNUP, data);
    return response.data;
  },

  login: async (data: LoginCredentials) => {
    const response = await apiClient.post(API_PATHS.AUTH.LOGIN, data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(API_PATHS.AUTH.LOGOUT);
    return response.data;
  },
  verifyEmail: async (code: string) => {
    const response = await apiClient.post(API_PATHS.AUTH.VERIFY_EMAIL, {
      code,
    });
    return response.data;
  },
  checkAuth: async () => {
    const response = await apiClient.post(API_PATHS.AUTH.CHECK_AUTH);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post(
      `${API_PATHS.AUTH.RESET_PASSWORD}/${token}`,
      { password }
    );
    return response.data;
  },
};
