export const BASE_URL =
  import.meta.env.VITE_ENV === 'development'
    ? import.meta.env.VITE_BASE_URL
    : '/api/auth';

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    CHECK_AUTH: '/api/auth/me',
  },
};
