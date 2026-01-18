/**
 * Bot Authentication Middleware
 * Validates x-bot-secret header for bot API endpoints
 */

import config from '../config/env.js';
import { sendError } from '../utils/response.util.js';
import logger from '../utils/logger.util.js';

/**
 * Middleware to authenticate bot requests using x-bot-secret header
 */
export const authenticateBot = (req, res, next) => {
  // Skip authentication if BOT_SECRET is not configured (for testing)
  if (!config.bot.secret) {
    logger.warn('BOT_SECRET not configured, skipping bot authentication');
    return next();
  }
  const botSecret = req.headers['x-bot-secret'];
  
  if (!botSecret) {
    return sendError(res, 'Missing x-bot-secret header', 401);
  }
  
  if (botSecret !== config.bot.secret) {
    return sendError(res, 'Invalid bot secret', 401);
  }
  
  next();
};
