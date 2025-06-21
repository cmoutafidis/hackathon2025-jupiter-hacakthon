"use client";

import { useState, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { Button, Input, Select, SelectItem, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";

// Define prompt templates for different DeFi contexts
const PROMPT_TEMPLATES = {
  trading: `
    You are a DeFi Trading Assistant specializing in blockchain data and trading insights. 
    Respond in JSON format with clearly defined types for each response. Supported chains include: 
    ETH, OP, BSC, OKT, SONIC, XLAYER, POLYGON, ARB, AVAX, ZKSYNC, POLYZKEVM, BASE, LINEA, FTM, 
    MANTLE, CFX, METIS, MERLIN, BLAST, MANTA, SCROLL, CRO, ZETA, TRON, SOL, SUI, TON.

    Response types:
    - Supported chains: { type: "supported_chains", data: string[] }
    - Token price: { type: "price", token_name: string, price: number, similar_tokens: string[] }
    - Trades: { type: "trades", data: { token: string, amount: number, timestamp: string }[] }
    - Candlestick data: { type: "candlestick", data: { open: number, high: number, low: number, close: number, timestamp: string }[] }
    - Historical data: { type: "hist_data", data: { open: number, high: number, low: number, close: number, timestamp: string }[] }
    - Recent transaction: { type: "recent_transaction", data: { tx_hash: string, token: string, amount: number } }
    - Total balance: { type: "total_value", token_name: "MYS", data: { total: number, currency: string } }
    - Batch token prices: { type: "batch_price", data: { token: string, price: number }[] }
    - Total token balance: { type: "total_token_balance", data: { token: string, balance: number }[] }
    - Specific token balance: { type: "specific_token_balance", token_name: string, data: { balance: number, address: string } }
    - Candlestick history: { type: "candlestick_history", data: { open: number, high: number, low: number, close: number, timestamp: string }[] }
    - Token index price: { type: "token_index_price", data: { index: string, price: number } }
    - Historical index price: { type: "historical_index_price", data: { index: string, price: number, timestamp: string }[] }
    - Transaction history: { type: "transaction_history", data: { tx_hash: string, amount: number, timestamp: string }[] }
    - Transaction details: { type: "tx_by_hash", data: { tx_hash: string, details: object } }
    - General answer: { type: "general_answer", message: string }

    If a token is mentioned, include "token_name" and "similar_tokens" fields.
    User Query: {query}
  `,
  portfolio: `
    You are a DeFi Portfolio Assistant focused on token balances and portfolio analytics.
    Respond in JSON format with types:
    - Total balance: { type: "total_value", token_name: "MYS", data: { total: number, currency: string } }
    - Total token balance: { type: "total_token_balance", data: { token: string, balance: number }[] }
    - Specific token balance: { type: "specific_token_balance", token_name: string, data: { balance: number, address: string } }
    - General answer: { type: "general_answer", message: string }
    Supported chains: ETH, OP, BSC, OKT, SONIC, XLAYER, POLYGON, ARB, AVAX, ZKSYNC, POLYZKEVM, BASE, LINEA, FTM, MANTLE, CFX, METIS, MERLIN, BLAST, MANTA, SCROLL, CRO, ZETA, TRON, SOL, SUI, TON.
    User Query: {query}
  `,
  analytics: `
    You are a DeFi Analytics Assistant providing insights on market trends and historical data.
    Respond in JSON format with types:
    - Candlestick data: { type: "candlestick", data: { open: number, high: number, low: number, close: number, timestamp: string }[] }
    - Candlestick history: { type: "candlestick_history", data: { open: number, high: number, low: number, close: number, timestamp: string }[] }
    - Token index price: { type: "token_index_price", data: { index: string, price: number } }
    - Historical index price: { type: "historical_index_price", data: { index: string, price: number, timestamp: string }[] }
    - General answer: { type: "general_answer", message: string }
    Supported chains: ETH, OP, BSC, OKT, SONIC, XLAYER, POLYGON, ARB, AVAX, ZKSYNC, POLYZKEVM, BASE, LINEA, FTM, MANTLE, CFX, METIS, MERLIN, BLAST, MANTA, SCROLL, CRO, ZETA, TRON, SOL, SUI, TON.
    User Query: {query}
  `,
};

// Initialize GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});

interface GeminiResponse {
  type: string;
  [key: string]: any;
}

export default function DeFiAssistant() {
  const [query, setQuery] = useState("");
  const [template, setTemplate] = useState<keyof typeof PROMPT_TEMPLATES>("trading");
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const prompt = PROMPT_TEMPLATES[template as keyof typeof PROMPT_TEMPLATES].replace("{query}", query);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const rawText = response?.text || '';
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0];
        setResponse(JSON.parse(jsonString));
      } else {
        setResponse({
          type: "general_answer",
          message: rawText.trim(),
        });
      }
    } catch (error) {
      console.error("Failed to process Gemini response:", error);
      setError("Failed to fetch response. Please try again.");
      setResponse({
        type: "general_answer",
        message: "An error occurred while processing your request.",
      });
    } finally {
      setLoading(false);
    }
  }, [query, template]);

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">DeFi Trading Assistant</h1>
        </CardHeader>
        <CardBody>
          <Select
            label="Assistant Mode"
            placeholder="Select mode"
            value={template}
            onChange={(e) => setTemplate(e.target.value as keyof typeof PROMPT_TEMPLATES)}
            className="mb-4"
          >
            <SelectItem value="trading">Trading Assistant</SelectItem>
            <SelectItem value="portfolio">Portfolio Assistant</SelectItem>
            <SelectItem value="analytics">Analytics Assistant</SelectItem>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your DeFi query (e.g., 'ETH price', 'total balance')"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              color="primary"
              onClick={handleQuery}
              disabled={loading || !query.trim()}
            >
              {loading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {response && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}