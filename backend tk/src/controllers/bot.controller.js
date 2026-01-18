/**
 * Bot Controller
 * Handles bot API endpoints (check credits, deduct credits)
 */

import { getOrCreateUser, deductCredit } from '../services/credit.service.js';
import { sendSuccess, sendStatus } from '../utils/response.util.js';
import logger from '../utils/logger.util.js';

/**
 * Get remaining credits for a phone number
 * GET /api/bot/credits/:phone_number
 */
export const getCredits = async (req, res, next) => {
  try {
    const { phone_number } = req.params;
    
    if (!phone_number) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Phone number is required'
      });
    }
    
    // Get or create user (auto-creates with 3 free credits if new)
    const user = await getOrCreateUser(phone_number);
    
    const message = user.credits > 0
      ? `You have ${user.credits} credit${user.credits !== 1 ? 's' : ''} remaining.`
      : 'You have no credits remaining.';
    
    return sendSuccess(res, message, {
      remaining_credits: user.credits,
      user_exists: true
    });
  } catch (error) {
    logger.error('Error in getCredits:', error);
    next(error);
  }
};

/**
 * Deduct one credit after successful image generation
 * POST /api/bot/deduct
 */
export const deductCredits = async (req, res, next) => {
  try {
    const { phone_number } = req.body;
    
    if (!phone_number) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Phone number is required'
      });
    }
    
    // Deduct credit (atomic operation, race-condition safe)
    const result = await deductCredit(phone_number);
    
    if (!result.success) {
      // Insufficient credits
      return sendStatus(
        res,
        'INSUFFICIENT_CREDITS',
        'You have no credits left. Please purchase a plan to continue.',
        { remaining_credits: result.remainingCredits },
        200
      );
    }
    
    // Success - credit deducted
    const message = result.remainingCredits > 0
      ? `Image generated successfully. You have ${result.remainingCredits} credit${result.remainingCredits !== 1 ? 's' : ''} remaining.`
      : 'Image generated successfully. You have no credits remaining.';
    
    return sendSuccess(res, message, {
      remaining_credits: result.remainingCredits
    });
  } catch (error) {
    logger.error('Error in deductCredits:', error);
    next(error);
  }
};
