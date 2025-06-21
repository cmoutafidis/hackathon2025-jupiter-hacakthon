import { Router } from 'express';
import exampleRoutes from './example.routes';

const router = Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */
router.use('/examples', exampleRoutes);

// Add more routes here

// 404 handler for /api/*
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

export default router;
