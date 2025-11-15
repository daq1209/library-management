/**
 * Authentication Validation Schemas
 * 
 * Defines input validation rules using Zod for auth endpoints.
 * Ensures data integrity and provides clear error messages.
 */

import { z } from 'zod';

/**
 * Register schema
 * Validates user registration data
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .trim(),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
});

/**
 * Login schema
 * Validates user login credentials
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim(),
  
  password: z
    .string()
    .min(1, 'Password is required')
});

/**
 * Refresh token schema
 * Validates refresh token request
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
});

/**
 * Middleware to validate request body against a schema
 * @param {ZodSchema} schema - Zod validation schema
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
}
