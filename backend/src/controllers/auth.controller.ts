import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendEmail } from '../utils/sendEmail.js';

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
      const verificationToken = Math.floor(
        10000 + Math.random() * 900000
      ).toString();
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

      // Send email verification mail
      sendEmail({
        to: user.email,
        subject: 'Email Verification',
        type: 'emailVerification',
        context: {
          name,
          verificationToken,
        },
      });

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
        // Generate verification token
        const verificationToken = Math.floor(
          10000 + Math.random() * 900000
        ).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.updateOne({
          $set: { verificationToken, verificationTokenExpiresAt },
        });

        // Send email verification mail
        sendEmail({
          to: user.email,
          subject: 'Email Verification',
          type: 'emailVerification',
          context: {
            name: user.name,
            verificationToken,
          },
        });

        res.status(400).json({
          success: false,
          message: `Email not verifed. Verification code sent, Please verify.`,
        });
        return;
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateTokenAndSetCookie(res, user._id.toString());

      res.status(200).json({
        success: true,
        message: `User loggedin successfully`,
        user: {
          ...user.toObject(),
          password: undefined,
        },
        token,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `User login failed`,
        error: error.message,
      });
    }
  };

  // Handler for user logout
  public logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: `Logged out successfully` });
  };

  // Handler to verify email
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    try {
      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: `Invalid or expired verification code`,
        });
        return;
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      res.status(200).json({
        success: true,
        message: `Email verified successfully.`,
        user: { ...user.toObject(), password: undefined },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in email verification.`,
        error: error.message,
      });
    }
  };

  // Handler to reset password if forgotten
  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ success: false, message: `User not found` });
        return;
      }

      const resetPasswordToken = crypto.randomBytes(20).toString('hex');
      const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

      await user.updateOne({
        $set: { resetPasswordToken, resetPasswordExpiresAt },
      });

      // Send password reset email
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

      sendEmail({
        to: user.email,
        subject: 'Reset Password Request',
        type: 'passwordResetRequest',
        context: {
          resetUrl,
        },
      });

      res.status(200).json({
        success: true,
        message: `Password reset link sent to your email`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };

  // Handler to reset password
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        res
          .status(400)
          .json({ success: false, message: 'Invalid or expired reset token' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;

      await user.save();

      sendEmail({
        to: user.email,
        subject: 'Password reset success',
        type: 'passwordResetSuccess',
      });

      res
        .status(200)
        .json({ success: true, message: `Password reset successfully` });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error occured during password reset`,
        error: error.message,
      });
    }
  };

  // Handler to get the detail of currently authenticated user
  public checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.userId).select('-password');

      if (!user) {
        res.status(404).json({ success: false, message: `User not found` });
        return;
      }

      res.status(200).json({ succes: true, user });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Error in checking auth`,
        error: error.message,
      });
    }
  };
}
