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
// import { shallow } from 'zustand/shallow';

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

// export const useAuth = () => useAuthStore(authSelector, shallow);

// export const useAuthActions = () => useAuthStore((state) => state.actions);

import { create } from 'zustand';
import type {
  ApiError,
  LoginCredentials,
  SignupData,
  User,
} from '../types/auth';
import { authApi } from '../lib/api/auth';
import { shallow } from 'zustand/shallow';

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
export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialState,

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  signup: async (userData: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signup(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      set({
        ...initialState,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await authApi.checkAuth();
      set({
        user: response.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isCheckingAuth: false });
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.forgotPassword(email);
      set({ message: response.message, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.resetPassword(token, password);
      set({ message: response.message, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.verifyEmail(email);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },
}));

export const useAuthActions = () =>
  useAuthStore((state) => ({
    clearError: state.clearError,
    clearMessage: state.clearMessage,
    setLoading: state.setLoading,
    signup: state.signup,
    login: state.login,
    logout: state.logout,
    verifyEmail: state.verifyEmail,
    checkAuth: state.checkAuth,
    forgotPassword: state.forgotPassword,
    resetPassword: state.resetPassword,
  }));

export const useAuth = () =>
  useAuthStore(
    (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      isCheckingAuth: state.isCheckingAuth,
      error: state.error,
      message: state.message,
    }),
    shallow
  );
