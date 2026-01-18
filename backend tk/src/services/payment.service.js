/**
 * Payment Service
 * Razorpay payment integration
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/env.js';
import logger from '../utils/logger.util.js';

// Initialize Razorpay instance (only if keys are available)
export const razorpay = config.razorpay.keyId && config.razorpay.keySecret 
  ? new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret
    })
  : null;

/**
 * Create a Razorpay order
 * @param {number} amount - Order amount in smallest currency unit (paise for INR)
 * @param {string} currency - Currency code (default: 'INR')
 * @param {Object} options - Additional options (receipt, notes, etc.)
 * @returns {Promise<Object>} Razorpay order object
 */
export const createOrder = async (amount, currency = 'INR', options = {}) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
    }
    const orderData = {
      amount: Math.round(amount), // Ensure amount is in paise (smallest currency unit)
      currency: currency,
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes || {}
    };
    
    logger.info('Creating Razorpay order:', orderData);
    
    const order = await razorpay.orders.create(orderData);
    
    logger.info('Razorpay order created:', order.id);
    
    return order;
  } catch (error) {
    logger.error('Error creating Razorpay order:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
export const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const secret = config.razorpay.keySecret;
    if (!secret) {
      logger.error('Razorpay key secret not configured');
      return false;
    }

    // 1. Generate the expected signature
    const signatureString = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signatureString)
      .digest('hex');

    // 2. DIAGNOSTIC LOGS
    console.log("--- SIGNATURE VERIFICATION ---");
    console.log("String constructed:", signatureString);
    console.log("Expected Hash:", expectedSignature);
    console.log("Received Hash:", razorpaySignature);

    // 3. SAFE COMPARISON
    // We check length first to prevent timingSafeEqual from crashing the server
    if (!razorpaySignature || expectedSignature.length !== razorpaySignature.length) {
      logger.error("Signature length mismatch or missing signature");
      return false;
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

    logger.info(`Payment verification for order ${razorpayOrderId}: ${isValid ? 'VALID' : 'INVALID'}`);
    return isValid;
  } catch (error) {
    logger.error('Error verifying payment:', error);
    return false;
  }
};

/**
 * Verify Razorpay webhook signature
 * @param {Buffer|string} rawBody - Raw request body
 * @param {string} signature - X-Razorpay-Signature header
 * @returns {boolean} True if signature is valid
 */
export const verifyWebhook = (rawBody, signature) => {
  try {
    const secret = config.razorpay.webhookSecret;
    if (!secret) {
      logger.error('Razorpay webhook secret not configured');
      return false;
    }
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    // SAFE COMPARISON
    if (!signature || expectedSignature.length !== signature.length) {
      logger.error("Webhook signature length mismatch or missing signature");
      return false;
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    logger.info(`Webhook signature verification: ${isValid ? 'VALID' : 'INVALID'}`);

    return isValid;
  } catch (error) {
    logger.error('Error verifying webhook:', error);
    return false;
  }
};
