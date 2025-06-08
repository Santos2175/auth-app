import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie';

export class AuthController {
  // Handler for user register
  public signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;
    try {
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          message: `All fields are required: email, password, name`,
        });
        return;
      }

      // Check if user already exists
      const userAlreadyExists = await User.findOne({ email });

      if (userAlreadyExists) {
        res
          .status(400)
          .json({ success: false, message: `User already exists` });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

      // New user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
      });

      await user.save();

      const token = generateTokenAndSetCookie(res, user._id.toString());

      res.status(201).json({
        success: true,
        message: `User created successfully`,
        user: {
          ...user.toObject(),
          password: undefined,
        },
        token,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error resgistering user.`,
        error: error.message,
      });
    }
  };

  // Handler for user login
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        res
          .status(404)
          .json({ success: false, message: `Invalid credentials.` });
        return;
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res
          .status(400)
          .json({ success: false, message: `Invalid credentials` });
        return;
      }

      // Check if email is verified
      if (!user.isVerified) {
        res
          .status(400)
          .json({
            success: false,
            message: `Email not verifed. Verification code sent, Please verify.`,
          });
        return;
      }

      user.lastLogin = new Date();
      await user.save();

      generateTokenAndSetCookie(res, user._id.toString());

      res.status(200).json({
        success: true,
        message: `User loggedin successfully`,
        user: {
          ...user.toObject(),
          password: undefined,
        },
      });
    } catch (error: any) {
      res
        .status(500)
        .json({
          success: false,
          message: `User login failed`,
          error: error.message,
        });
    }
  };

  // Handler for user logout
  public logout = (req: Request, res: Response) => {
    try {
    } catch (error: any) {}
  };

  // Handler to verify email
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (error: any) {}
  };

  // Handler to reset password
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (error: any) {}
  };

  // Handler to reset password if forgotten
  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
    } catch (error: any) {}
  };

  // Handler to get the detail of currently authenticated user
  public checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
    } catch (error: any) {}
  };
}
