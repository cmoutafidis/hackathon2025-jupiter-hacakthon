"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Reply, Send, ChevronDown, ChevronUp } from "lucide-react"

interface DiscussionThreadProps {
  postId: string
}

export function DiscussionThread({ postId }: DiscussionThreadProps) {
  const [newComment, setNewComment] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)

  const comments = [
    {
      id: "1",
      user: {
        name: "David Park",
        username: "@davidp",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "Great analysis! What's your stop-loss strategy for this position?",
      timestamp: "3m ago",
      likes: 5,
      replies: [],
    },
    {
      id: "2",
      user: {
        name: "Lisa Zhang",
        username: "@lisaz",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: "I'm seeing similar patterns on the weekly chart. Thanks for sharing!",
      timestamp: "7m ago",
      likes: 3,
      replies: [
        {
          id: "2-1",
          user: {
            name: "Alex Chen",
            username: "@alextrader",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Exactly! The weekly support at $145 is holding strong.",
          timestamp: "5m ago",
          likes: 2,
        },
      ],
    },
  ]

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("")
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Discussion</CardTitle>
          <Badge variant="secondary" className="text-xs">
            AI Summary: 80% agree on bullish outlook
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <Button size="sm" onClick={handleSubmitComment}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {comments.slice(0, showAllComments ? comments.length : 2).map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {comment.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">{comment.user.username}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Heart className="w-3 h-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {reply.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">{reply.user.name}</span>
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs">{reply.content}</p>
                        <Button variant="ghost" size="sm" className="h-5 px-1">
                          <Heart className="w-3 h-3 mr-1" />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length > 2 && (
          <Button variant="ghost" size="sm" onClick={() => setShowAllComments(!showAllComments)} className="w-full">
            {showAllComments ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show {comments.length - 2} More Comments
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
