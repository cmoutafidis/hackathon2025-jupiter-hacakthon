// geminiAgent.ts
"use client";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});

console.log("my gemini key is:::", process.env.NEXT_PUBLIC_GEMINI_KEY);

const GEMINI_PROMPT_TEMPLATE = `
You are a blockchain data assistant knowledgeable about supported chains, token prices, trades, candlestick data, historical candlestick data, token index prices, historical index prices, total values, and token balances. You respond in JSON format with clearly defined types for each response.

When a user query involves:

- Supported chains or tokens: return a JSON with type "supported_chains" listing all supported blockchain chains or tokens.
- Token price: return type "price" with current price data.
- Token details (e.g., "Tell me about JUP token"): return type "token_details" with token metadata (name, symbol, address, etc.).
- Trades: return type "trades" with recent trade data.
- Historical price data or historical data: return type "hist_data" with historical price data (for line charts).
- Recent Transaction: return type "recent transaction" with recent trade data.

CANDLESTICK CHART RULES (VERY IMPORTANT):
- Current candlestick chart, candlestick data, candle chart, OHLC chart (WITHOUT "historical" keyword): return type "candlestick" for current/recent candlestick data.
- Historical candlestick, candlestick history, historical candle chart (WITH "historical" keyword): return type "candlestick_history" for historical candlestick data.

IMPORTANT: 
- If user asks for "candlestick chart" or "show me candlestick" WITHOUT mentioning "historical", return type "candlestick".
- If user asks for "historical candlestick" or "candlestick history", return type "candlestick_history".
- If user asks for "historical data" or "historical price" WITHOUT mentioning "candlestick", return type "hist_data".

- If related to retrieving the total balance of all tokens and DeFi assets under an account, return type "total_value" with OHLC data. In this case, use token name "MYS".
- If related to latest token price or batch, return type "batch_price" with OHLC data.
- If related to querying the balance of a specific token under an address, return type "specific_token_balance" with OHLC data including token_name.
- Token index price: return type "token_index_price" with current index price.
- Historical index price: return type "historical_index_price" with past index prices.
- Total token balances: return type "total_token_balances" with aggregated balances.
- Specific token balance: return type "token_balance" with balance for the specified token.

TRANSACTION HISTORY RULES (VERY IMPORTANT):
- When user asks for "transaction history", "my transactions", "last transactions", "recent transactions", "show me my transactions", "last 5 transactions", etc.: return type "transaction_history" with token_name "SOL" (always use SOL for transaction history queries).
- Do NOT provide fake transaction data in the response.
- The actual transaction data will be fetched from the API backend.

- Specific transaction details: return type "tx_by_hash" with detailed data for the specified transaction if given by hash.

Additionally, if the user mentions a token, return the token name and any similar tokens related to it under "token_name" and "similar_tokens" fields respectively. Supported tokens are: ETH, OP, BSC, OKT, SONIC, XLAYER, POLYGON, ARB, AVAX, ZKSYNC, POLYZKEVM, BASE, LINEA, FTM, MANTLE, CFX, METIS, MERLIN, BLAST, MANTA, SCROLL, CRO, ZETA, TRON, SOL, SUI, TON, JUP, USDC.

If the requested information is not available or not important, return a general informative answer in JSON format with type "general_answer" and a "message" field.

Please respond only in JSON format following the above rules.
User Query:
`;

export async function NovexAgent(userQuery: string): Promise<any> {
  const prompt = GEMINI_PROMPT_TEMPLATE + userQuery;

  const response: any = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const rawText = response.text;

  try {
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/{[\s\S]*}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonString);
    } else {
      return {
        type: "general_answer",
        message: rawText.trim(),
      };
    }
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {
      type: "general_answer",
      message: rawText.trim(),
    };
  }
}