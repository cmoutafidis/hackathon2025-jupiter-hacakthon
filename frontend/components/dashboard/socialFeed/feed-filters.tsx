"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FeedFiltersProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  selectedAsset: string
  setSelectedAsset: (asset: string) => void
}

export function FeedFilters({
  activeFilter,
  setActiveFilter,
  selectedAsset,
  setSelectedAsset,
}: FeedFiltersProps) {
  const filters = ["All", "Portfolio", "Watchlist", "Alerts"]
  const assets = ["All", "AAPL", "TSLA", "BTC", "ETH"]

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter.toLowerCase() ? "secondary" : "ghost"}
            onClick={() => setActiveFilter(filter.toLowerCase())}
            size="sm"
            className={activeFilter === filter.toLowerCase() ? 'bg-purple-600/50 text-white' : 'text-gray-400'}
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4 ml-auto">
      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
        <SelectTrigger className="w-[180px] bg-transparent border-purple-500/30 text-gray-300">
          <SelectValue placeholder="Select Asset" />
        </SelectTrigger>
        <SelectContent>
            {assets.map(asset => <SelectItem key={asset} value={asset}>{asset}</SelectItem>)}
        </SelectContent>
      </Select>
      <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 animate-pulse">
          Live
      </Badge>
      <span className="text-sm text-gray-400">1.2K active traders</span>
      </div>
    </div>
  )
}
