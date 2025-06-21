"use client"

import { useState } from "react"
import { FeedFilters } from "@/components/dashboard/socialFeed/feed-filters"
import { TraderPost } from "@/components/dashboard/socialFeed/trader-post"
import { MarketBuzz } from "@/components/dashboard/socialFeed/market-buzz"
import { TradingActivity } from "@/components/dashboard/socialFeed/trading-activity"

export default function SocialFeed() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState("all")

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900">
        <main className="max-w-4xl mx-auto p-6">
          <FeedFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
            <div className="space-y-6">
              <MarketBuzz />
              <TraderPost
                trader={{
                  name: "Alex Chen",
                  username: "@alextrader",
                  avatar: "/placeholder.svg?height=40&width=40",
                  verified: true,
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
            </div>
        </main>
      </div>
  )
}
