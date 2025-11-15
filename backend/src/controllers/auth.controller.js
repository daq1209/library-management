/**
 * Authentication Controller
 * 
 * Handles all authentication-related business logic:
 * - User registration
 * - User login
 * - Token refresh
 * - User logout
 * - Get current user profile
 */

import { randomUUID } from 'crypto';
import db from '../config/db.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../middlewares/error.js';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Read current database
    await db.read();

    // Check if email already exists (case-insensitive)
    const existingUser = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      role: 'reader', // Default role
      createdAt: new Date().toISOString()
    };

    // Add user to database
    db.data.users.push(newUser);
    await db.write();

    // Generate tokens
    const tokens = generateTokenPair(newUser);

    // Store refresh token in database
    db.data.tokens.push({
      userId: newUser.id,
      refreshToken: tokens.refreshToken,
      createdAt: new Date().toISOString()
    });
    await db.write();

    // Prepare user response (without password hash)
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    console.log(`✅ User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      tokens
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login existing user
 * POST /api/v1/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Read database
    await db.read();

    // Find user by email (case-insensitive)
    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate new tokens
    const tokens = generateTokenPair(user);

    // Store refresh token
    db.data.tokens.push({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      createdAt: new Date().toISOString()
    });
    await db.write();

    // Prepare user response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    console.log(`✅ User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      tokens
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile
 * GET /api/v1/auth/me
 * Requires authentication
 */
export async function getMe(req, res, next) {
  try {
    const { userId } = req.user;

    // Read database
    await db.read();

    // Find user
    const user = db.data.users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Prepare user response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export async function refreshAccessToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Read database
    await db.read();

    // Check if refresh token exists in database
    const tokenExists = db.data.tokens.find(
      t => t.refreshToken === refreshToken && t.userId === decoded.userId
    );

    if (!tokenExists) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Find user
    const user = db.data.users.find(u => u.id === decoded.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Generate new access token
    const tokens = generateTokenPair(user);

    console.log(`✅ Token refreshed for: ${user.email}`);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;

    // Read database
    await db.read();

    // Remove refresh token from database
    const initialLength = db.data.tokens.length;
    db.data.tokens = db.data.tokens.filter(t => t.refreshToken !== refreshToken);
    
    if (db.data.tokens.length < initialLength) {
      await db.write();
      console.log(`✅ User logged out successfully`);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
}
