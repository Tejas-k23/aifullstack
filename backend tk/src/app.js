/**
 * Express App Configuration
 * Main application setup with routes and middleware
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config/env.js';
import logger from './utils/logger.util.js';

// Import routes
import botRoutes from './routes/bot.routes.js';
import userRoutes from './routes/user.routes.js';
import creditRoutes from './routes/credit.routes.js';
import paymentRoutes from './routes/payment.routes.js';

// Import error handling middleware
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/bot', botRoutes);
app.use('/api/users', userRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
