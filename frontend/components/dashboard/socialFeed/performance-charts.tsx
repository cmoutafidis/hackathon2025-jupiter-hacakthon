"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface PerformanceChartsProps {
  trader: {
    name: string
    winRate: number
    totalTrades: number
    avgReturn: number
    monthlyReturns: number[]
  }
}

export function PerformanceCharts({ trader }: PerformanceChartsProps) {
  const maxReturn = Math.max(...trader.monthlyReturns)
  const minReturn = Math.min(...trader.monthlyReturns)

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{trader.name}'s Performance</span>
          <Badge variant="secondary">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trader.avgReturn > 0 ? "+" : ""}
            {trader.avgReturn.toFixed(1)}% Avg
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="font-semibold text-sm">{trader.winRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Trades</p>
            <p className="font-semibold text-sm">{trader.totalTrades}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Month</p>
            <p className="font-semibold text-sm text-green-600">+{maxReturn.toFixed(1)}%</p>
          </div>
        </div>

        {/* Monthly Returns Chart */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Monthly Returns (Last 12 months)</p>
          <div className="flex items-end gap-1 h-20">
            {trader.monthlyReturns.map((return_, index) => {
              const height = (Math.abs(return_) / Math.max(Math.abs(maxReturn), Math.abs(minReturn))) * 60
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t ${
                    return_ >= 0 ? "bg-green-500" : "bg-red-500"
                  } ${return_ < 0 ? "self-end" : ""}`}
                  style={{ height: `${height}px` }}
                  title={`${return_ > 0 ? "+" : ""}${return_.toFixed(1)}%`}
                />
              )
            })}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Drawdown:</span>
              <span className="text-red-600">{minReturn.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharpe Ratio:</span>
              <span>1.24</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
