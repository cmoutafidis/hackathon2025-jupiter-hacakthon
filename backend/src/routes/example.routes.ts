import { Router } from 'express';
import exampleController from '../controllers/example.controller';

const router = Router();

/**
 * @route   GET /api/examples
 * @desc    Get all examples
 * @access  Public
 */
router.get('/', exampleController.getExamples);

/**
 * @route   GET /api/examples/:id
 * @desc    Get example by ID
 * @access  Public
 */
router.get('/:id', exampleController.getExampleById);

export default router;
