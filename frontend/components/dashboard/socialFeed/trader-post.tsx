"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, BarChart, MessageCircle, Repeat, Send, Star, BrainCircuit } from "lucide-react"
import { DiscussionThread } from "./discussion-thread"
import { VideoPlayer } from "./video-player"
import { LinkPreview } from "./link-preview"
import { PerformanceCharts } from "./performance-charts"

interface TraderPostProps {
  trader: {
    name: string
    username: string
    avatar: string
    verified?: boolean
    badge?: string
    winRate?: number
    totalTrades?: number
    avgReturn?: number
    monthlyReturns?: number[]
  }
  content: {
    text: string
    image?: string
    video?: {
      src: string
      thumbnail?: string
      aiSummary?: string
    }
    link?: {
      url: string
      title: string
      description: string
      image?: string
      verified?: boolean
      domain: string
    }
    timestamp: string
  }
  engagement: {
    likes: number
    comments: number
    shares: number
  }
}

export function TraderPost({ trader, content, engagement }: TraderPostProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)

  return (
    <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm text-gray-300 overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        <Avatar className="h-12 w-12 border-2 border-purple-500/50 flex-shrink-0">
          <AvatarImage src={trader.avatar} />
          <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-gray-100">{trader.name}</h3>
            {trader.verified && <BadgeCheck className="text-blue-400 w-5 h-5" />}
            <span className="text-sm text-gray-500">{trader.username}</span>
            <span className="text-sm text-gray-500">·</span>
            <span className="text-sm text-gray-500">{content.timestamp}</span>
          </div>

          {/* Content Body */}
          <div className="mt-2 space-y-4">
            <p>{content.text}</p>
            
            {content.video && (
              <div className="rounded-lg bg-black/40 border border-purple-500/20 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-purple-300">
                    <BrainCircuit className="w-4 h-4" />
                    <p className="font-semibold">AI-Generated Summary</p>
                </div>
                <p className="text-sm text-gray-200">{content.video.aiSummary}</p>
              </div>
            )}

            <div className="flex gap-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10">#AAPL</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10">#TechnicalAnalysis</Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10">#Breakout</Badge>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 -ml-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-400 hover:text-white">
              <MessageCircle className="w-5 h-5" /> {engagement.comments}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-400 hover:text-white">
              <Repeat className="w-5 h-5" /> {engagement.shares}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-gray-400 hover:text-white">
              <Star className="w-5 h-5" /> {engagement.likes}
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
