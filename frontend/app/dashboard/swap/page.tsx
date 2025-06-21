"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Settings, Clock, Zap, Info, ChevronDown, Check, ExternalLink, Copy, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Token interface for API response
interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoUrl?: string
  hasLogo?: boolean
}

interface SolanaSwapResult {
  success: boolean
  action: string
  timestamp: string
  chainId: string
  code: string
  data: any
  msg: string
}

interface ExecuteResult {
  success: boolean
  transactionId: string
  explorerUrl: string
  tokenInfo: {
    fromToken: { symbol: string; decimals: number; price: string }
    toToken: { symbol: string; decimals: number; price: string }
  }
  swapDetails: {
    fromAmount: string
    fromToken: string
    toToken: string
    slippage: string
  }
  instructionsUsed: number
  lookupTablesUsed: number
}

export default function EnhancedSolanaSwap() {
  // State for tokens
  const [availableTokens, setAvailableTokens] = useState<Token[]>([])
  const [loadingTokens, setLoadingTokens] = useState(true)
  const [tokensError, setTokensError] = useState<string | null>(null)

  // Add these new state variables after the existing state declarations
  const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const [retryCount, setRetryCount] = useState(0)

  // Default tokens (fallback)
  const defaultTokens: Token[] = [
    { symbol: "SOL", name: "Solana", address: "11111111111111111111111111111111", decimals: 9 },
    { symbol: "USDC", name: "USD Coin", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  ]

  const [fromToken, setFromToken] = useState<Token>(defaultTokens[0])
  const [toToken, setToToken] = useState<Token>(defaultTokens[1])
  const [fromAmount, setFromAmount] = useState("0.1")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [swapResult, setSwapResult] = useState<SolanaSwapResult | null>(null)
  const [quoteResult, setQuoteResult] = useState<any>(null)
  const [executeResult, setExecuteResult] = useState<ExecuteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [quoting, setQuoting] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFromTokens, setShowFromTokens] = useState(false)
  const [showToTokens, setShowToTokens] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // Demo Solana wallet address
  const userWalletAddress = "DemHwXRcTyc76MuRwXwyhDdVpYLwoDz1T2rVpzaajMsR"

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const iconVariants = {
    idle: { rotate: 0 },
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const swapIconVariants = {
    idle: { rotate: 0, scale: 1 },
    swap: {
      rotate: 180,
      scale: 1.2,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const fetchSupportedTokens = async (isRetry = false) => {
    // Prevent multiple simultaneous requests
    if (isRequestInProgress) {
      console.log("Request already in progress, skipping...")
      return
    }

    // Rate limiting: minimum 2 seconds between requests
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    const minDelay = 2000 // 2 seconds

    if (timeSinceLastRequest < minDelay && !isRetry) {
      console.log("Rate limiting: waiting before next request...")
      setTimeout(() => fetchSupportedTokens(isRetry), minDelay - timeSinceLastRequest)
      return
    }

    setIsRequestInProgress(true)
    setLoadingTokens(true)
    setTokensError(null)
    setLastRequestTime(now)

    try {
      // Add exponential backoff delay for retries
      if (isRetry && retryCount > 0) {
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000) // Max 10 seconds
        console.log(`Retry attempt ${retryCount}, waiting ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      console.log("Fetching supported tokens from OKX API...")

      const response = await fetch("/api/dex-tokens?chainIndex=501", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before trying again.")
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.tokens && data.tokens.length > 0) {
        setAvailableTokens(data.tokens)
        setRetryCount(0) // Reset retry count on success

        // Update default selections if they exist in the fetched tokens
        const solToken = data.tokens.find((token: Token) => token.symbol === "SOL")
        const usdcToken = data.tokens.find((token: Token) => token.symbol === "USDC")

        if (solToken && fromToken.symbol === "SOL") setFromToken(solToken)
        if (usdcToken && toToken.symbol === "USDC") setToToken(usdcToken)

        console.log(`Successfully loaded ${data.tokens.length} supported tokens from OKX`)
        setTokensError(null)
      } else {
        throw new Error(data.error || "No tokens received from API")
      }
    } catch (error: any) {
      console.error("Error fetching tokens:", error)
      setRetryCount((prev) => prev + 1)

      let errorMessage = error.message
      if (error.message.includes("Rate limit") || error.message.includes("429")) {
        errorMessage = "Too many requests. Please wait a moment before retrying."
      } else if (error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again."
      }

      setTokensError(errorMessage)

      // Use default tokens as fallback only if this isn't a retry
      if (!isRetry) {
        console.log("Using default tokens as fallback...")
        setAvailableTokens(defaultTokens)
      }
    } finally {
      setIsRequestInProgress(false)
      setLoadingTokens(false)
    }
  }

  useEffect(() => {
    // Add a small delay on initial load to prevent immediate API calls
    const initialDelay = setTimeout(() => {
      fetchSupportedTokens(false)
    }, 500) // 500ms delay on initial load

    return () => clearTimeout(initialDelay)
  }, []) // Remove any dependencies to prevent multiple calls

  const handleSwapTokens = async () => {
    setIsSwapping(true)

    // Animate the swap
    await new Promise((resolve) => setTimeout(resolve, 600))

    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    // Clear previous results
    setSwapResult(null)
    setQuoteResult(null)
    setExecuteResult(null)

    setIsSwapping(false)
  }

  const formatAmount = (amount: string, decimals: number): string => {
    const num = Number.parseFloat(amount || "0")
    return Math.floor(num * Math.pow(10, decimals)).toString()
  }

  const formatDisplayAmount = (amount: string, decimals: number): string => {
    const num = Number.parseFloat(amount || "0")
    return (num / Math.pow(10, decimals)).toFixed(6)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Get quote first
  const handleGetQuote = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setQuoting(true)
    setError(null)
    setQuoteResult(null)

    try {
      const formattedAmount = formatAmount(fromAmount, fromToken.decimals)

      const params = {
        action: "quote",
        chainId: "501", // Solana
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: formattedAmount,
        slippage: slippage,
        userWalletAddress: userWalletAddress,
      }

      console.log("Quote params:", params)

      const res = await fetch("/api/dex-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await res.json()
      console.log("Quote response:", data)

      if (data.error) {
        setError(data.error)
      } else if (data.success && data.data && data.data.length > 0) {
        setQuoteResult(data)
        // Update estimated receive amount
        const estimatedAmount = formatDisplayAmount(data.data[0].toTokenAmount, toToken.decimals)
        setToAmount(estimatedAmount)
      } else {
        setError(data.msg || "Failed to get quote")
      }
    } catch (e: any) {
      setError(e.message || "Network error occurred")
    } finally {
      setQuoting(false)
    }
  }

  // Get swap instructions
  const handleGetSwapInstructions = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)
    setSwapResult(null)

    try {
      const formattedAmount = formatAmount(fromAmount, fromToken.decimals)

      const params = {
        action: "instructions",
        chainId: "501", // Solana
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: formattedAmount,
        slippage: slippage,
        userWalletAddress: userWalletAddress,
        feePercent: "1",
        priceTolerance: "0",
        autoSlippage: "false",
        pathNum: "3",
      }

      console.log("Swap instruction params:", params)

      const res = await fetch("/api/dex-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await res.json()
      console.log("Swap instructions response:", data)

      if (data.error) {
        setError(data.error)
      } else if (data.success && data.data) {
        setSwapResult(data)
        // Update estimated receive amount if available
        if (data.data.toTokenAmount) {
          const estimatedAmount = formatDisplayAmount(data.data.toTokenAmount, toToken.decimals)
          setToAmount(estimatedAmount)
        }
      } else {
        setError(data.msg || "Failed to get swap instructions")
      }
    } catch (e: any) {
      setError(e.message || "Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Execute swap
  const handleExecuteSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setExecuting(true)
    setError(null)
    setExecuteResult(null)

    try {
      const formattedAmount = formatAmount(fromAmount, fromToken.decimals)

      const params = {
        action: "execute",
        chainId: "501", // Solana
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: formattedAmount,
        slippage: slippage,
        userWalletAddress: userWalletAddress,
        feePercent: "1",
        priceTolerance: "0",
        autoSlippage: "false",
        pathNum: "3",
      }

      console.log("Execute swap params:", params)

      const res = await fetch("/api/dex-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const data = await res.json()
      console.log("Execute swap response:", data)

      if (data.error) {
        setError(data.error)
      } else if (data.success) {
        setExecuteResult(data)
      } else {
        setError(data.msg || "Failed to execute swap")
      }
    } catch (e: any) {
      setError(e.message || "Network error occurred")
    } finally {
      setExecuting(false)
    }
  }

  // Replace the retry button onClick with this improved handler:
  const handleRetryTokens = () => {
    setRetryCount(0) // Reset retry count for manual retry
    fetchSupportedTokens(true)
  }

  const TokenSelector = ({
    tokens,
    selectedToken,
    onSelect,
    show,
    onToggle,
  }: {
    tokens: Token[]
    selectedToken: Token
    onSelect: (token: Token) => void
    show: boolean
    onToggle: () => void
  }) => (
    <div className="relative">
      <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
        <Button
          className="bg-white/10 hover:bg-white/20 text-white gap-2 font-medium border-none h-9 backdrop-blur-sm"
          variant="outline"
          onClick={onToggle}
        >
          <TokenIcon token={selectedToken} />
          {selectedToken.symbol}
          <motion.div animate={{ rotate: show ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </motion.div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-black/90 border border-white/20 rounded-lg p-2 min-w-[250px] z-50 backdrop-blur-sm max-h-80 overflow-y-auto"
          >
            {loadingTokens ? (
              <div className="text-center py-6 text-white/60">
                <motion.div variants={iconVariants} animate="spin" className="mx-auto mb-3">
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
                <div className="text-sm">Loading tokens...</div>
                <div className="text-xs text-white/40 mt-1">
                  {isRequestInProgress ? "Fetching from OKX API..." : "Please wait..."}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {tokens.map((token, index) => (
                  <motion.button
                    key={token.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded text-left text-white transition-colors"
                    onClick={() => {
                      onSelect(token)
                      onToggle()
                      // Clear results when token changes
                      setSwapResult(null)
                      setQuoteResult(null)
                      setExecuteResult(null)
                      setToAmount("")
                    }}
                  >
                    <TokenIcon token={token} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-white/60 truncate">{token.name}</div>
                      <div className="text-xs text-white/40 font-mono truncate">
                        {token.address.slice(0, 8)}...{token.address.slice(-6)}
                      </div>
                    </div>
                    {selectedToken.address === token.address && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {tokensError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 border-t border-white/10 mt-2"
              >
                <div className="text-red-400 text-xs mb-3">{tokensError}</div>
                <div className="flex gap-2 justify-center">
                  <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:bg-white/10 text-white text-xs"
                      onClick={handleRetryTokens}
                      disabled={isRequestInProgress}
                    >
                      <motion.div
                        variants={iconVariants}
                        animate={isRequestInProgress ? "spin" : "idle"}
                        className="mr-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </motion.div>
                      {isRequestInProgress ? "Retrying..." : "Retry"}
                    </Button>
                  </motion.div>
                  {retryCount > 0 && <div className="text-xs text-white/40 self-center">Attempt {retryCount}</div>}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text mb-1"
            >
              Solana Swap
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/60"
            >
              {loadingTokens
                ? "Loading supported tokens..."
                : `A user-friendly Solana DEX with low fees and efficient token swaps • ${availableTokens.length} tokens available`}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-2"
          >
            <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/20 bg-blue-900/20 hover:bg-white/10 text-white backdrop-blur-sm"
                onClick={handleRetryTokens}
                disabled={loadingTokens || isRequestInProgress}
              >
                <motion.div variants={iconVariants} animate={loadingTokens ? "spin" : "idle"}>
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
            
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">From</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full border border-purple-500/40 backdrop-blur-sm"
              >
                <span className="text-xs text-purple-200 font-medium">Solana</span>
              </motion.div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                type="text"
                value={fromAmount}
                onChange={(e) => {
                  setFromAmount(e.target.value)
                  setSwapResult(null)
                  setQuoteResult(null)
                  setExecuteResult(null)
                  setToAmount("")
                }}
                className="text-2xl font-medium bg-transparent outline-none w-[60%] text-white placeholder-white/40"
                placeholder="0.0"
              />
              <div className="flex gap-2">
                <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-blue-900/20 hover:bg-white/10 text-white text-xs h-7 backdrop-blur-sm"
                    onClick={() => {
                      setFromAmount("1.0")
                      setSwapResult(null)
                      setQuoteResult(null)
                      setExecuteResult(null)
                      setToAmount("")
                    }}
                  >
                    MAX
                  </Button>
                </motion.div>
                <TokenSelector
                  tokens={availableTokens}
                  selectedToken={fromToken}
                  onSelect={setFromToken}
                  show={showFromTokens}
                  onToggle={() => setShowFromTokens(!showFromTokens)}
                />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-white/60 mt-1"
            >
              Balance: 12.45 {fromToken.symbol} • ${fromToken.symbol === "SOL" ? "97.35" : "1.00"}
            </motion.div>
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
                onClick={handleSwapTokens}
                size="icon"
                className="rounded-full h-10 w-10 shadow-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border border-white/30 hover:border-white/40 backdrop-blur-sm"
                disabled={isSwapping}
              >
                <ArrowDown className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">To</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full border border-purple-500/40 backdrop-blur-sm"
              >
                <span className="text-xs text-purple-200 font-medium">Solana</span>
              </motion.div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                type="text"
                value={toAmount}
                className="text-2xl font-medium bg-transparent outline-none w-[60%] text-white placeholder-white/40"
                placeholder="0.0"
                readOnly
              />
              <TokenSelector
                tokens={availableTokens}
                selectedToken={toToken}
                onSelect={setToToken}
                show={showToTokens}
                onToggle={() => setShowToTokens(!showToTokens)}
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-sm text-white/60 mt-1"
            >
              Balance: 350.21 {toToken.symbol} • ${toToken.symbol === "USDC" ? "350.21" : "1.00"}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-4"
        >
          <motion.div
            whileHover="hover"
            variants={cardVariants}
            className="backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/80 font-medium">Transaction Settings</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-white/60">Slippage Tolerance</span>
                  <button className="text-white/40 hover:text-white/60">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {["0.1", "0.5", "1.0", "3.0"].map((value, index) => (
                    <motion.div
                      key={value}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 px-2.5 py-1 border-white/20 bg-blue-900/20 text-white text-xs backdrop-blur-sm ${
                          slippage === value
                            ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-500/50"
                            : "hover:bg-white/10"
                        }`}
                        onClick={() => setSlippage(value)}
                      >
                        {value}%
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/60">Network</span>
                <span className="text-sm text-white/80 font-medium">Solana Mainnet</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/60">DEX Aggregator</span>
                <span className="text-sm text-white/80 font-medium">OKX</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/60">Supported Tokens</span>
                <span className="text-sm text-white/80 font-medium">{availableTokens.length} tokens</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3 mt-6"
        >
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            animate={quoting ? "loading" : "idle"}
          >
            <Button
              className="py-6 text-sm gap-2 bg-gradient-to-br from-purple-900 via-blue-900 hover:from-purple-500/40 hover:to-blue-500/40 border border-purple-500/40 hover:border-purple-500/60 text-white shadow-lg backdrop-blur-sm"
              size="lg"
              onClick={handleGetQuote}
              disabled={quoting || !fromAmount || Number.parseFloat(fromAmount) <= 0}
            >
              <motion.div variants={iconVariants} animate={quoting ? "bounce" : "idle"}>
                <Info className="h-4 w-4" />
              </motion.div>
              {quoting ? "Getting..." : "Quote"}
            </Button>
          </motion.div>



          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            animate={executing ? "loading" : "idle"}
          >
            <Button
              className="py-6 text-sm gap-2 bg-gradient-to-br from-purple-900 via-blue-900 hover:from-purple-500/40 hover:to-emerald-500/40 border border-green-500/40 hover:border-green-500/60 text-white shadow-lg backdrop-blur-sm"
              size="lg"
              onClick={handleExecuteSwap}
              disabled={executing || !fromAmount || Number.parseFloat(fromAmount) <= 0}
            >
              <motion.div variants={iconVariants} animate={executing ? "bounce" : "idle"}>
                <Zap className="h-4 w-4" />
              </motion.div>
              {executing ? "Executing..." : "Execute"}
            </Button>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mt-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/40 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-red-300 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {quoteResult && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mt-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/40 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <motion.div variants={iconVariants} animate="bounce">
                      <Info className="h-5 w-5" />
                    </motion.div>
                    Swap Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quoteResult.data.map((quote: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">You Pay:</span>
                          <div className="text-white font-medium">
                            {formatDisplayAmount(quote.fromTokenAmount, fromToken.decimals)} {fromToken.symbol}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">You Receive:</span>
                          <div className="text-white font-medium">
                            {formatDisplayAmount(quote.toTokenAmount, toToken.decimals)} {toToken.symbol}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Rate:</span>
                          <div className="text-white font-medium">
                            1 {fromToken.symbol} ={" "}
                            {(Number(quote.toTokenAmount) / Number(quote.fromTokenAmount)).toFixed(4)} {toToken.symbol}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Price Impact:</span>
                          <div className="text-green-400 font-medium">{"< 0.1%"}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {swapResult && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mt-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/40 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <motion.div variants={iconVariants} animate="spin">
                      <Zap className="h-5 w-5" />
                    </motion.div>
                    Swap Instructions Ready
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">You Pay:</span>
                        <div className="text-white font-medium">
                          {formatDisplayAmount(swapResult.data.fromTokenAmount, fromToken.decimals)} {fromToken.symbol}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">You Receive:</span>
                        <div className="text-white font-medium">
                          {formatDisplayAmount(swapResult.data.toTokenAmount, toToken.decimals)} {toToken.symbol}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Minimum Received:</span>
                        <div className="text-white font-medium">
                          {formatDisplayAmount(swapResult.data.minimumReceived, toToken.decimals)} {toToken.symbol}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Instructions:</span>
                        <div className="text-white font-medium">{swapResult.data.instructionLists.length} steps</div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="text-white/80 font-medium mb-2">Solana Transaction Details</div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-white/60">Instructions:</span>
                          <span className="text-white">{swapResult.data.instructionLists.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Lookup Tables:</span>
                          <span className="text-white">{swapResult.data.addressLookupTableAccount.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">From Token Price:</span>
                          <span className="text-white">${swapResult.data.fromToken.tokenUnitPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">To Token Price:</span>
                          <span className="text-white">${swapResult.data.toToken.tokenUnitPrice}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {executeResult && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mt-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/40 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Zap className="h-5 w-5 text-green-400" />
                    </motion.div>
                    Swap Executed Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Swapped:</span>
                        <div className="text-white font-medium">
                          {formatDisplayAmount(
                            executeResult.swapDetails.fromAmount,
                            executeResult.tokenInfo.fromToken.decimals,
                          )}{" "}
                          {executeResult.swapDetails.fromToken}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">For:</span>
                        <div className="text-white font-medium">{executeResult.swapDetails.toToken}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Instructions Used:</span>
                        <div className="text-white font-medium">{executeResult.instructionsUsed}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Lookup Tables:</span>
                        <div className="text-white font-medium">{executeResult.lookupTablesUsed}</div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="text-white/80 font-medium mb-2">Transaction Details</div>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Transaction ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs">
                              {executeResult.transactionId.slice(0, 8)}...{executeResult.transactionId.slice(-8)}
                            </span>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-white/10"
                                onClick={() => copyToClipboard(executeResult.transactionId)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/40 hover:bg-green-500/10 text-green-300 gap-2 backdrop-blur-sm"
                              onClick={() => window.open(executeResult.explorerUrl, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                              View on Solscan
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="text-green-300 font-medium mb-2 flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                        Transaction Confirmed
                      </div>
                      <div className="text-sm text-green-200">
                        Your swap has been successfully executed on Solana. The transaction has been confirmed and is
                        now visible on the blockchain.
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="mt-5 text-center"
        >
          <p className="text-xs text-white/40">
            Powered by OKX DEX Aggregator on Solana. Best rates across all Solana DEXs.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function TokenIcon({ token }: { token: Token }) {
  // If token has a logo URL, use it
  if (token.logoUrl && token.hasLogo) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center"
      >
        <img
          src={token.logoUrl || "/placeholder.svg"}
          alt={token.symbol}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to gradient if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            target.parentElement!.innerHTML = `<div class="w-5 h-5 rounded-full ${getTokenGradient(token.symbol)} flex items-center justify-center text-white text-xs font-bold">${token.symbol.slice(0, 2)}</div>`
          }}
        />
      </motion.div>
    )
  }

  // Fallback to gradient background with token symbol
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`w-5 h-5 rounded-full ${getTokenGradient(token.symbol)} flex items-center justify-center text-white text-xs font-bold`}
    >
      {token.symbol.slice(0, 2)}
    </motion.div>
  )
}

function getTokenGradient(symbol: string): string {
  const colors: Record<string, string> = {
    SOL: "bg-gradient-to-r from-purple-500 to-blue-500",
    USDC: "bg-gradient-to-r from-blue-500 to-cyan-500",
    USDT: "bg-gradient-to-r from-green-500 to-emerald-500",
    RAY: "bg-gradient-to-r from-blue-400 to-purple-500",
    SRM: "bg-gradient-to-r from-cyan-400 to-blue-500",
    ORCA: "bg-gradient-to-r from-pink-400 to-purple-500",
    MNGO: "bg-gradient-to-r from-yellow-400 to-orange-500",
    STEP: "bg-gradient-to-r from-green-400 to-blue-500",
    COPE: "bg-gradient-to-r from-red-400 to-pink-500",
    FIDA: "bg-gradient-to-r from-indigo-400 to-purple-500",
  }
  return colors[symbol] || "bg-gradient-to-r from-gray-500 to-gray-600"
}
