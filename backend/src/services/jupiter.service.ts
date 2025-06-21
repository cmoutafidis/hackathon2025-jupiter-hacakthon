import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  QuoteRequestParams, 
  QuoteResponse, 
  JupiterErrorResponse, 
  SwapTransactionRequest, 
  SwapTransactionResponse 
} from '../interfaces/jupiter.interface';
import { logger } from '../utils/logger';

class JupiterService {
  private api: AxiosInstance;
  private readonly baseUrl = 'https://lite-api.jup.ag/swap/v1';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '' // api key not needed
      },
      timeout: 10000, // 10 seconds
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        logger.debug(`[JupiterService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('[JupiterService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<JupiterErrorResponse>) => {
        if (error.response) {
          const { status, data } = error.response;
          logger.error(`[JupiterService] API Error ${status}: ${data?.message || error.message}`);
          
          // Create a more descriptive error message
          const errorMessage = data?.message || 'An unknown error occurred';
          const errorDetails = data?.error ? ` (${data.error})` : '';
          
          return Promise.reject(new Error(`Jupiter API Error: ${errorMessage}${errorDetails}`));
        } else if (error.request) {
          // The request was made but no response was received
          logger.error('[JupiterService] No response received:', error.request);
          return Promise.reject(new Error('No response received from Jupiter API'));
        } else {
          // Something happened in setting up the request
          logger.error('[JupiterService] Request setup error:', error.message);
          return Promise.reject(new Error(`Failed to send request: ${error.message}`));
        }
      }
    );
  }

  /**
   * Get a quote for a token swap
   * @param params Quote request parameters
   * @returns Promise with quote response
   */
  public async getQuote(params: QuoteRequestParams): Promise<QuoteResponse> {
    try {
      logger.debug(`[JupiterService] Getting quote for ${params.inputMint} -> ${params.outputMint}`);
      
      const response = await this.api.get<QuoteResponse>('/quote', {
        params: {
          ...params,
          // Ensure amount is a string as required by the API
          amount: params.amount.toString(),
        },
      });
      
      return response.data;
    } catch (error) {
      logger.error('[JupiterService] Failed to get quote:', error);
      throw error;
    }
  }

  /**
   * Build a swap transaction
   * @param swapRequest Swap transaction request
   * @returns Promise with swap transaction response
   */
  public async buildSwapTransaction(
    swapRequest: Omit<SwapTransactionRequest, 'quoteResponse'> & { quoteResponse: QuoteResponse }
  ): Promise<SwapTransactionResponse> {
    try {
      logger.debug(`[JupiterService] Building swap transaction for user ${swapRequest.userPublicKey}`);
      
      const response = await this.api.post<SwapTransactionResponse>(
        '/swap',
        swapRequest
      );
      
      return response.data;
    } catch (error) {
      logger.error('[JupiterService] Failed to build swap transaction:', error);
      throw error;
    }
  }

  /**
   * Get a quote and build a swap transaction in one call
   * @param quoteParams Quote request parameters
   * @param swapParams Swap transaction parameters
   * @returns Promise with swap transaction response
   */
  public async quoteAndBuildSwap(
    quoteParams: QuoteRequestParams,
    swapParams: Omit<SwapTransactionRequest, 'quoteResponse'>
  ): Promise<SwapTransactionResponse> {
    try {
      const quote = await this.getQuote(quoteParams);
      return this.buildSwapTransaction({
        ...swapParams,
        quoteResponse: quote,
      });
    } catch (error) {
      logger.error('[JupiterService] Failed to quote and build swap:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const jupiterService = new JupiterService();