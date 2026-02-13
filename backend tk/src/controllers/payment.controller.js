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

    // 4. Check if payment already processed (prevent duplicate processing)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('gateway_payment_id', razorpay_payment_id)
      .single();
    
    if (existingPayment) {
      logger.warn(`Payment ${razorpay_payment_id} already processed`);
      // Check if credits were already added
      const { data: creditTransaction } = await supabase
        .from('credit_transactions')
        .select('credits')
        .eq('reference_id', razorpay_payment_id)
        .eq('action', 'credit')
        .single();
      
      if (creditTransaction) {
        // Payment already processed, return success with current credits
        const { data: currentUser } = await supabase
          .from('users')
          .select('credits')
          .eq('id', userData.id)
          .single();
        
        return sendSuccess(res, 'Payment already processed', {
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          credits_added: 0,
          remaining_credits: currentUser?.credits || 0,
          already_processed: true
        });
      }
    }
    
    // 5. Get package details to determine credits and price
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', package_id)
      .single();
    
    if (packageError || !packageData) {
      return sendError(res, 'Package details not found', 404);
    }
    
    // 6. Insert into payments table (Matching your provided SQL schema)
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
      // Check if it's a duplicate key error
      if (dbPaymentError.code === '23505' || dbPaymentError.message?.includes('duplicate')) {
        logger.warn(`Payment ${razorpay_payment_id} already exists in database`);
        // Check if credits were added
        const { data: creditTransaction } = await supabase
          .from('credit_transactions')
          .select('credits')
          .eq('reference_id', razorpay_payment_id)
          .eq('action', 'credit')
          .single();
        
        if (creditTransaction) {
          const { data: currentUser } = await supabase
            .from('users')
            .select('credits')
            .eq('id', userData.id)
            .single();
          
          return sendSuccess(res, 'Payment already processed', {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            credits_added: 0,
            remaining_credits: currentUser?.credits || 0,
            already_processed: true
          });
        }
      } else {
        logger.error(`Database payment logging error: ${dbPaymentError.message}`);
        // We continue because the user has already paid, but we log the error
      }
    }

    // 7. Credit user account
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
      logger.error('Webhook: Missing Razorpay signature');
      return res.status(400).json({ error: 'Missing Razorpay signature' });
    }
    
    if (!razorpay) {
      logger.error('Webhook: Razorpay not configured');
      return res.status(500).json({ error: 'Razorpay not configured' });
    }
    
    const isValid = verifyRazorpayWebhook(rawBody, signature);
    if (!isValid) {
      logger.error('Webhook: Invalid signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    
    const event = JSON.parse(rawBody.toString());
    logger.info(`Webhook received event: ${event.event}`);
    
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      
      // Check if payment already processed
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('gateway_payment_id', paymentId)
        .single();
      
      if (existingPayment) {
        logger.info(`Webhook: Payment ${paymentId} already processed, skipping`);
        return res.status(200).json({ status: 'ok', message: 'Already processed' });
      }
      
      const order = await razorpay.orders.fetch(orderId);
      if (!order) {
        logger.error(`Webhook: Order ${orderId} not found`);
        return res.status(200).json({ status: 'ok' });
      }

      const { package_id, phone_number, credits } = order.notes;
      
      if (!phone_number || !credits) {
        logger.error(`Webhook: Missing phone_number or credits in order notes`);
        return res.status(200).json({ status: 'ok' });
      }
      
      // Update credits via webhook logic
      await addCredits(
        phone_number,
        parseInt(credits),
        'webhook_payment',
        paymentId
      );
      
      // Log payment in database
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone_number)
        .single();
      
      if (userData) {
        await supabase
          .from('payments')
          .insert([{
            user_id: userData.id,
            amount: order.amount / 100, // Convert from paise to rupees
            payment_gateway: 'razorpay',
            gateway_order_id: orderId,
            gateway_payment_id: paymentId,
            status: 'success',
            package_id: package_id
          }]);
      }
      
      logger.info(`Webhook: Successfully processed payment ${paymentId}`);
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Error in handleWebhook:', error);
    res.status(200).json({ status: 'error', message: error.message }); 
  }
};