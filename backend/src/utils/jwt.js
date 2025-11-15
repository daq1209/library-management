/**
 * JWT Token Utility
 * 
 * Handles creation and verification of JSON Web Tokens for authentication.
 * Supports both access tokens (short-lived) and refresh tokens (long-lived).
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

/**
 * Generate an access token
 * @param {object} payload - User data to encode (e.g., { userId, email, role })
 * @returns {string} - Signed JWT access token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

/**
 * Generate a refresh token
 * @param {object} payload - User data to encode
 * @returns {string} - Signed JWT refresh token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

/**
 * Verify an access token
 * @param {string} token - JWT access token
 * @returns {object} - Decoded payload
 * @throws {Error} - If token is invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Verify a refresh token
 * @param {string} token - JWT refresh token
 * @returns {object} - Decoded payload
 * @throws {Error} - If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/**
 * Generate both access and refresh tokens
 * @param {object} user - User object with id, email, role
 * @returns {object} - { accessToken, refreshToken }
 */
export function generateTokenPair(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
}
