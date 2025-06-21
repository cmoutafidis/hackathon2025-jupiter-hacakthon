"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FeedHeader } from "@/components/feed-header"
import { FeedFilters } from "@/components/feed-filters"
import { TraderPost } from "@/components/trader-post"
import { MarketBuzz } from "@/components/market-buzz"
import { TradingActivity } from "@/components/trading-activity"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { PortfolioIntegration } from "@/components/portfolio-integration"
import { AdvancedSearch } from "@/components/advanced-search"
import { Leaderboard } from "@/components/leaderboard"

export function SocialFeed() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState("all")

  const [notifications, setNotifications] = useState([])
  const [portfolio, setPortfolio] = useState([
    { symbol: "AAPL", shares: 100, avgPrice: 150, currentPrice: 155, change: 5, changePercent: 3.33 },
    { symbol: "TSLA", shares: 50, avgPrice: 245, currentPrice: 250, change: 5, changePercent: 2.04 },
    { symbol: "BTC", shares: 0.5, avgPrice: 58000, currentPrice: 60000, change: 2000, changePercent: 3.45 },
  ])
  const [watchlist, setWatchlist] = useState(["BTC", "ETH", "NVDA", "MSFT"])
  const [alerts, setAlerts] = useState([])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <FeedHeader />
          <div className="flex-1 flex">
            <div className="flex-1 max-w-4xl mx-auto p-6">
              <FeedFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
              />
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-6">
                  <AdvancedSearch />
                  <RealTimeAlerts />
                  <PortfolioIntegration portfolio={portfolio} watchlist={watchlist} />
                  <Leaderboard period="weekly" />
                  <MarketBuzz />
                  <TraderPost
                    trader={{
                      name: "Alex Chen",
                      username: "@alextrader",
                      avatar: "/placeholder.svg?height=40&width=40",
                      verified: true,
                      badge: "Top Trader",
                      winRate: 78,
                      totalTrades: 156,
                      avgReturn: 12.5,
                      monthlyReturns: [8.2, -2.1, 15.3, 7.8, -1.2, 9.4, 12.1, 5.6, -3.2, 11.8, 6.9, 14.2],
                    }}
                    content={{
                      text: "Just entered a long position on AAPL at $150 based on breakout above 200-day MA. Here's my detailed analysis video.",
                      video: {
                        src: "/placeholder-video.mp4",
                        thumbnail: "/placeholder.svg?height=300&width=500",
                        aiSummary: "Technical analysis showing bullish breakout pattern",
                      },
                      timestamp: "5m ago",
                    }}
                    engagement={{
                      likes: 24,
                      comments: 8,
                      shares: 3,
                    }}
                  />
                  <TradingActivity
                    trader={{
                      name: "Sarah Kim",
                      username: "@sarahkrypto",
                      avatar: "/placeholder.svg?height=40&width=40",
                      winRate: 75,
                    }}
                    trade={{
                      action: "BUY",
                      asset: "TSLA",
                      price: 245.5,
                      quantity: 100,
                      timestamp: "2m ago",
                      commentary: "Bought TSLA due to strong Q2 earnings and EV market growth",
                    }}
                  />
                  <TraderPost
                    trader={{
                      name: "Mike Rodriguez",
                      username: "@mikebtc",
                      avatar: "/placeholder.svg?height=40&width=40",
                      verified: false,
                    }}
                    content={{
                      text: "BTC looking bearish on the 4H chart. Expecting a dip to $58K support level. What do you think?",
                      timestamp: "12m ago",
                    }}
                    engagement={{
                      likes: 15,
                      comments: 12,
                      shares: 2,
                    }}
                  />
                  <TradingActivity
                    trader={{
                      name: "Emma Wilson",
                      username: "@emmafx",
                      avatar: "/placeholder.svg?height=40&width=40",
                      winRate: 82,
                    }}
                    trade={{
                      action: "SELL",
                      asset: "BTC",
                      price: 58000,
                      quantity: 0.5,
                      timestamp: "8m ago",
                      commentary: "Closed BTC short at $58K, +3% profit. Market sentiment shifting.",
                    }}
                  />
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
