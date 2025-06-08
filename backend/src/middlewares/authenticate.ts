import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Payload } from '../types/types';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if token is present
  const token = req.cookies.token;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: `Unauthorized - no token provided.` });
    return;
  }

  try {
    // Check token validation by decoding it
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

    if (!decoded) {
      res
        .status(401)
        .json({ success: false, message: `Unauthorized - invalid token` });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Error in token verification`,
      error: error.message,
    });
    return;
  }
};
