import { Router } from 'express';
import { jupiterController } from '../controllers/jupiter.controller';
import { validate, validationRules } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * /api/jupiter/quote:
 *   get:
 *     summary: Get a quote for a token swap
 *     tags: [Jupiter]
 *     parameters:
 *       - in: query
 *         name: inputMint
 *         required: true
 *         schema:
 *           type: string
 *         description: The input token mint address
 *       - in: query
 *         name: outputMint
 *         required: true
 *         schema:
 *           type: string
 *         description: The output token mint address
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 *         description: The amount of input tokens to swap (in lamports)
 *       - in: query
 *         name: slippageBps
 *         schema:
 *           type: number
 *         description: Slippage in basis points (1/10,000)
 *       - in: query
 *         name: restrictIntermediateTokens
 *         schema:
 *           type: boolean
 *         description: Whether to restrict intermediate tokens in the route
 *     responses:
 *       200:
 *         description: Successful quote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/QuoteResponse'
 */
router.get('/quote', validate(validationRules.getQuote), jupiterController.getQuote);

/**
 * @swagger
 * /api/jupiter/swap:
 *   post:
 *     summary: Build a swap transaction
 *     tags: [Jupiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userPublicKey
 *               - inputMint
 *               - outputMint
 *               - amount
 *             properties:
 *               userPublicKey:
 *                 type: string
 *                 description: The user's public key
 *               inputMint:
 *                 type: string
 *                 description: The input token mint address
 *               outputMint:
 *                 type: string
 *                 description: The output token mint address
 *               amount:
 *                 type: string
 *                 description: The amount of input tokens to swap (in lamports)
 *               slippageBps:
 *                 type: number
 *                 description: Slippage in basis points (1/10,000)
 *               wrapAndUnwrapSol:
 *                 type: boolean
 *                 description: Whether to wrap/unwrap SOL
 *               asLegacyTransaction:
 *                 type: boolean
 *                 description: Whether to use legacy transaction
 *     responses:
 *       200:
 *         description: Successful swap transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SwapTransactionResponse'
 */
router.post('/swap', validate(validationRules.buildSwap), jupiterController.buildSwapTransaction);

/**
 * @swagger
 * /api/jupiter/tokens:
 *   get:
 *     summary: Get list of supported tokens
 *     tags: [Jupiter]
 *     responses:
 *       200:
 *         description: List of supported tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       name:
 *                         type: string
 *                       decimals:
 *                         type: number
 *                       logoURI:
 *                         type: string
 */
router.get('/tokens', jupiterController.getTokens);

export default router;
