"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, AlertTriangle, TrendingUp } from "lucide-react"

interface CopyTradeModalProps {
  trade: {
    action: "BUY" | "SELL"
    asset: string
    price: number
    quantity: number
  }
  trader: {
    name: string
    winRate: number
  }
}

export function CopyTradeModal({ trade, trader }: CopyTradeModalProps) {
  const [positionSize, setPositionSize] = useState([1000])
  const [stopLoss, setStopLoss] = useState(5)
  const [takeProfit, setTakeProfit] = useState(10)
  const [autoFollow, setAutoFollow] = useState(false)
  const [riskLevel, setRiskLevel] = useState("medium")

  const estimatedShares = Math.floor(positionSize[0] / trade.price)
  const maxLoss = (positionSize[0] * stopLoss) / 100
  const maxGain = (positionSize[0] * takeProfit) / 100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Copy className="w-4 h-4 mr-1" />
          Copy Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Copy Trade: {trade.asset}
            <Badge variant={trade.action === "BUY" ? "default" : "destructive"}>{trade.action}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trader Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{trader.name}</p>
                  <p className="text-xs text-muted-foreground">Following this trader</p>
                </div>
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trader.winRate}% Win Rate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Position Size */}
          <div className="space-y-3">
            <Label>Position Size</Label>
            <div className="space-y-2">
              <Slider
                value={positionSize}
                onValueChange={setPositionSize}
                max={10000}
                min={100}
                step={100}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>${positionSize[0].toLocaleString()}</span>
                <span>{estimatedShares} shares</span>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stop Loss (%)</Label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                min="1"
                max="20"
              />
            </div>
            <div className="space-y-2">
              <Label>Take Profit (%)</Label>
              <Input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(Number(e.target.value))}
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Risk Summary */}
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Risk Summary</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Max Loss:</span>
                      <span className="text-red-600">-${maxLoss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Gain:</span>
                      <span className="text-green-600">+${maxGain.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk/Reward:</span>
                      <span>1:{(takeProfit / stopLoss).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto Follow */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-follow future trades</Label>
              <p className="text-xs text-muted-foreground">Automatically copy this trader's future trades</p>
            </div>
            <Switch checked={autoFollow} onCheckedChange={setAutoFollow} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Execute Trade</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
