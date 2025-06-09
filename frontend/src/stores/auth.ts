import { create } from 'zustand';
import type {
  ApiError,
  LoginCredentials,
  SignupData,
  User,
} from '../types/auth';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authApi } from '../lib/api/auth';

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
  actions: {
    clearError: () => void;
    clearMessage: () => void;
    setLoading: (isLoading: boolean) => void;
    signup: (userData: SignupData) => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (code: string) => void;
    checkAuth: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
  };
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
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer<AuthStore>((set, _) => ({
          ...initialState,

          actions: {
            // Clear error state
            clearError: (): void => {
              set((state) => {
                state.error = null;
              });
            },

            // Clear message
            clearMessage: (): void => {
              set((state) => {
                state.message = null;
              });
            },

            //  Set Loading state
            setLoading: (isLoading: boolean): void => {
              set((state) => {
                state.isLoading = isLoading;
              });
            },

            // Sign up user
            signup: async (userData: SignupData): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              try {
                const response = await authApi.signup(userData);
                set((state) => {
                  state.user = response.user;
                  state.isAuthenticated = true;
                  state.isLoading = false;
                  state.error = null;
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError.message;
                  state.isLoading = false;
                });
                throw error;
              }
            },

            // Login user
            login: async (credentials: LoginCredentials): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              try {
                const response = await authApi.login(credentials);
                set((state) => {
                  state.user = response.user;
                  state.isAuthenticated = true;
                  state.isLoading = false;
                  state.error = null;
                  state.lastAuthCheck = Date.now();
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError.message;
                  state.isLoading = false;
                });
                throw error;
              }
            },

            // Logout user
            logout: async (): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              try {
                const response = await authApi.logout();

                set((state) => {
                  Object.assign(state, {
                    ...initialState,
                    actions: state.actions,
                  });
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError.message;
                  state.isLoading = false;
                });
                throw error;
              }
            },

            // check auth
            checkAuth: async (): Promise<void> => {
              set((state) => {
                (state.isCheckingAuth = true), (state.error = null);
              });

              try {
                const response = await authApi.checkAuth();

                set((state) => {
                  state.user = response.user;
                  state.isAuthenticated = true;
                  state.isCheckingAuth = false;
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError;
                  state.isCheckingAuth = false;
                });
                throw error;
              }
            },

            // Forgot password
            forgotPassword: async (email: string): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              try {
                const response = await authApi.forgotPassword(email);
                set((state) => {
                  state.message = response.message;
                  state.isLoading = false;
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.isLoading = false;
                  state.error = apiError.message;
                });
                throw error;
              }
            },

            // Reset password
            resetPassword: async (
              token: string,
              password: string
            ): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });
              try {
                const response = await authApi.resetPassword(token, password);
                set((state) => {
                  state.isLoading = false;
                  state.message = response.message;
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError.message;
                  state.isLoading = false;
                });

                throw error;
              }
            },

            // Verify email
            verifyEmail: async (email: string): Promise<void> => {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              try {
                const response = await authApi.verifyEmail(email);

                set((state) => {
                  state.user = response.user;
                  state.isLoading = false;
                  state.isAuthenticated = true;
                });
              } catch (error) {
                const apiError = error as ApiError;
                set((state) => {
                  state.error = apiError.message;
                  state.isLoading = false;
                });

                throw error;
              }
            },
          },
        }))
      ),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          //   lastAuthCheck: state.lastAuthCheck,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

export const useAuth = () =>
  useAuthStore(
    (state): Partial<AuthState> => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      isCheckingAuth: state.isCheckingAuth,
    })
  );

export const useAuthActions = () => useAuthStore((state) => state.actions);
