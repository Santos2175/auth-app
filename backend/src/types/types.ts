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
