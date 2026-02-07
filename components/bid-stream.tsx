'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BidStatusBadge, StatusDot } from '@/components/bid-status-badge'
import { Logo } from '@/components/ui/logo'
import { formatKAS, truncateAddress } from '@/lib/mock-data'
import { getExplorerTxUrl } from '@/lib/constants'
import type { Bid } from '@/types/auction'

interface BidStreamProps {
  bids: Bid[]
  className?: string
  maxItems?: number
  showHeader?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function BidStream({
  bids,
  className,
  maxItems = 10,
  showHeader = true,
  collapsed = false,
}: BidStreamProps) {
  const displayBids = bids.slice(0, maxItems)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cn('flex flex-col', className)}>
      {showHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10">
              <Logo size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Live Bid Stream</h3>
              <p className="text-xs text-muted-foreground">Real-time transaction feed</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {bids.filter(b => b.status === 'pending').length} pending
            </span>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className={cn(
          'overflow-y-auto custom-scrollbar',
          collapsed ? 'max-h-0' : 'max-h-[400px]'
        )}
      >
        <AnimatePresence initial={false}>
          {displayBids.map((bid, index) => (
            <BidStreamItem key={bid.id} bid={bid} index={index} />
          ))}
        </AnimatePresence>

        {displayBids.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No bids yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface BidStreamItemProps {
  bid: Bid
  index: number
}

function BidStreamItem({ bid, index }: BidStreamItemProps) {
  const [isNew, setIsNew] = useState(index === 0)

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsNew(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const timeSince = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
        mass: 1,
      }}
      className={cn(
        'border-b border-border/50 last:border-0',
        isNew && 'bg-[#4F46E5]/5'
      )}
    >
      <div className="flex items-center gap-3 py-3 px-1">
        {/* Status Indicator */}
        <div className="flex-shrink-0">
          <StatusDot status={bid.status} size="md" pulse={bid.status === 'pending'} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground truncate">
              {bid.bidderName || truncateAddress(bid.bidderAddress)}
            </span>
            <BidStatusBadge status={bid.status} size="sm" />
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeSince(bid.timestamp)}
            </span>
            {bid.confirmationTime && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3 w-3" />
                {bid.confirmationTime}ms
              </span>
            )}
            {bid.txHash && (
              <a
                href={getExplorerTxUrl(bid.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#4F46E5] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                tx
              </a>
            )}
          </div>
        </div>

        {/* Bid Amount */}
        <div className="flex-shrink-0 text-right">
          <p className="font-bold text-foreground tabular-nums">
            {formatKAS(bid.amount)}
          </p>
          <p className="text-xs text-muted-foreground">KAS</p>
        </div>
      </div>
    </motion.div>
  )
}

// Compact version for mobile
export function BidStreamCompact({
  bids,
  className,
}: {
  bids: Bid[]
  className?: string
}) {
  const latestBid = bids[0]

  if (!latestBid) {
    return (
      <div className={cn('rounded-lg border border-border p-3', className)}>
        <p className="text-sm text-muted-foreground text-center">No bids yet</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border p-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusDot status={latestBid.status} size="sm" />
          <span className="text-sm font-medium text-foreground">
            {latestBid.bidderName || 'Anonymous'}
          </span>
          <BidStatusBadge status={latestBid.status} size="sm" showIcon={false} />
        </div>
        <span className="font-bold text-foreground tabular-nums">
          {formatKAS(latestBid.amount)} KAS
        </span>
      </div>
      {bids.length > 1 && (
        <p className="mt-2 text-xs text-muted-foreground">
          +{bids.length - 1} more bids
        </p>
      )}
    </div>
  )
}
