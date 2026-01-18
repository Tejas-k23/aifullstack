/**
 * Payment Routes
 * Routes for Razorpay payment endpoints
 */

import express from 'express';
import { createOrder, verifyPayment, webhook } from '../controllers/payment.controller.js';

const router = express.Router();

// POST /api/payments/create-order - Create Razorpay order
router.post('/create-order', createOrder);

// POST /api/payments/verify - Verify Razorpay payment
router.post('/verify', verifyPayment);

// POST /api/payments/webhook - Handle Razorpay webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router;
