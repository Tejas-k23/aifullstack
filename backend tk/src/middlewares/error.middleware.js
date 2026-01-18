/**
 * Error Handling Middleware
 * Centralized error handling for Express app
 */

import logger from '../utils/logger.util.js';
import { sendError } from '../utils/response.util.js';
import config from '../config/env.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  
  // Handle known error types
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400);
  }
  
  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized', 401);
  }
  
  // Default error response
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';
  
  const statusCode = err.statusCode || 500;
  
  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.method} ${req.path} not found`, 404);
};
