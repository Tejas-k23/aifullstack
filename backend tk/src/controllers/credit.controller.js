/**
 * Credit Controller
 * Handles credit history endpoints
 */

import { getCreditHistory as getCreditHistoryService } from '../services/credit.service.js';
import { supabase } from '../config/supabase.js';
import { sendSuccess } from '../utils/response.util.js';
import logger from '../utils/logger.util.js';

/**
 * Get credit transaction history for a user
 * GET /api/credits/history/:user_id
 */
export const getCreditHistory = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    if (!user_id) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'User ID is required'
      });
    }
    
    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User not found'
      });
    }
    
    // Get credit history
    const transactions = await getCreditHistoryService(user_id, limit);
    
    return sendSuccess(res, 'Credit history retrieved successfully', {
      user_id: user_id,
      transactions: transactions,
      total: transactions.length
    });
  } catch (error) {
    logger.error('Error in getCreditHistory:', error);
    next(error);
  }
};
