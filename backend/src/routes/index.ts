import { Router } from 'express';
import jupiterRoutes from './jupiter.routes';

const router = Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */
router.use('/jupiter', jupiterRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    service: 'jupiter-hackathon-api',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// 404 handler for /api/*
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
  });
});

export default router;
