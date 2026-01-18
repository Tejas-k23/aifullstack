/**
 * Bot Routes
 * Routes for WhatsApp bot API endpoints (protected by bot authentication)
 */

import express from 'express';
import { authenticateBot } from '../middlewares/botAuth.middleware.js';
import { getCredits, deductCredits } from '../controllers/bot.controller.js';

const router = express.Router();

// All bot routes require authentication
router.use(authenticateBot);

// GET /api/bot/credits/:phone_number - Get remaining credits
router.get('/credits/:phone_number', getCredits);

// POST /api/bot/deduct - Deduct one credit after image generation
router.post('/deduct', deductCredits);

export default router;
