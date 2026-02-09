'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Gavel, Users, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AuctionStatusBadge } from '@/components/bid-status-badge'
import { CountdownInline } from '@/components/countdown-timer'
import { formatKAS } from '@/lib/mock-data'
import { useWallet } from '@/context/wallet-context'
import { Trash2 } from 'lucide-react'
import type { Auction } from '@/types/auction'
import { apiDelete } from '@/lib/api'

interface AuctionCardProps {
  auction: Auction
  className?: string
}

export function AuctionCard({ auction, className }: AuctionCardProps) {
  const isEnded = auction.status === 'ended'
  const isLive = auction.status === 'live' || auction.status === 'ending-soon'
  const { address: walletAddress } = useWallet()
  const isOwner = walletAddress && auction.seller.address === walletAddress
  const canDelete = isOwner && auction.bidCount === 0

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this auction?')) return

    try {
      await apiDelete(`/api/auctions/${auction.id}`, { sellerAddress: walletAddress });
      // UI will update via socket event/refresh
    } catch (err) {
      console.error(err)
      alert('Error deleting auction')
    }

  }

  return (
    <Link href={`/auction/${auction.id}`} className="group block">
      <Card
        className={cn(
          'relative overflow-hidden border-border/50 bg-card p-0 transition-all duration-300',
          'hover:border-[#4F46E5]/30 hover:shadow-kaspa-lg hover:-translate-y-1',
          'group-focus-visible:ring-2 group-focus-visible:ring-[#4F46E5] group-focus-visible:ring-offset-2',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={auction.imageUrl || "/placeholder.svg"}
            alt={auction.title}
            fill
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              isEnded && 'grayscale'
            )}
          />

          {/* Status Badge */}
          <div className="absolute left-3 top-3 z-10">
            <AuctionStatusBadge status={auction.status} />
          </div>

          {/* Live Pulse Overlay */}
          {isLive && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* Hover Action Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              className="w-full gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold shadow-lg"
              size="sm"
            >
              <Gavel className="h-4 w-4" />
              {isEnded ? 'View Results' : 'Place Bid'}
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>

          {/* Featured Badge */}
          {auction.featured && (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wide">
                Featured
              </span>
            </div>
          )}

          {/* Delete Button (Owner Only) */}
          {canDelete && (
            <div className="absolute right-3 top-3 z-20">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
            {auction.title}
          </h3>

          {/* Seller */}
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            by {auction.seller.name || 'Anonymous'}
            {auction.seller.verified && (
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4F46E5]">
                <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </p>

          {/* Divider */}
          <div className="my-3 h-px bg-border" />

          {/* Price and Time */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {isEnded ? 'Final Price' : 'Current Bid'}
              </p>
              <p className="mt-0.5 text-lg font-bold text-foreground tabular-nums">
                {formatKAS(auction.currentPrice)}{' '}
                <span className="text-xs font-medium text-muted-foreground">KAS</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {isEnded ? 'Ended' : 'Time Left'}
              </p>
              <div className="mt-0.5">
                {isEnded ? (
                  <span className="text-sm text-muted-foreground">Auction closed</span>
                ) : (
                  <CountdownInline endTime={auction.endTime} className="text-sm" />
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Gavel className="h-3 w-3" />
              <span className="tabular-nums">{auction.bidCount}</span> bids
            </div>
            {auction.highestBidder && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{auction.highestBidder.name || 'Anonymous'}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

// Skeleton loader for auction cards
export function AuctionCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 p-0">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-px bg-border" />
        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="h-2 w-16 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-1 text-right">
            <div className="h-2 w-12 animate-pulse rounded bg-muted ml-auto" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted ml-auto" />
          </div>
        </div>
      </div>
    </Card>
  )
}
