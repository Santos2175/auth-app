import express from 'express';

import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const authController = new AuthController();
const router = express.Router();

// Auth api routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/me', authenticate, authController.checkAuth);

export default router;
