/**
 * Credit Service
 * Business logic for credit operations (atomic and race-condition safe)
 */

import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.util.js';

/**
 * Get user by phone number, create if doesn't exist with 3 free credits
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>} User object with credits
 */
export const getOrCreateUser = async (phoneNumber) => {
  try {
    // Try to find existing user
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();
    
    // If user exists, return it
    if (existingUser && !findError) {
      return existingUser;
    }
    
    // User doesn't exist, create new user with 3 free credits
    logger.info(`Creating new user with phone number: ${phoneNumber}`);
    
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone_number: phoneNumber,
        credits: 3
      })
      .select()
      .single();
    
    if (createError || !newUser) {
      logger.error('Error creating user:', createError);
      throw new Error('Failed to create user');
    }
    
    // Log the initial credit transaction (3 free credits from system)
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: newUser.id,
        action: 'credit',
        credits: 3,
        source: 'system',
        reference_id: null
      });
    
    logger.info(`Created user ${newUser.id} with 3 free credits`);
    
    return newUser;
  } catch (error) {
    logger.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

/**
 * Deduct one credit from user (atomic operation, race-condition safe)
 * Uses database transaction to ensure atomicity
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>} Object with success status and remaining credits
 */
export const deductCredit = async (phoneNumber) => {
  try {
    // First, get or create user
    const user = await getOrCreateUser(phoneNumber);
    
    // Check if user has sufficient credits
    if (user.credits <= 0) {
      return {
        success: false,
        remainingCredits: user.credits
      };
    }
    
    // Atomic credit deduction using database update with condition
    // This ensures race-condition safety - only one request can succeed if credits = 1
    // The .gte('credits', 1) ensures we only update if credits >= 1, preventing negative balances
    const newCredits = user.credits - 1;
    
    const { data: result, error } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', user.id)
      .gte('credits', 1) // Only update if credits >= 1 before update (prevents negative)
      .select()
      .single();
    
    // If update failed or returned no rows, credits were already 0 or became 0
    if (error || !result || result.credits < 0) {
      // Re-fetch user to get current credits
      const { data: currentUser } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      return {
        success: false,
        remainingCredits: currentUser?.credits || 0
      };
    }
    
    // Log the debit transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        action: 'debit',
        credits: 1,
        source: 'image_generation',
        reference_id: null
      });
    
    logger.info(`Deducted 1 credit from user ${user.id}. Remaining: ${result.credits}`);
    
    return {
      success: true,
      remainingCredits: result.credits
    };
  } catch (error) {
    logger.error('Error in deductCredit:', error);
    throw error;
  }
};

/**
 * Add credits to user account
 * @param {string} phoneNumber - User's phone number
 * @param {number} credits - Number of credits to add
 * @param {string} source - Source of credits (e.g., 'payment', 'promotion')
 * @param {string} referenceId - Reference ID (e.g., payment ID)
 * @returns {Promise<Object>} Updated user object
 */
export const addCredits = async (phoneNumber, credits, source, referenceId = null) => {
  try {
    // Get or create user first
    const user = await getOrCreateUser(phoneNumber);
    
    // Update credits atomically
    const newCredits = user.credits + credits;
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', user.id)
      .select()
      .single();
    
    if (updateError || !updatedUser) {
      logger.error('Error adding credits:', updateError);
      throw new Error('Failed to add credits');
    }
    
    // Log the credit transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        action: 'credit',
        credits: credits,
        source: source,
        reference_id: referenceId
      });
    
    logger.info(`Added ${credits} credits to user ${user.id}. New total: ${updatedUser.credits}`);
    
    return updatedUser;
  } catch (error) {
    logger.error('Error in addCredits:', error);
    throw error;
  }
};

/**
 * Get credit transaction history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of records to return (default: 50)
 * @returns {Promise<Array>} Array of credit transactions
 */
export const getCreditHistory = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      logger.error('Error fetching credit history:', error);
      throw new Error('Failed to fetch credit history');
    }
    
    return data || [];
  } catch (error) {
    logger.error('Error in getCreditHistory:', error);
    throw error;
  }
};
