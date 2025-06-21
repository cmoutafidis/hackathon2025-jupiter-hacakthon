import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import config from '../config';
import { logger } from '../utils/logger';
import {
  QuoteRequestParams,
  QuoteResponse,
  SwapTransactionRequest,
  SwapTransactionResponse,
  SwapInstructionsRequest,
  SwapInstructionsResponse,
  ProgramIdToLabelResponse,
  TokenInfo,
  TokenInfoResponse,
  MintsInMarketResponse,
  TradableTokensResponse,
  TaggedTokensResponse,
  NewTokensResponse,
  AllTokensResponse,
  JupiterErrorResponse,
} from '../interfaces/jupiter.interface';

/**
 * Service for interacting with the Jupiter Aggregator API
 */
class JupiterService {
  private readonly client: AxiosInstance;
  private readonly baseURL: string;
  private readonly tokenBaseURL: string;

  constructor() {
    this.baseURL = config.jupiter.apiBaseUrl || 'https://quote-api.jup.ag/v6';
    this.tokenBaseURL = config.jupiter.tokenApiBaseUrl || 'https://token-api.jup.ag';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(config.jupiter.apiKey && { 'Authorization': `Bearer ${config.jupiter.apiKey}` }),
      },
      timeout: 30000, // 30 seconds
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
          baseURL: config.baseURL,
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Response: ${response.status} ${response.config.url}`, {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.error('API Error Response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            url: error.config.url,
            method: error.config.method,
          });
        } else if (error.request) {
          // The request was made but no response was received
          logger.error('No response received:', {
            message: error.message,
            url: error.config.url,
            method: error.config.method,
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Swap API Methods
   */

  /**
   * Get a quote for a token swap
   * @param params Quote request parameters
   * @returns Promise with quote response
   */
  public async getQuote(params: QuoteRequestParams): Promise<QuoteResponse> {
    try {
      const response = await this.client.get<QuoteResponse>('/quote', { params });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get quote');
      throw error;
    }
  }

  /**
   * Get a swap transaction
   * @param swapRequest Swap transaction request
   * @returns Promise with swap transaction response
   */
  public async getSwapTransaction(
    swapRequest: SwapTransactionRequest
  ): Promise<SwapTransactionResponse> {
    try {
      const response = await this.client.post<SwapTransactionResponse>(
        '/swap',
        swapRequest
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get swap transaction');
      throw error;
    }
  }

  /**
   * Get swap instructions for a quote
   * @param swapInstructionsRequest Swap instructions request
   * @returns Promise with swap instructions response
   */
  public async getSwapInstructions(
    swapInstructionsRequest: SwapInstructionsRequest
  ): Promise<SwapInstructionsResponse> {
    try {
      const response = await this.client.post<SwapInstructionsResponse>(
        '/swap-instructions',
        swapInstructionsRequest
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get swap instructions');
      throw error;
    }
  }

  /**
   * Get program ID to label mapping
   * @returns Promise with program ID to label mapping
   */
  public async getProgramIdToLabel(): Promise<ProgramIdToLabelResponse> {
    try {
      const response = await this.client.get<ProgramIdToLabelResponse>('/program-id-to-label');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get program ID to label mapping');
      throw error;
    }
  }

  /**
   * Token API Methods
   */

  /**
   * Get information about a specific token
   * @param mintAddress The mint address of the token
   * @returns Promise with token information
   */
  public async getTokenInfo(mintAddress: string): Promise<TokenInfoResponse> {
    try {
      const response = await axios.get<TokenInfoResponse>(
        `${this.tokenBaseURL}/token/${mintAddress}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get token info for ${mintAddress}`);
      throw error;
    }
  }

  /**
   * Get mints involved in a market
   * @param inputMint The input mint address
   * @param outputMint The output mint address
   * @param amount The amount to swap
   * @returns Promise with mints in market response
   */
  public async getMintsInMarket(
    inputMint: string,
    outputMint: string,
    amount: string | number
  ): Promise<MintsInMarketResponse> {
    try {
      const response = await axios.get<MintsInMarketResponse>(
        `${this.tokenBaseURL}/mints/in-market`,
        {
          params: { inputMint, outputMint, amount },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get mints in market');
      throw error;
    }
  }

  /**
   * Get all tradable tokens
   * @returns Promise with tradable tokens response
   */
  public async getTradableTokens(): Promise<string[]> {
    try {
      const response = await axios.get<TradableTokensResponse>(
        `${this.tokenBaseURL}/tradable`
      );
      return response.data.mints;
    } catch (error) {
      this.handleError(error, 'Failed to get tradable tokens');
      throw error;
    }
  }

  /**
   * Get tokens with specific tags
   * @param tags Array of tags to filter by
   * @returns Promise with tagged tokens response
   */
  public async getTaggedTokens(tags: string[]): Promise<Record<string, TokenInfo>> {
    try {
      const response = await axios.get<TaggedTokensResponse>(
        `${this.tokenBaseURL}/tagged`,
        {
          params: { tags: tags.join(',') },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get tagged tokens');
      throw error;
    }
  }

  /**
   * Get newly added tokens
   * @returns Promise with new tokens response
   */
  public async getNewTokens(): Promise<Record<string, TokenInfo>> {
    try {
      const response = await axios.get<NewTokensResponse>(
        `${this.tokenBaseURL}/new`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get new tokens');
      throw error;
    }
  }

  /**
   * Get all tokens with metadata
   * @returns Promise with all tokens response
   */
  public async getAllTokens(): Promise<Record<string, TokenInfo>> {
    try {
      const response = await axios.get<AllTokensResponse>(
        `${this.tokenBaseURL}/all`
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get all tokens');
      throw error;
    }
  }

  /**
   * Get a list of supported tokens (legacy method)
   * @deprecated Use getAllTokens() instead
   * @returns Promise with list of tokens
   */
  public async getTokens(): Promise<TokenInfo[]> {
    try {
      const allTokens = await this.getAllTokens();
      return Object.values(allTokens);
    } catch (error) {
      this.handleError(error, 'Failed to get tokens');
      throw error;
    }
  }

  /**
   * Handle API errors
   * @param error The error object
   * @param message Custom error message
   */
  private handleError(error: unknown, message: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<JupiterErrorResponse>;
      
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = axiosError.response;
        const errorMessage = data?.message || axiosError.message;
        
        logger.error(`${message}: ${status} - ${errorMessage}`, {
          status,
          error: data?.error,
          message: errorMessage,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        });
        
        throw new Error(`Jupiter API Error (${status}): ${errorMessage}`);
      } else if (axiosError.request) {
        // The request was made but no response was received
        logger.error(`${message}: No response received`, {
          message: axiosError.message,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        });
        
        throw new Error('No response received from Jupiter API');
      }
    }
    
    // Unknown error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`${message}: ${errorMessage}`, { error });
    throw new Error(`${message}: ${errorMessage}`);
  }
}

export const jupiterService = new JupiterService();