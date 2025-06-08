import Router from 'express';

import { AuthController } from '../controllers/auth.controller.js';

const authController = new AuthController();
const router = Router();

// Auth api routes
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/me', authController.checkAuth);

export default router;
