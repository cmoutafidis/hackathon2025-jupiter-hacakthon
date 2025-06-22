"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronDown, Check, ExternalLink, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { VersionedTransaction, PublicKey } from "@solana/web3.js";
import axios from "axios";
import debounce from "lodash/debounce";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  routePlan: any[];
  priceImpactPct: string;
  slippageBps: number;
}

export default function EnhancedSolanaSwap() {
  const { connected, publicKey: walletPublicKey, signTransaction, tokenBalances, solBalance } = useWallet();

  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [fromAmount, setFromAmount] = useState("0.1");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const publicKey = useMemo(() => {
    if (!walletPublicKey) return null;
    try {
      return typeof walletPublicKey === "string" ? new PublicKey(walletPublicKey) : walletPublicKey;
    } catch (e) {
      console.error("Invalid publicKey format:", walletPublicKey, e);
      return null;
    }
  }, [walletPublicKey]);

  const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
  const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

  const fetchTokens = useCallback(async () => {
    console.log("Fetching tokens...");
    setLoadingTokens(true);
    setError(null);
    try {
      const response = await fetch("https://token.jup.ag/strict");
      if (!response.ok) throw new Error("Failed to fetch tokens from Jupiter API");
      const data = await response.json();
      console.log("Fetched tokens:", data);
      if (Array.isArray(data)) {
        const cachedTokens = JSON.parse(localStorage.getItem("jupiterTokens") || "[]");
        if (cachedTokens.length && new Date().getTime() - (cachedTokens.timestamp || 0) < 86400000) {
          setAvailableTokens(cachedTokens.tokens);
        } else {
          setAvailableTokens(data);
          localStorage.setItem("jupiterTokens", JSON.stringify({ tokens: data, timestamp: new Date().getTime() }));
        }
        setFromToken(data.find((t: Token) => t.symbol === "SOL"));
        setToToken(data.find((t: Token) => t.symbol === "USDC"));
      } else {
        throw new Error("Unexpected token data format");
      }
    } catch (e: any) {
      console.error("Token fetch error:", e.message);
      setError(`Token fetch error: ${e.message}`);
    } finally {
      console.log("Token fetch completed, loadingTokens:", false);
      setLoadingTokens(false);
    }
  }, []);

  useEffect(() => {
    console.log("useEffect triggered for fetchTokens");
    fetchTokens();
  }, [fetchTokens]);

  const getQuote = useCallback(
    debounce(async () => {
      console.log("getQuote called with:", { fromToken, toToken, fromAmount, slippage, solBalance });
      if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0 || (solBalance !== null && parseFloat(fromAmount) > solBalance)) {
        console.log("Invalid quote conditions, resetting states");
        setToAmount("");
        setQuoteResponse(null);
        setLoading(false);
        if (solBalance !== null && parseFloat(fromAmount) > solBalance) {
          setError("Insufficient balance for the selected amount.");
        }
        return;
      }
      setLoading(true);
      console.log("Loading set to true for quote");
      const amountInLowestDenomination = Math.floor(parseFloat(fromAmount) * (10 ** fromToken.decimals)).toString();
      const slippageBps = Math.floor(slippage * 100);
      const quoteParams = {
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount: amountInLowestDenomination,
        slippageBps: slippageBps.toString(),
        swapMode: "ExactIn",
        onlyDirectRoutes: false,
        maxAccounts: 60,
      };
      console.log("Quote params:", quoteParams);
      try {
        const response = await axios.get<QuoteResponse>(JUPITER_QUOTE_API, { params: quoteParams });
        console.log("Quote API response:", response.data);
        if (response.data) {
          setQuoteResponse(response.data);
          setToAmount((Number(response.data.outAmount) / (10 ** toToken.decimals)).toFixed(6));
          setError(null);
        } else {
          throw new Error("Could not get quote");
        }
      } catch (e: any) {
        console.error("Quote error:", e.message);
        setError(`Quote error: ${e.message.includes("429") ? "Rate limit exceeded, try again later" : e.message}`);
        setToAmount("");
        setQuoteResponse(null);
      } finally {
        console.log("Quote process completed, loading set to false");
        setLoading(false);
      }
    }, 500),
    [fromAmount, fromToken, toToken, slippage, solBalance]
  );

  useEffect(() => {
    console.log("useEffect triggered for getQuote with dependencies:", { fromToken, toToken, fromAmount, solBalance });
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && (solBalance === null || parseFloat(fromAmount) <= solBalance)) {
      getQuote();
    } else {
      console.log("Invalid conditions, resetting quote states");
      setToAmount("");
      setQuoteResponse(null);
      setLoading(false);
      if (solBalance !== null && parseFloat(fromAmount) > solBalance) {
        setError("Insufficient balance for the selected amount.");
      }
    }
  }, [fromToken, toToken, fromAmount, solBalance, getQuote]);

  const handleSwap = async () => {
    console.log("handleSwap called with state:", { connected, quoteResponse, publicKey, signTransaction, loading, solBalance, fromAmount });
    if (!publicKey || !quoteResponse || !signTransaction || loading) {
      console.log("Swap disabled due to:", { publicKey, quoteResponse, signTransaction, loading });
      setError("Wallet not connected, quote not available, or loading in progress.");
      return;
    }
    // Check balance before proceeding
    const amountInLamports = Math.floor(parseFloat(fromAmount) * (10 ** (fromToken?.decimals ?? 0)));
    const feeEstimate = 0.000005 * 10 ** 9; // Rough estimate of Solana fee in lamports
    if (solBalance !== null && amountInLamports + feeEstimate > solBalance * 10 ** 9) {
      console.log("Insufficient balance for swap:", { solBalance, amountInLamports, feeEstimate });
      setError("Insufficient balance to cover the swap amount and fees.");
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log("Loading set to true for swap");
    setError(null);
    setTxId(null);

    try {
      const swapPayload = {
        quoteResponse,
        userPublicKey: publicKey.toBase58(),
        wrapAndUnwrapSol: true,
        prioritizationFeeLamports: "auto",
        dynamicComputeUnitLimit: true,
      };

      console.log("Swap payload:", swapPayload);
      const swapResponse = await axios.post(JUPITER_SWAP_API, swapPayload);
      console.log("Swap API response:", swapResponse.data);
      const { swapTransaction } = swapResponse.data;

      const transactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(transactionBuf);
      const signedTransaction = await signTransaction(transaction);
      console.log("Transaction signed successfully");

      const rawTransaction = signedTransaction.serialize();
      const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [Buffer.from(rawTransaction).toString("base64")],
        }),
      });

      const sendData = await sendResponse.json();
      console.log("Send transaction response:", sendData);
      if (sendData.error) throw new Error(`Transaction failed: ${sendData.error.message}`);
      const txId = sendData.result;
      setTxId(txId);

      await fetch(`${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "confirmTransaction",
          params: [txId, "confirmed"],
        }),
      });
      console.log("Transaction confirmed, txId:", txId);

      setError(null);
    } catch (e: any) {
      console.error("Swap error:", e.message);
      setError(`Swap error: ${e.message}`);
    } finally {
      console.log("Swap process completed, loading set to false");
      setLoading(false);
    }
  };

  const handleTokenSelect = (token: Token, type: "from" | "to") => {
    console.log("Token selected:", { token, type });
    if (type === "from") setFromToken(token);
    else setToToken(token);
    setShowFromTokens(false);
    setShowToTokens(false);
    setQuoteResponse(null);
    setTxId(null);
    setError(null);
    setToAmount("");
  };

  const handleSwapUITokens = () => {
    console.log("Swapping UI tokens");
    setIsSwapping(true);
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setIsSwapping(false);
    }, 300);
  };

  const resetSwap = () => {
    console.log("Resetting swap");
    setFromToken(undefined);
    setToToken(undefined);
    setFromAmount("0.1");
    setToAmount("");
    setQuoteResponse(null);
    setTxId(null);
    setError(null);
  };

  const filteredTokensFrom = useMemo(() => {
    console.log("Filtering tokens from with search:", searchFrom);
    return availableTokens.filter(
      (t) => t.symbol.toLowerCase().includes(searchFrom.toLowerCase()) || t.name.toLowerCase().includes(searchFrom.toLowerCase())
    );
  }, [availableTokens, searchFrom]);

  const filteredTokensTo = useMemo(() => {
    console.log("Filtering tokens to with search:", searchTo);
    return availableTokens.filter(
      (t) => t.symbol.toLowerCase().includes(searchTo.toLowerCase()) || t.name.toLowerCase().includes(searchTo.toLowerCase())
    );
  }, [availableTokens, searchTo]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } },
  };

  const iconVariants = {
    idle: { rotate: 0 },
    spin: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } },
    bounce: { y: [0, -10, 0], transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } },
  };

  const swapIconVariants = {
    idle: { rotate: 0, scale: 1 },
    swap: { rotate: 180, scale: 1.2, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const TokenSelector = ({
    tokens,
    selectedToken,
    onSelect,
    show,
    onToggle,
    search,
    setSearch,
  }: {
    tokens: Token[];
    selectedToken?: Token;
    onSelect: (token: Token) => void;
    show: boolean;
    onToggle: () => void;
    search: string;
    setSearch: (value: string) => void;
  }) => {
    console.log("TokenSelector rendered with:", { tokens, selectedToken, show, search });
    return (
      <div className="relative" role="combobox" aria-expanded={show} aria-label="Select token">
        <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
          <Button
            className="bg-white/10 hover:bg-white/20 text-white gap-2 font-medium border-none h-9 backdrop-blur-sm"
            variant="outline"
            onClick={onToggle}
            disabled={!selectedToken}
            aria-haspopup="listbox"
          >
            {selectedToken ? <TokenIcon token={selectedToken} /> : null}
            {selectedToken?.symbol || "Select"}
            <motion.div animate={{ rotate: show ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-black/90 border border-white/20 rounded-lg p-2 min-w-[250px] z-50 backdrop-blur-sm max-h-80 overflow-y-auto"
              role="listbox"
            >
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-white/60 rounded p-2 pl-8 text-sm focus:outline-none"
                  placeholder="Search token..."
                  aria-label="Search tokens"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {loadingTokens ? (
                <div className="text-center py-6 text-white/60">Loading...</div>
              ) : (
                <div className="space-y-1">
                  {tokens.map((token) => (
                    <button
                      key={token.address}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded text-left text-white focus:outline-none"
                      onClick={() => onSelect(token)}
                      role="option"
                      aria-selected={selectedToken?.address === token.address}
                    >
                      <TokenIcon token={token} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-white/60 truncate">{token.name}</div>
                      </div>
                      {selectedToken?.address === token.address && <Check className="h-4 w-4 text-green-400" />}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text mb-1"
        >
          Jupiter Swap
        </motion.h1>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="mt-6 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl overflow-hidden shadow-2xl"
        >
          <CardHeader className="p-4">
            <CardTitle className="text-white text-lg">Swap</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">From</span>
                  {fromToken?.symbol === "SOL" && solBalance !== null && (
                    <span className="text-sm text-white/60">
                      Balance: {solBalance.toFixed(6)}
                      <button
                        className="ml-2 px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition-colors"
                        onClick={() => setFromAmount(solBalance.toString())}
                      >
                        MAX
                      </button>
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <motion.input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-2xl font-medium bg-transparent outline-none w-[60%] text-white"
                    min="0"
                    step="0.01"
                    aria-label="From amount"
                  />
                  <TokenSelector
                    tokens={filteredTokensFrom}
                    selectedToken={fromToken}
                    onSelect={(token) => handleTokenSelect(token, "from")}
                    show={showFromTokens}
                    onToggle={() => setShowFromTokens(!showFromTokens)}
                    search={searchFrom}
                    setSearch={setSearchFrom}
                  />
                </div>
              </div>

              <div className="flex justify-center -mt-2 -mb-2 z-10 relative">
                <motion.div
                  variants={swapIconVariants}
                  initial="idle"
                  animate={isSwapping ? "swap" : "idle"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={handleSwapUITokens}
                    size="icon"
                    className="rounded-full h-10 w-10 shadow-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-white/30 backdrop-blur-sm"
                    disabled={isSwapping}
                    aria-label="Swap tokens"
                  >
                    <ArrowDown className="h-5 w-5 text-white" />
                  </Button>
                </motion.div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">To (estimated)</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <motion.input
                    type="text"
                    value={toAmount}
                    className="text-2xl font-medium bg-transparent outline-none w-[60%] text-white"
                    readOnly
                    aria-label="To amount"
                  />
                  <TokenSelector
                    tokens={filteredTokensTo}
                    selectedToken={toToken}
                    onSelect={(token) => handleTokenSelect(token, "to")}
                    show={showToTokens}
                    onToggle={() => setShowToTokens(!showToTokens)}
                    search={searchTo}
                    setSearch={setSearchTo}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>

        <AnimatePresence>
          {quoteResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4"
            >
              <Card className="bg-white/5 text-white/70 p-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>
                    Rate: 1 {fromToken?.symbol} ={" "}
                    {(Number(quoteResponse.outAmount) / 10 ** (toToken?.decimals ?? 0)) /
                      (Number(quoteResponse.inAmount) / 10 ** (fromToken?.decimals ?? 0))}{" "}
                    {toToken?.symbol}
                  </span>
                  <span>Price Impact: {(parseFloat(quoteResponse.priceImpactPct) * 100).toFixed(2)}%</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              min="0.1"
              max="5"
              step="0.1"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
              aria-label="Slippage tolerance"
            />
            <span className="text-white/70 text-sm">{slippage}%</span>
          </div>
          <Button
            onClick={handleSwap}
            disabled={loading || !quoteResponse || !connected}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            aria-label="Swap tokens"
          >
            {connected ? (loading ? "Processing..." : "Swap") : "Connect Wallet"}
          </Button>
          <Button
            onClick={resetSwap}
            variant="outline"
            className="w-full text-white/70 hover:text-white border-white/20"
            aria-label="Reset swap"
          >
            Reset
          </Button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-red-400"
              role="alert"
            >
              {error}
            </motion.div>
          )}
          {txId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-green-400"
              role="alert"
            >
              <p>Swap Successful!</p>
              <a
                href={`https://solscan.io/tx/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Solscan <ExternalLink className="inline h-4 w-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TokenIcon({ token }: { token: Token }) {
  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
      {token.logoURI ? (
        <img src={token.logoURI} alt={token.symbol} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs text-white">{token.symbol.slice(0, 2)}</span>
      )}
    </div>
  );
}