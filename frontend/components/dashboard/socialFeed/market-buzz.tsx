import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Newspaper, ExternalLink } from "lucide-react"

export function MarketBuzz() {
  const buzzTopics = [
    { name: "Bitcoin Halving", sentiment: "positive", posts: 12500 },
    { name: "Ethereum ETF", sentiment: "positive", posts: 9800 },
    { name: "Solana Congestion", sentiment: "negative", posts: 7600 },
  ]

  return (
    <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-200">
          <Newspaper className="w-5 h-5 text-purple-400" />
          Market Buzz
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-none text-xs ml-2 animate-pulse">Live</Badge>
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 pt-2">
          {buzzTopics.map((topic) => (
            <li key={topic.name} className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-300">{topic.name}</span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {topic.sentiment === "positive" ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span>{topic.posts.toLocaleString()} posts</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-500">Powered by AI analysis of 50K+ social signals</p>
            <Button variant="ghost" className="text-xs text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                View More
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}
