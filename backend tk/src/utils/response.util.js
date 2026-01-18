/**
 * Response Utility
 * Centralized JSON response helper for consistent API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = {
    status: 'SUCCESS',
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} data - Additional error data
 */
export const sendError = (res, message, statusCode = 400, data = null) => {
  const response = {
    status: 'ERROR',
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send custom status response (e.g., INSUFFICIENT_CREDITS)
 * @param {Object} res - Express response object
 * @param {string} status - Custom status string
 * @param {string} message - Message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 */
export const sendStatus = (res, status, message, data = null, statusCode = 200) => {
  const response = {
    status,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};
