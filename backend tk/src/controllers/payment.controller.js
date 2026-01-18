/**
 * Payment Controller
 * Handles Razorpay payment endpoints and database synchronization
 */

import { createOrder as createRazorpayOrder, verifyPayment as verifyRazorpayPayment, verifyWebhook as verifyRazorpayWebhook, razorpay } from '../services/payment.service.js';
import { addCredits } from '../services/credit.service.js';
import { supabase } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import logger from '../utils/logger.util.js';

/**
 * Create Razorpay order
 * POST /api/payments/create-order
 */
export const createOrder = async (req, res, next) => {
  try {
    const { package_id, phone_number } = req.body;
    
    if (!package_id || !phone_number) {
      return sendError(res, 'Package ID and phone number are required', 400);
    }
    
    // Get package details
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();
    
    if (packageError || !packageData) {
      return sendError(res, 'Package not found', 404);
    }
    
    // Create Razorpay order (amount in paise)
    const amount = Math.round(packageData.price * 100); 
    
    const order = await createRazorpayOrder(amount, 'INR', {
      receipt: `receipt_${Date.now()}_${package_id}`,
      notes: {
        package_id: package_id.toString(),
        phone_number: phone_number,
        credits: packageData.credits.toString()
      }
    });
    
    return sendSuccess(res, 'Order created successfully', {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      package: {
        id: packageData.id,
        name: packageData.name,
        credits: packageData.credits,
        price: packageData.price
      }
    });
  } catch (error) {
    logger.error('Error in createPaymentOrder:', error);
    next(error);
  }
};

/**
 * Verify Razorpay payment and credit user account
 * POST /api/payments/verify
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      phone_number,
      package_id
    } = req.body;
    
    logger.info(`Attempting verification for Order: ${razorpay_order_id}`);

    // 1. Validate input fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !phone_number || !package_id) {
      return sendError(res, 'All payment verification fields are required', 400);
    }
    
    // 2. Verify payment signature
    const isValid = verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      logger.error(`Invalid signature for order ${razorpay_order_id}`);
      return sendError(res, 'Invalid payment signature', 400);
    }
    
    // 3. Find User UUID from Phone Number (Required for your SQL schema)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', phone_number)
      .single();

    if (userError || !userData) {
      logger.error(`User search error for ${phone_number}: ${userError?.message}`);
      return sendError(res, 'User profile not found. Please register first.', 404);
    }

    // 4. Get package details to determine credits and price
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();
    
    if (packageError || !packageData) {
      return sendError(res, 'Package details not found', 404);
    }
    
    // 5. Insert into payments table (Matching your provided SQL schema)
    const { error: dbPaymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: userData.id,
        amount: packageData.price,
        payment_gateway: 'razorpay',
        gateway_order_id: razorpay_order_id,
        gateway_payment_id: razorpay_payment_id,
        status: 'success',
        package_id: package_id
      }]);

    if (dbPaymentError) {
      logger.error(`Database payment logging error: ${dbPaymentError.message}`);
      // We continue because the user has already paid, but we log the error
    }

    // 6. Credit user account
    const updatedUser = await addCredits(
      phone_number,
      packageData.credits,
      'payment',
      razorpay_payment_id
    );
    
    logger.info(`Success: ${packageData.credits} credits added to User UUID ${userData.id}`);
    
    return sendSuccess(res, 'Payment verified and credits added successfully', {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      credits_added: packageData.credits,
      remaining_credits: updatedUser.credits
    });

  } catch (error) {
    logger.error('Error in verifyPaymentOrder:', error);
    next(error);
  }
};

/**
 * Handle Razorpay webhook events (Backup system)
 * POST /api/payments/webhook
 */
export const webhook = async (req, res, next) => {
  try {
    const rawBody = req.body; 
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing Razorpay signature' });
    }
    
    const isValid = verifyRazorpayWebhook(rawBody, signature);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    
    const event = JSON.parse(rawBody.toString());
    
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const order = await razorpay.orders.fetch(orderId);
      if (!order) return res.status(200).json({ status: 'ok' });

      const { package_id, phone_number, credits } = order.notes;
      
      // Update credits via webhook logic
      await addCredits(
        phone_number,
        parseInt(credits),
        'webhook_payment',
        paymentEntity.id
      );
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Error in handleWebhook:', error);
    res.status(200).json({ status: 'error' }); 
  }
};