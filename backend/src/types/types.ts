import { types } from 'util';

// User type declaration
export type UserType = {
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  isVerified: Boolean;
  resetPasswordToken: string;
  resetPasswordExpiresAt: Date;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
};

// Mail type declaration
export type Email = {
  to: string;
  subject: string;
  type: string;
  context: object;
};
