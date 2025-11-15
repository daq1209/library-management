/**
 * NovaLibrary Backend API Server
 * 
 * Main application entry point.
 * Sets up Express server with middleware, routes, and error handling.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { initDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ====================
// Middleware Setup
// ====================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'null' // Allow file:// protocol for testing
  ],
  credentials: true
}));

// Rate limiting (max 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ====================
// Routes
// ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NovaLibrary API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);

// 🔧 Admin API dùng /api/admin để khớp với frontend http.js
app.use('/api/admin', adminRoutes);  

// ====================
// Error Handling
// ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ====================
// Server Initialization
// ====================

async function startServer() {
  try {
    // Initialize database
    await initDB();

    // Start server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 NovaLibrary Backend Server');
      console.log('='.repeat(50));
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API:   http://localhost:${PORT}/api/v1/auth`);
      console.log(`💟 Wishlist:   http://localhost:${PORT}/api/v1/wishlist`);
      console.log(`🛒 Cart:       http://localhost:${PORT}/api/v1/cart`);
      console.log(`🛠  Admin API: http://localhost:${PORT}/api/admin`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
