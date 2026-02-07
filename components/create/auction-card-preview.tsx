'use client'

import Image from 'next/image'
import { Gavel, Clock, Tag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatKAS } from '@/lib/mock-data'

interface AuctionCardPreviewProps {
  title: string
  imageUrl: string
  startPrice: number
  duration: number
  category: string
}

export function AuctionCardPreview({
  title,
  imageUrl,
  startPrice,
  duration,
  category,
}: AuctionCardPreviewProps) {
  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <Card className="overflow-hidden border-border/50 p-0 shadow-kaspa">
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Preview
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">
          {title}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {category}
        </p>

        <div className="my-3 h-px bg-border" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Starting Price
            </p>
            <p className="mt-0.5 text-lg font-bold text-foreground tabular-nums">
              {startPrice > 0 ? formatKAS(startPrice) : '—'}{' '}
              <span className="text-xs font-medium text-muted-foreground">KAS</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Duration
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-sm font-medium text-foreground">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {formatDuration(duration)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Gavel className="h-3 w-3" />
          <span>0 bids</span>
          <span className="text-muted-foreground/50">•</span>
          <span>Starts when created</span>
        </div>
      </div>
    </Card>
  )
}
