/**
 * Authentication Middleware
 * 
 * Verifies JWT access tokens and attaches user info to request object.
 * Protects routes that require authentication.
 */

import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware to verify JWT access token
 * Extracts token from Authorization header and validates it
 */
export function authenticate(req, res, next) {
  try {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode token
    const decoded = verifyAccessToken(token);

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid access token'
    });
  }
}

/**
 * Middleware to check if user has required role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}
