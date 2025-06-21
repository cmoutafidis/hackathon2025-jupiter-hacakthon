"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VideoPlayerProps {
  src: string
  thumbnail?: string
  aiSummary?: string
}

export function VideoPlayer({ src, thumbnail, aiSummary }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-64 object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Video Controls */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
        <Button variant="secondary" size="lg" onClick={togglePlay} className="rounded-full w-16 h-16">
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
        <Button variant="secondary" size="sm">
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Summary Overlay */}
      {aiSummary && (
        <div className="absolute top-2 left-2 right-2">
          <Badge className="bg-blue-500/90 text-white text-xs">AI Summary: {aiSummary}</Badge>
        </div>
      )}
    </div>
  )
}
