/**
 * Authentication Routes
 * 
 * Defines all authentication-related API endpoints:
 * - POST /register - Create new user account
 * - POST /login - Authenticate existing user
 * - GET /me - Get current user profile (protected)
 * - POST /refresh - Refresh access token
 * - POST /logout - Logout and invalidate refresh token
 */

import express from 'express';
import {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  validate
} from '../schemas/auth.schema.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshAccessToken);
router.post('/logout', validate(refreshTokenSchema), logout);

// Protected routes (authentication required)
router.get('/me', authenticate, getMe);

export default router;
