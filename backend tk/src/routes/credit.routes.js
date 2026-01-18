/**
 * Credit Routes
 * Routes for credit history endpoints
 */

import express from 'express';
import { getCreditHistory } from '../controllers/credit.controller.js';

const router = express.Router();

// GET /api/credits/history/:user_id - Get credit transaction history
router.get('/history/:user_id', getCreditHistory);

export default router;
