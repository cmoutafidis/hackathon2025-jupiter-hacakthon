import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { 
  QuoteRequestParams
} from '../interfaces/jupiter.interface';
import { jupiterService } from '../services/jupiter.service';
import { logger } from '../utils/logger';

class JupiterController {
  /**
   * Get a quote for a token swap
   */
  public getQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check for validation errors from express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed', { errors: errors.array() });
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const quoteParams: QuoteRequestParams = {
        inputMint: req.query.inputMint as string,
        outputMint: req.query.outputMint as string,
        amount: req.query.amount as string,
        slippageBps: req.query.slippageBps ? Number(req.query.slippageBps) : undefined,
        restrictIntermediateTokens: req.query.restrictIntermediateTokens === 'true',
        swapMode: req.query.swapMode as 'ExactIn' | 'ExactOut' | undefined,
        feeBps: req.query.feeBps ? Number(req.query.feeBps) : undefined,
        onlyDirectRoutes: req.query.onlyDirectRoutes === 'true',
        asLegacyTransaction: req.query.asLegacyTransaction === 'true',
        maxAccounts: req.query.maxAccounts ? Number(req.query.maxAccounts) : undefined,
      };

      logger.info(`Fetching quote: ${quoteParams.inputMint} -> ${quoteParams.outputMint} (${quoteParams.amount})`);
      
      const quote = await jupiterService.getQuote(quoteParams);
      
      res.status(200).json({
        success: true,
        data: quote,
      });
    } catch (error) {
      logger.error('Failed to get quote:', error);
      next(error);
    }
  };

  /**
   * Build a swap transaction
   */
  public buildSwapTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check for validation errors from express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed', { errors: errors.array() });
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { 
        userPublicKey, 
        wrapAndUnwrapSol,
        prioritizationFeeLamports,
        asLegacyTransaction,
        useSharedAccounts,
        computeUnitPriceMicroLamports,
        useVersionedTransaction,
        asLegacyTransactionIfUnsupported,
        ...quoteParams 
      } = req.body;

      logger.info(`Building swap transaction for user: ${userPublicKey}`);
      
      // First get the quote
      const quote = await jupiterService.getQuote(quoteParams as QuoteRequestParams);
      
      // Then build the swap transaction
      const swapTransaction = await jupiterService.buildSwapTransaction({
        quoteResponse: quote,
        userPublicKey,
        wrapAndUnwrapSol,
        prioritizationFeeLamports,
        asLegacyTransaction,
        useSharedAccounts,
        computeUnitPriceMicroLamports,
        useVersionedTransaction,
        asLegacyTransactionIfUnsupported,
      });
      
      res.status(200).json({
        success: true,
        data: swapTransaction,
      });
    } catch (error) {
      logger.error('Failed to build swap transaction:', error);
      next(error);
    }
  };

  /**
   * Get supported tokens
   */
  public getTokens = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Fetching supported tokens');
      
      // This is a placeholder. In a real implementation, you would fetch this from Jupiter's API
      // const tokens = await jupiterService.getSupportedTokens();
      
      // For now, return some common tokens
      const tokens = [
        {
          address: 'So11111111111111111111111111111111111111112', // SOL
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        },
        {
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        },
      ];
      
      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      logger.error('Failed to fetch supported tokens:', error);
      next(error);
    }
  };
}

export const jupiterController = new JupiterController();
