/**
 * User Controller
 * Handles user profile endpoints
 */

import { getOrCreateUser } from '../services/credit.service.js';
import { sendSuccess } from '../utils/response.util.js';
import logger from '../utils/logger.util.js';

/**
 * Get user profile by phone number
 * GET /api/users/:phone_number
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const { phone_number } = req.params;
    
    if (!phone_number) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Phone number is required'
      });
    }
    
    // Get or create user
    const user = await getOrCreateUser(phone_number);
    
    return sendSuccess(res, 'User profile retrieved successfully', {
      id: user.id,
      phone_number: user.phone_number,
      credits: user.credits,
      created_at: user.created_at
    });
  } catch (error) {
    logger.error('Error in getUserProfile:', error);
    next(error);
  }
};
