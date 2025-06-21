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
 * Common Types
 */

export interface JupiterErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
