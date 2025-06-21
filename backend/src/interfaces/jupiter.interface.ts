// Common interfaces for Jupiter API

/**
 * Swap API Types
 */

export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlanStep {
  swapInfo: SwapInfo;
  percent: number;
}

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: any | null;
  priceImpactPct: string;
  routePlan: RoutePlanStep[];
  contextSlot: number;
  timeTaken: number;
}

export interface QuoteRequestParams {
  inputMint: string;
  outputMint: string;
  amount: string | number;
  slippageBps?: number;
  restrictIntermediateTokens?: boolean;
  swapMode?: 'ExactIn' | 'ExactOut';
  feeBps?: number;
  onlyDirectRoutes?: boolean;
  asLegacyTransaction?: boolean;
  maxAccounts?: number;
}

export interface SwapTransactionRequest {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
  prioritizationFeeLamports?: number | 'auto';
  asLegacyTransaction?: boolean;
  useSharedAccounts?: boolean;
  computeUnitPriceMicroLamports?: string;
  useVersionedTransaction?: boolean;
  asLegacyTransactionIfUnsupported?: boolean;
}

export interface SwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit?: number;
  prioritizationType?: {
    computeBudget?: {
      microLamports: number;
      estimatedMicroLamports: number;
    };
  };
  dynamicSlippageReport?: {
    slippageBps: number;
    otherAmount: number;
    simulatedIncurredSlippageBps: number;
    amplificationRatio: string;
    categoryName: string;
    heuristicMaxSlippageBps: number;
  };
  simulationError?: any;
}

export interface SendTransactionRequest {
  /** Base64 encoded serialized transaction */
  signedTransaction: string;
  
  /** 
   * Maximum number of times for the RPC node to retry sending the transaction if it is not confirmed.
   * @default 0
   */
  maxRetries?: number;
  
  /** 
   * If true, skip preflight transaction checks.
   * @default false
   */
  skipPreflight?: boolean;
  
  /** 
   * Commitment level for transaction confirmation.
   * @default 'confirmed'
   */
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

export interface SendTransactionResponse {
  /** Transaction signature as base-58 encoded string */
  signature: string;
  
  /** Block height at which the transaction was confirmed */
  slot: number;
  
  /** Error if transaction failed, null if successful */
  err: any | null;
  
  /** Transaction metadata */
  memo: string | null;
  
  /** The unix timestamp of when the transaction was processed */
  blockTime: number | null;
  
  /** Transaction confirmation status */
  confirmationStatus: 'processed' | 'confirmed' | 'finalized' | null;
}

export interface SwapInstructionsRequest {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
}

export interface SwapInstructionsResponse {
  tokenLedgerInstruction: string | null;
  computeBudgetInstructions: string[];
  setupInstructions: string[];
  swapInstruction: string;
  cleanupInstruction: string | null;
  addressLookupTableAddresses: string[];
}

export interface ProgramIdToLabelResponse {
  [programId: string]: string;
}

/**
 * Token API Types
 */

export interface TokenInfo {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags?: string[];
  extensions?: {
    [key: string]: any;
  };
}

export interface TokenInfoResponse extends TokenInfo {
  timestamp: string;
  holders: number;
  priceInfo?: {
    pricePerToken: number;
    totalPrice: number;
    currency: string;
  };
}

export interface MintsInMarketResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  marketInfos: Array<{
    id: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    minInAmount?: string;
    minOutAmount?: string;
    notEnoughLiquidity: boolean;
    priceImpactPct: string;
  }>;
}

export interface TradableTokensResponse {
  mints: string[];
}

export interface TaggedTokensResponse {
  [mint: string]: TokenInfo;
}

export interface NewTokensResponse {
  [mint: string]: {
    mint: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    tags: string[];
    createdAt: string;
  };
}

export interface AllTokensResponse {
  [mint: string]: TokenInfo;
}

/**
 * Price API Types
 */

export interface PriceRequestParams {
  /**
   * Token mint address or 'SOL' for native SOL
   */
  inputMint: string;
  
  /**
   * Token mint address or 'SOL' for native SOL
   */
  outputMint: string;
  
  /**
   * Amount of input token to price, in token's smallest unit (e.g., lamports for SOL, 6 decimals for USDC)
   */
  amount: string | number;
  
  /**
   * Slippage in basis points (1 = 0.01%)
   * @default 50
   */
  slippageBps?: number;
  
  /**
   * Whether to only consider direct routes (no hops)
   * @default false
   */
  onlyDirectRoutes?: boolean;
  
  /**
   * Whether to include detailed route information in the response
   * @default false
   */
  includeDetailedRoutes?: boolean;
  
  /**
   * Whether to include the full route plan in the response
   * @default false
   */
  includeRoutePlan?: boolean;
}

export interface PriceResponse {
  /**
   * Input token mint address
   */
  inputMint: string;
  
  /**
   * Output token mint address
   */
  outputMint: string;
  
  /**
   * Amount of input token being swapped
   */
  inAmount: string;
  
  /**
   * Expected amount of output token to receive
   */
  outAmount: string;
  
  /**
   * Price impact percentage (e.g., '0.05' for 0.05%)
   */
  priceImpactPct: string;
  
  /**
   * Estimated price per output token in terms of input token
   */
  price: string;
  
  /**
   * Estimated price per input token in terms of output token
   */
  inversePrice: string;
  
  /**
   * List of market IDs used in the route
   */
  marketInfos: Array<{
    id: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    minInAmount?: string;
    minOutAmount?: string;
    notEnoughLiquidity: boolean;
    priceImpactPct: string;
  }>;
  
  /**
   * Detailed route information if requested
   */
  routePlan?: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  
  /**
   * Estimated network fees in SOL
   */
  fees: {
    /**
     * Estimated transaction fee in SOL
     */
    transactionFee: string;
    
    /**
     * Estimated priority fee in SOL (if applicable)
     */
    priorityFee?: string;
    
    /**
     * Estimated total fee in SOL
     */
    totalFee: string;
  };
  
  /**
   * Timestamp of when the price was calculated
   */
  timestamp: string;
  
  /**
   * Context slot at which the price was calculated
   */
  contextSlot: number;
  
  /**
   * Time taken to calculate the price in milliseconds
   */
  timeTaken: number;
}

/**
 * Common Types
 */

export interface JupiterErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
