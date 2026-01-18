/**
 * User Routes
 * Routes for user profile endpoints
 */

import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

// GET /api/users/:phone_number - Get user profile
router.get('/:phone_number', getUserProfile);

export default router;
