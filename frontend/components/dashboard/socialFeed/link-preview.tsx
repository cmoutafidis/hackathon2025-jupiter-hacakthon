"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Shield, AlertTriangle } from "lucide-react"

interface LinkPreviewProps {
  url: string
  title: string
  description: string
  image?: string
  verified?: boolean
  domain: string
}

export function LinkPreview({ url, title, description, image, verified, domain }: LinkPreviewProps) {
  return (
    <Card className="mt-3 border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{domain}</span>
                  {verified ? (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
