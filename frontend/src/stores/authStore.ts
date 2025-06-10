import { create } from 'zustand';
import type { LoginCredentials, SignupData, User } from '../types/auth';
import { toast } from 'react-hot-toast';
import { apiClient } from '../lib/api/client';
import { API_PATHS } from '../lib/api/config';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  message: string | null;
}

// Auth action interface
interface AuthActions {
  clearError: () => void;
  clearMessage: () => void;
  setLoading: (isLoading: boolean) => void;
  signup: (userData: SignupData) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Combine AuthState and AuthActions
type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  message: null,
};

// Create auth store
export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  signup: async (userData: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(API_PATHS.AUTH.SIGNUP, userData);
      set({
        user: response?.data?.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      toast.success(response.data?.message);
      console.log('Success Response', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(API_PATHS.AUTH.LOGIN, credentials);
      set({
        user: response?.data?.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success(response?.data?.message);
    } catch (err: any) {
      const errorMessage = err?.message || 'Login Failed';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);

      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post(API_PATHS.AUTH.LOGOUT);
      set({
        ...initialState,
      });
      toast.success('User logged out successfully');
    } catch (err: any) {
      const errorMessage = err?.message || 'Error logging out';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await apiClient.get(API_PATHS.AUTH.CHECK_AUTH);
      set({
        user: response.data?.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Error occured in fetching user';
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw new Error(errorMessage);
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      set({ message: response?.data?.message, isLoading: false });
      toast.success(response.data?.message);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error sending reset password email';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(
        API_PATHS.AUTH.RESET_PASSWORD(token),
        { password }
      );
      set({ message: response?.data?.message, isLoading: false });
      toast.success(response?.data?.message);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error resetting password';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(API_PATHS.AUTH.VERIFY_EMAIL, {
        code,
      });
      set({
        user: response?.data?.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Error verifying email';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
}));

// For optimization to prevent infinite re-renders
// Use it with - createWithEqualityFn from 'zustand/traditional'

// export const useAuthActions = () =>
//   useAuthStore(
//     (state) => ({
//       clearError: state.clearError,
//       clearMessage: state.clearMessage,
//       setLoading: state.setLoading,
//       signup: state.signup,
//       login: state.login,
//       logout: state.logout,
//       verifyEmail: state.verifyEmail,
//       checkAuth: state.checkAuth,
//       forgotPassword: state.forgotPassword,
//       resetPassword: state.resetPassword,
//     }),
//     shallow
//   );

// export const useAuth = () =>
//   useAuthStore(
//     (state) => ({
//       user: state.user,
//       isAuthenticated: state.isAuthenticated,
//       isLoading: state.isLoading,
//       isCheckingAuth: state.isCheckingAuth,
//       error: state.error,
//       message: state.message,
//     }),
//     shallow
//   );

// For more control and structured method

// import { create } from 'zustand';
// import type {
//   ApiError,
//   LoginCredentials,
//   SignupData,
//   User,
// } from '../types/auth';
// import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
// import { immer } from 'zustand/middleware/immer';
// import { authApi } from '../lib/api/auth';

// // Auth state interface
// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   isCheckingAuth: boolean;
//   error: string | null;
//   message: string | null;
// }

// // Auth action interface
// interface AuthActions {
//   actions: {
//     clearError: () => void;
//     clearMessage: () => void;
//     setLoading: (isLoading: boolean) => void;
//     signup: (userData: SignupData) => Promise<void>;
//     login: (credentials: LoginCredentials) => Promise<void>;
//     logout: () => Promise<void>;
//     verifyEmail: (code: string) => void;
//     checkAuth: () => Promise<void>;
//     forgotPassword: (email: string) => Promise<void>;
//     resetPassword: (token: string, password: string) => Promise<void>;
//   };
// }

// // Combine AuthState and AuthActions
// type AuthStore = AuthState & AuthActions;

// // Initial state
// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,
//   isCheckingAuth: false,
//   error: null,
//   message: null,
// };

// // Create auth store
// export const useAuthStore = create<AuthStore>()(
//   devtools(
//     persist(
//       subscribeWithSelector(
//         immer<AuthStore>((set, _) => ({
//           ...initialState,

//           actions: {
//             // Clear error state
//             clearError: (): void => {
//               set((state) => {
//                 state.error = null;
//               });
//             },

//             // Clear message
//             clearMessage: (): void => {
//               set((state) => {
//                 state.message = null;
//               });
//             },

//             //  Set Loading state
//             setLoading: (isLoading: boolean): void => {
//               set((state) => {
//                 state.isLoading = isLoading;
//               });
//             },

//             // Sign up user
//             signup: async (userData: SignupData): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });

//               try {
//                 const response = await authApi.signup(userData);
//                 set((state) => {
//                   state.user = response.user;
//                   state.isAuthenticated = true;
//                   state.isLoading = false;
//                   state.error = null;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isLoading = false;
//                 });
//                 throw error;
//               }
//             },

//             // Login user
//             login: async (credentials: LoginCredentials): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });

//               try {
//                 const response = await authApi.login(credentials);
//                 set((state) => {
//                   state.user = response.user;
//                   state.isAuthenticated = true;
//                   state.isLoading = false;
//                   state.error = null;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isLoading = false;
//                 });
//                 throw error;
//               }
//             },

//             // Logout user
//             logout: async (): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });

//               try {
//                 const response = await authApi.logout();

//                 set((state) => {
//                   Object.assign(state, {
//                     ...initialState,
//                     actions: state.actions,
//                   });
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isLoading = false;
//                 });
//                 throw error;
//               }
//             },

//             // check auth
//             checkAuth: async (): Promise<void> => {
//               set((state) => {
//                 (state.isCheckingAuth = true), (state.error = null);
//               });

//               try {
//                 const response = await authApi.checkAuth();

//                 set((state) => {
//                   state.user = response.user;
//                   state.isAuthenticated = true;
//                   state.isCheckingAuth = false;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isCheckingAuth = false;
//                 });
//                 throw error;
//               }
//             },

//             // Forgot password
//             forgotPassword: async (email: string): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });

//               try {
//                 const response = await authApi.forgotPassword(email);
//                 set((state) => {
//                   state.message = response.message;
//                   state.isLoading = false;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.isLoading = false;
//                   state.error = apiError.message;
//                 });
//                 throw error;
//               }
//             },

//             // Reset password
//             resetPassword: async (
//               token: string,
//               password: string
//             ): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });
//               try {
//                 const response = await authApi.resetPassword(token, password);
//                 set((state) => {
//                   state.isLoading = false;
//                   state.message = response.message;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isLoading = false;
//                 });

//                 throw error;
//               }
//             },

//             // Verify email
//             verifyEmail: async (email: string): Promise<void> => {
//               set((state) => {
//                 state.isLoading = true;
//                 state.error = null;
//               });

//               try {
//                 const response = await authApi.verifyEmail(email);

//                 set((state) => {
//                   state.user = response.user;
//                   state.isLoading = false;
//                   state.isAuthenticated = true;
//                 });
//               } catch (error) {
//                 const apiError = error as ApiError;
//                 set((state) => {
//                   state.error = apiError.message;
//                   state.isLoading = false;
//                 });

//                 throw error;
//               }
//             },
//           },
//         }))
//       ),
//       {
//         name: 'auth-store',
//         partialize: (state) => ({
//           user: state.user,
//           isAuthenticated: state.isAuthenticated,
//           //   lastAuthCheck: state.lastAuthCheck,
//         }),
//       }
//     ),
//     { name: 'auth-store' }
//   )
// );

// const authSelector = (state: AuthState) => ({
//   user: state.user,
//   isAuthenticated: state.isAuthenticated,
//   isLoading: state.isLoading,
//   isCheckingAuth: state.isCheckingAuth,
//   error: state.error,
//   message: state.message,
// });

// export const useAuth = () => useAuthStore(authSelector);

// export const useAuthActions = () => useAuthStore((state) => state.actions);
