export interface User {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updated: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
