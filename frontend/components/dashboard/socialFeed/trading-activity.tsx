"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, Copy, BarChart, AlertCircle } from "lucide-react"
import { CopyTradeModal } from "./copy-trade-modal"

interface TradingActivityProps {
  trader: {
    name: string
    username: string
    avatar: string
    winRate: number
  }
  trade: {
    action: "BUY" | "SELL"
    asset: string
    price: number
    quantity: number
    timestamp: string
    commentary?: string
  }
}

export function TradingActivity({ trader, trade }: TradingActivityProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyTrade = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isBuy = trade.action === "BUY"
  const positionValue = trade.price * trade.quantity

  return (
    <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm text-gray-300 overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 border-2 border-purple-500/50">
          <AvatarImage src={trader.avatar} />
          <AvatarFallback>{trader.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-gray-100">{trader.name}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{trade.timestamp}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <BarChart className="w-3 h-3" />
                <span>{trader.winRate}% Win Rate</span>
            </div>
          </div>
        </div>
        <Button className={`px-4 py-2 flex items-center gap-2 ${isBuy ? 'bg-green-500/90 hover:bg-green-500' : 'bg-red-500/90 hover:bg-red-500'} text-white`}>
          <ArrowUpRight className="w-4 h-4" />
          {trade.action}
        </Button>
      </div>

      {/* Trade Details */}
      <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-purple-500/10 p-4 text-center">
        <div>
          <p className="text-xs text-gray-400">Asset</p>
          <p className="font-bold text-lg text-white">{trade.asset}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Price</p>
          <p className="font-bold text-lg text-white">${trade.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Quantity</p>
          <p className="font-bold text-lg text-white">{trade.quantity}</p>
        </div>
      </div>

      {/* Commentary & AI Context */}
      <div className="mt-4 space-y-3">
        {trade.commentary && (
            <div className="p-3 rounded-lg border border-blue-400/20 bg-blue-400/10">
                <p className="text-sm italic text-gray-300">"{trade.commentary}"</p>
            </div>
        )}
        <div className="p-3 rounded-lg bg-amber-200/10 border border-amber-200/20">
            <p className="text-xs font-semibold text-amber-300 flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                AI Context
            </p>
            <p className="text-sm text-gray-300">TSLA showing strong momentum with 15% volume increase. This trade aligns with current market sentiment.</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm">
            <span className="text-gray-400">Position Value: </span>
            <span className="font-bold text-white">${positionValue.toLocaleString()}</span>
        </p>
        <div className="flex items-center gap-2">
            <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                <Copy className="w-4 h-4 mr-2" />
                Copy Trade
            </Button>
        </div>
      </div>
    </Card>
  )
}
