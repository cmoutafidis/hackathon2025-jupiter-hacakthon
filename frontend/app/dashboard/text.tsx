"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  LineChart,
  MessageCircle,
  ArrowLeftRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Settings,
  ChevronDown,
  RefreshCw,
  BarChart3,
  TrendingDown,
  Wallet,
  DollarSign,
  Activity,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Types and interfaces
interface DashboardStats {
  portfolioValue: string
  totalTransactions: number
  activeChains: number
  totalTokens: number
}

interface MarketData {
  data: Array<{
    prices: Array<{
      time: string
      price: string
    }>
  }>
}


interface LoadingStep {
  name: string
  status: "pending" | "loading" | "completed" | "error"
  message: string
}


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

const iconVariants = {
  idle: { 
    rotate: 0,
    scale: 1
  },
  hover: { 
    rotate: [0, -10, 10, -10, 0],
    scale: 1.1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Solana-focused configuration
const chainOptions = [{ name: "Solana", value: "501", label: "SOL" }]

const quickActions = [
  {
    id: "ai-chat",
    label: "AI Assistant",
    icon: MessageCircle,
    href: "/dashboard/ai-chat",
    gradient: "from-purple-400 via-pink-500 to-purple-600",
    hoverGradient: "from-purple-300 via-pink-400 to-purple-500",
    shadowColor: "shadow-purple-500/25",
  },
  {
    id: "swap",
    label: "Swap",
    icon: ArrowLeftRight,
    href: "/dashboard/swap",
    gradient: "from-emerald-400 via-teal-500 to-blue-500",
    hoverGradient: "from-emerald-300 via-teal-400 to-blue-400",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: TrendingUp,
    href: "/dashboard/portfolio",
    gradient: "from-orange-400 via-red-500 to-pink-500",
    hoverGradient: "from-orange-300 via-red-400 to-pink-400",
    shadowColor: "shadow-orange-500/25",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    hoverGradient: "from-violet-300 via-purple-400 to-indigo-500",
    shadowColor: "shadow-violet-500/25",
  },
]

// Real Solana address for data fetching
const SOLANA_ADDRESS = "52C9T2T7JRojtxumYnYZhyUmrN7kqzvCLc4Ksvjk7TxD"


class DashboardRateLimitManager {
  private lastRequestTime = 0
  private minDelay = 3000 // 3 seconds between requests
  private maxRetries = 3

  async makeRequest(
    apiCall: () => Promise<any>,
    stepName: string,
    updateStep: (step: string, status: string, message: string) => void,
  ): Promise<any> {
    let retries = 0

    while (retries < this.maxRetries) {
      try {
        // Ensure minimum delay between requests
        const now = Date.now()
        const timeSinceLastRequest = now - this.lastRequestTime

        if (timeSinceLastRequest < this.minDelay) {
          const waitTime = this.minDelay - timeSinceLastRequest
          updateStep(stepName, "loading", `Waiting ${Math.ceil(waitTime / 1000)}s to prevent rate limiting...`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }

        updateStep(stepName, "loading", `Fetching ${stepName.toLowerCase()}...`)
        this.lastRequestTime = Date.now()

        const result = await apiCall()
        updateStep(stepName, "completed", `✅ ${stepName} loaded successfully`)
        return result
      } catch (error: any) {
        retries++

        if (error.message?.includes("429") || error.message?.includes("rate limit")) {
          const backoffDelay = Math.min(this.minDelay * Math.pow(2, retries), 15000) // Max 15s
          updateStep(
            stepName,
            "error",
            `Rate limited. Retrying in ${Math.ceil(backoffDelay / 1000)}s... (${retries}/${this.maxRetries})`,
          )
          await new Promise((resolve) => setTimeout(resolve, backoffDelay))
        } else if (retries >= this.maxRetries) {
          updateStep(stepName, "error", `❌ Failed to load ${stepName.toLowerCase()}`)
          throw error
        } else {
          updateStep(stepName, "error", `Retry ${retries}/${this.maxRetries} for ${stepName.toLowerCase()}...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }
  }
}

// Helper functions
function formatTimestamp(timestamp: string | number): string {
  const date = new Date(Number(timestamp))
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatPrice(price: string | number): string {
  return Number(price).toFixed(6)
}

function formatCurrency(value: string | number): string {
  const num = Number(value)
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`
  }
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

function filterNonZeroTokens(tokens: any[]): any[] {
  try {
    if (!Array.isArray(tokens)) return []

    return tokens.filter((token) => {
      try {
        const balance = Number(token?.balance || 0)
        const price = Number(token?.tokenPrice || 0)
        const value = balance * price
        return value > 0.01 && balance > 0 // Filter tokens worth less than $0.01
      } catch (error) {
        console.warn("Error filtering token:", token, error)
        return false
      }
    })
  } catch (error) {
    console.warn("Error in filterNonZeroTokens:", error)
    return []
  }
}

// Enhanced Chart component
function SolanaMarketChart({ data, title }: { data: MarketData; title: string }) {
  if (!data?.data?.[0]?.prices) return null

  const chartData = data.data[0].prices
    .map((item: any) => ({
      time: formatTimestamp(item.time),
      price: Number(item.price),
      timestamp: Number(item.time),
    }))
    .reverse()
    .slice(-24)

  const currentPrice = chartData[chartData.length - 1]?.price || 0
  const previousPrice = chartData[chartData.length - 2]?.price || 0
  const priceChange = currentPrice - previousPrice
  const isPositive = priceChange >= 0

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="w-full"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </motion.div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
              key={currentPrice}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ${formatPrice(currentPrice)}
            </motion.span>
            <motion.span 
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                isPositive 
                  ? "text-emerald-300 bg-emerald-500/20 border border-emerald-500/30" 
                  : "text-red-300 bg-red-500/20 border border-red-500/30"
              }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: isPositive ? [-2, 0, -2] : [2, 0, 2] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </motion.div>
              {isPositive ? "+" : ""}{formatPrice(priceChange)}
            </motion.span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "white", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(147, 51, 234, 0.3)" }}
                  tickLine={{ stroke: "rgba(147, 51, 234, 0.3)" }}
                />
                <YAxis
                  tick={{ fill: "white", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(147, 51, 234, 0.3)" }}
                  tickLine={{ stroke: "rgba(147, 51, 234, 0.3)" }}
                  domain={["dataMin - 0.01", "dataMax + 0.01"]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(147, 51, 234, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    backdropFilter: "blur(10px)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#a855f7", stroke: "#ffffff", strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7"/>
                    <stop offset="50%" stopColor="#ec4899"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Market data API call function with error handling
async function callMarketDataApi(type: string, tokenName = "SOL") {
  const tokenContractAddress = "So11111111111111111111111111111111111111112" // SOL token address

  if (type === "total_token_balance") {
    const body = {
      address: SOLANA_ADDRESS,
      chains: "501",
      excludeRiskToken: "0",
    }
    const response = await fetch("/api/portfolio/total_token_balances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  if (type === "transaction_history") {
    const body = {
      address: SOLANA_ADDRESS,
      chains: "501",
      limit: "20",
    }
    const response = await fetch("/api/portfolio/history_by_add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  if (type === "token_value") {
    const body = {
      address: SOLANA_ADDRESS,
      chains: "501",
      excludeRiskToken: "0",
    }
    const response = await fetch("/api/portfolio/token_value", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  // Market data calls
  const body = {
    method: "GET",
    path: type === "hist_data" ? "/api/v5/dex/index/historical-price" : "/api/v5/dex/market/price",
    data: [
      {
        chainIndex: "501",
        tokenContractAddress,
      },
    ],
  }

  const response = await fetch("/api/market_data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return await response.json()
}


// DashboardCard Component
function DashboardCard({
  id,
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient
}: {
  id: string
  title: string
  value: string
  change: string
  trend: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
}) {
  return (
    <motion.div variants={cardVariants} whileHover="hover">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10 animate-pulse`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">{title}</p>
              <motion.p
                className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.p>
              <p className="text-white/60 text-xs mt-1">{change}</p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-white/5 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="h-6 w-6 text-purple-400" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}



export default function DashboardPage() {
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [selectedChain, setSelectedChain] = useState(chainOptions[0])
  const [showChainDropdown, setShowChainDropdown] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    portfolioValue: "125,430.25",
    totalTransactions: 47,
    activeChains: 1,
    totalTokens: 12,
  })
  const [tokenAssets, setTokenAssets] = useState<any[]>([
    { symbol: "SOL", balance: "45.67", tokenPrice: "98.50", value: "4,498.50" },
    { symbol: "USDC", balance: "2,500.00", tokenPrice: "1.00", value: "2,500.00" },
    { symbol: "RAY", balance: "150.25", tokenPrice: "2.45", value: "368.11" },
  ])
  const [transactions, setTransactions] = useState<any[]>([
    { symbol: "SOL", amount: "+2.5", txTime: Date.now() / 1000, txHash: "abc123def456" },
    { symbol: "USDC", amount: "-100", txTime: (Date.now() - 86400000) / 1000, txHash: "def456ghi789" },
  ])
  const [marketChart, setMarketChart] = useState<MarketData>({
    data: [{
      prices: Array.from({ length: 24 }, (_, i) => ({
        time: (Date.now() - (23 - i) * 3600000).toString(),
        price: (98 + Math.random() * 10 - 5).toString()
      }))
    }]
  })
  const [currentPrice, setCurrentPrice] = useState<string>("98.50")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const controls = useAnimation()

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date())
      setLoading(false)
    }, 1000)
  }

  return (
    <motion.div 
      className="space-y-10 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147, 51, 234, 0.05), transparent, rgba(59, 130, 246, 0.05))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.05), transparent, rgba(147, 51, 234, 0.05))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.05), transparent, rgba(59, 130, 246, 0.05))"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>



      {/* Market Chart Section */}
      {marketChart && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <div className="lg:col-span-2">
            <SolanaMarketChart data={marketChart} title="SOL Price History" />
          </div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/60">Current Price</span>
                  <span className="text-white font-bold">${Number(currentPrice).toFixed(2)}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/60">Portfolio Value</span>
                  <span className="text-white font-bold">{formatCurrency(dashboardStats.portfolioValue)}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/60">Total Tokens</span>
                  <span className="text-white font-bold">{dashboardStats.totalTokens}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/60">Address</span>
                  <span className="text-white font-mono text-xs">{SOLANA_ADDRESS.slice(0, 8)}...</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10"
        variants={containerVariants}
      >
        {/* Recent Transactions */}
        <motion.div className="col-span-2" variants={cardVariants} whileHover="hover">
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative z-10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                  Recent Transactions
                </CardTitle>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" className="gap-1 text-white/80 hover:text-white hover:bg-purple-500/20">
                    View All 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(147, 51, 234, 0.3)"
                    }}
                    className="flex justify-between items-center p-4 rounded-lg transition-all border border-transparent hover:shadow-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`p-2.5 rounded-full border ${
                          tx.amount && Number(tx.amount) > 0
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {tx.amount && Number(tx.amount) > 0 ? "+" : "-"}
                      </motion.div>
                      <div>
                        <p className="font-medium text-white/90">{tx.symbol || "SOL"}</p>
                        <p className="text-sm text-white/60">
                          {tx.txTime ? new Date(Number(tx.txTime) * 1000).toLocaleString() : "Recent"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white/90">{tx.amount || "0"}</p>
                      <p className="text-sm text-white/60">
                        {tx.txHash ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}` : "Transaction"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={cardVariants} whileHover="hover">
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={cardVariants}
                    onHoverStart={() => setIsHovering(action.id)}
                    onHoverEnd={() => setIsHovering(null)}
                    className="relative"
                  >
                    <Button
                      asChild
                      className={`w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient} shadow-lg ${action.shadowColor} rounded-xl border border-transparent hover:border-purple-500/30 transition-all duration-300`}
                    >
                      <a href={action.href}>
                        <motion.div variants={iconVariants} animate={isHovering === action.id ? "hover" : "idle"}>
                          <action.icon className="h-8 w-8 mb-2 text-white" />
                        </motion.div>
                        <span className="text-white font-medium text-sm">{action.label}</span>
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Token Assets Section */}
      <motion.div variants={cardVariants} whileHover="hover">
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50 border-0 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5" />
          <CardHeader className="relative z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
                Token Assets
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="gap-1 text-white/80 hover:text-white hover:bg-purple-500/20">
                  View All
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {tokenAssets.map((asset, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(147, 51, 234, 0.3)"
                  }}
                  className="flex justify-between items-center p-4 rounded-lg transition-all border border-transparent hover:shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-2.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <CreditCard className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-white/90">{asset.symbol}</p>
                      <p className="text-sm text-white/60">{asset.balance} tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white/90">{formatCurrency(asset.value)}</p>
                    <p className="text-sm text-white/60">${asset.tokenPrice}/token</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}