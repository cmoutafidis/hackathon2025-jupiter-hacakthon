// Common interfaces for Jupiter API

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

export interface JupiterErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
