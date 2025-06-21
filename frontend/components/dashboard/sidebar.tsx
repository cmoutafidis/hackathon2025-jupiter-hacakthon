
"use client"

import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { 
  ChevronLeft, 
  BarChart2, 
  MessageSquare, 
  ArrowLeftRight, 
  Settings, 
  Home,
  ArrowLeft,
  Wallet,
  User,
  LogOut,
  Copy,
  Bell,
  Brain
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

// Get wallet data from context

const truncateAddress = (address?: string | null) => {
  if (!address) return ""
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const { connectWallet, disconnectWallet, connected, connecting,publicKey } = useWallet()

  const pathname = usePathname()
  const [copiedAddress, setCopiedAddress] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      label: "AI Insights",
      icon: Brain,
      href: "/dashboard/ai-chat",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      label: "Swap",
      icon: ArrowLeftRight,
      href: "/dashboard/swap",
      gradient: "from-pink-400 to-purple-500"
    },
    {
      label: "Cross Chain",
      icon: ArrowLeftRight,
      href: "/dashboard/cross-chain",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      label: "Portfolio",
      icon: BarChart2,
      href: "/dashboard/portfolio",
      gradient: "from-purple-500 to-cyan-400"
    },

    {
      label: "Social Feed",
      icon: BarChart2,
      href: "/dashboard/social-feed",
      gradient: "from-purple-500 to-cyan-400"
    },

  ]

  const copyWalletAddress = async () => {
    if (!publicKey) return
    try {
      await navigator.clipboard.writeText(publicKey)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy wallet address')
    }
  }

  const sidebarVariants = {
    expanded: {
      width: "280px",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: "80px",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.1 }
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  }

  return (
    <motion.div
      className="fixed h-full bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 border-r border-white/10 z-20 backdrop-blur-xl shadow-2xl"
      variants={sidebarVariants}
      animate={open ? "expanded" : "collapsed"}
      initial={false}
    >
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 relative z-10">
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                className="flex items-center space-x-3"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                  Novex
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 border border-white/10 dark:border-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-5 w-5 text-gray-300 dark:text-gray-200" />
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto scrollbar-hide relative z-10">
          <nav className="px-3 space-y-2">
            {routes.map((route, index) => {
              const isActive = pathname === route.href
              return (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={route.href}>
                    <motion.div
                      className={cn(
                        "flex items-center px-4 py-3.5 text-sm rounded-xl transition-all duration-200 relative group cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-white/15 to-white/5 text-white shadow-lg border border-white/20 dark:border-gray-700"
                          : "text-gray-300 dark:text-gray-200 hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/50",
                        !open && "justify-center px-3"
                      )}
                      whileHover="hover"
                      whileTap="tap"
                      variants={iconVariants}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b", route.gradient)}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Icon with gradient background */}
                      <div className={cn(
                        "relative flex items-center justify-center",
                        isActive && "drop-shadow-lg"
                      )}>
                        <motion.div
                          className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            isActive
                              ? `bg-gradient-to-r ${route.gradient} shadow-lg`
                              : "bg-white/10 dark:bg-gray-800/30 group-hover:bg-white/20 dark:group-hover:bg-gray-700/50"
                          )}
                          whileHover={{ scale: 1.1 }}
                        >
                          <route.icon className="h-5 w-5 text-white" />
                        </motion.div>
                      </div>

                      {/* Label */}
                      <AnimatePresence>
                        {open && (
                          <motion.span
                            className="ml-4 font-medium"
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                          >
                            {route.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      {!open && (
                        <motion.div
                          className="absolute left-full ml-3 rounded-lg px-3 py-2 bg-gray-900/95 dark:bg-gray-800/95 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-white/10 dark:border-gray-700 shadow-xl backdrop-blur-sm"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          {route.label}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 border-l border-b border-white/10 dark:border-gray-700" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative z-10">
          {/* Back to Home Button */}
          <Link href="/">
            <motion.div
              className={cn(
                "flex items-center px-4 py-3 text-sm text-gray-300 dark:text-gray-200 rounded-xl transition-all duration-200 hover:bg-white/10 dark:hover:bg-gray-700/50 cursor-pointer group relative mb-4 border border-white/10 dark:border-gray-700",
                !open && "justify-center px-3"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 shadow-inner">
                <ArrowLeft className="h-4 w-4 text-white" />
              </div>
              <AnimatePresence>
                {open && (
                  <motion.span
                    className="ml-3 font-medium"
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                  >
                    Back to Home
                  </motion.span>
                )}
              </AnimatePresence>

              {!open && (
                <div className="absolute left-full ml-3 rounded-lg px-3 py-2 bg-gray-900/95 dark:bg-gray-800/95 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-white/10 dark:border-gray-700 shadow-xl backdrop-blur-sm">
                  Back to Home
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 border-l border-b border-white/10 dark:border-gray-700" />
                </div>
              )}
            </motion.div>
          </Link>

          {/* User Profile Card */}
          <motion.div
            className="bg-white/10 dark:bg-gray-800/30 rounded-xl p-4 border border-white/20 dark:border-gray-700 shadow-xl backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="space-y-3"
                >
                  {connected && publicKey ? (
                    <>
                      {/* Connected User Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 dark:text-gray-300">Connected</p>
                        </div>
                      </div>

                      {/* Wallet Address */}
                      <motion.div
                        className="flex items-center justify-between bg-white/5 dark:bg-gray-900/50 rounded-lg p-2 border border-white/10 dark:border-gray-700 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={copyWalletAddress}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2">
                          <Wallet className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                          <span className="text-xs text-gray-300 dark:text-gray-200 font-mono">{truncateAddress(publicKey)}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: copiedAddress ? 360 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Copy className={cn("h-4 w-4 transition-colors", copiedAddress ? "text-cyan-400" : "text-gray-400 dark:text-gray-300")} />
                        </motion.div>
                      </motion.div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <motion.button
                          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-xs text-gray-300 dark:text-gray-200 border border-white/10 dark:border-gray-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Bell className="h-3 w-3" />
                          {open && <span>Alerts</span>}
                        </motion.button>
                        <motion.button
                          onClick={disconnectWallet}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-pink-500/10 dark:bg-pink-600/10 hover:bg-pink-500/20 dark:hover:bg-pink-600/20 rounded-lg transition-colors text-xs text-pink-300 dark:text-pink-200 border border-pink-500/20 dark:border-pink-600/20"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <LogOut className="h-3 w-3" />
                          {open && <span>Disconnect</span>}
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400/50 to-cyan-400/50 flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 text-white/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 dark:text-gray-300">Not Connected</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={connectWallet}
                        disabled={connecting}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg transition-colors text-xs text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Wallet className="h-4 w-4" />
                        <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {/* Collapsed User Icon */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Collapsed Action Icons */}
                  <div className="flex justify-center space-x-1">
                    <motion.button
                      className="p-1.5 bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-md transition-colors border border-white/10 dark:border-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bell className="h-3 w-3 text-gray-400 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 bg-pink-500/10 dark:bg-pink-600/10 hover:bg-pink-500/20 dark:hover:bg-pink-600/20 rounded-md transition-colors border border-pink-500/20 dark:border-pink-600/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <LogOut className="h-3 w-3 text-pink-300 dark:text-pink-200" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, -200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: '90%',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}