import { Response } from 'express';
import jwt from 'jsonwebtoken';

// Utility function to generate token and set cookie
export const generateTokenAndSetCookie = (
  res: Response,
  userId: string
): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
