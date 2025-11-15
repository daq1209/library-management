/**
 * Centralized Error Handling Middleware
 * 
 * Catches all errors and returns consistent JSON responses.
 * Logs errors for debugging in development mode.
 */

/**
 * Global error handler
 * Formats error responses and logs to console
 */
export function errorHandler(err, req, res, next) {
  // Log error details for debugging
  const timestamp = new Date().toISOString();
  console.error(`\n❌ [${timestamp}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
