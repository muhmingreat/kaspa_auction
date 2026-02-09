'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWallet } from '@/context/wallet-context'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Share2,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  User,
  Calendar,
  Shield,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuctionStatusBadge } from '@/components/bid-status-badge'
import { CountdownTimer } from '@/components/countdown-timer'
import { BidStream, BidStreamCompact } from '@/components/bid-stream'
import { BidControls } from '@/components/bid-controls'
import { getExplorerAddressUrl } from '@/lib/constants'
import { formatKAS, mockBidStream } from '@/lib/mock-data'
import type { Auction } from '@/types/auction'
import { apiDelete } from '@/lib/api'

interface AuctionDetailsViewProps {
  auction: Auction
}

export function AuctionDetailsView({ auction }: AuctionDetailsViewProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [mobileStreamExpanded, setMobileStreamExpanded] = useState(false)

  // useWallet hook for consistent state
  const { connected: isConnected, address: walletAddress } = useWallet()

  const isLive = auction.status === 'live' || auction.status === 'ending-soon'
  const bids = auction.bids || []

  // Delete Logic
  // Delete Logic
  const canDelete = isConnected && auction.seller.address === walletAddress && auction.bidCount === 0

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this auction?')) return

    try {
      // Get current address directly from window object or context
      const currentAddress = walletAddress

      await apiDelete(`/api/auctions/${auction.id}`, { sellerAddress: currentAddress });

      // If successful (no error thrown)
      window.location.href = '/' // Redirect to home on success
    } catch (err) {
      console.error(err)
      alert('Error deleting auction')
    }
  }


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Auctions
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Product Info */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div
              className={cn(
                'relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border',
                isLive && 'ring-2 ring-[#4F46E5]/30'
              )}
            >
              <Image
                src={auction.imageUrl || "/placeholder.svg"}
                alt={auction.title}
                fill
                className="object-cover"
                priority
              />

              {/* Live Pulse Overlay */}
              {isLive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 animate-pulse-live opacity-20 bg-[#4F46E5]" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute left-4 top-4">
                <AuctionStatusBadge status={auction.status} />
              </div>

              {/* Actions */}
              <div className="absolute right-4 top-4 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Delete Button (Owner Only) */}
                {canDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-red-500/90 backdrop-blur-sm border-0 shadow-lg hover:bg-red-600"
                    onClick={handleDelete}
                    title="Delete Auction"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </Button>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {auction.images && auction.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {auction.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={cn(
                      'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                      idx === 0 ? 'border-[#4F46E5]' : 'border-transparent hover:border-border'
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${auction.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {auction.title}
              </h1>

              {/* Seller Info */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5]/10">
                  <User className="h-5 w-5 text-[#4F46E5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {auction.seller.name || 'Anonymous'}
                    </span>
                    {auction.seller.verified && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]">
                        <Shield className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {auction.seller.address}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground">Description</h3>
                <p
                  className={cn(
                    'mt-2 text-sm text-muted-foreground leading-relaxed',
                    !showFullDescription && 'line-clamp-3'
                  )}
                >
                  {auction.description}
                </p>
                {auction.description.length > 150 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
                  >
                    {showFullDescription ? (
                      <>
                        Show less <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Tags */}
              {auction.tags && auction.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {auction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Auction Info */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Started
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground" suppressHydrationWarning>
                    {new Date(auction.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {auction.category || 'General'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Starting Price</p>
                  <p className="mt-1 text-sm font-medium text-foreground tabular-nums">
                    {formatKAS(auction.startPrice)} KAS
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Bids</p>
                  <p className="mt-1 text-sm font-medium text-foreground tabular-nums">
                    {auction.bidCount}
                  </p>
                </div>
              </div>

              {/* View on Explorer */}
              <div className="mt-6 border-t border-border pt-6">
                <a
                  href={getExplorerAddressUrl(auction.seller.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#4F46E5] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View seller on Kaspa Explorer
                </a>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Auction Engine */}
        <div className="space-y-6">
          {/* Countdown & Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-[#4F46E5]/20 shadow-kaspa">
              {/* Time Remaining */}
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {isLive ? 'Time Remaining' : 'Auction Ended'}
                </p>
                <div className="mt-4 flex justify-center">
                  <CountdownTimer endTime={new Date(auction.endTime)} size="lg" />
                </div>
              </div>

              {/* Current Price */}
              <div className="mt-8 text-center border-t border-border pt-8">
                <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground tabular-nums">
                    {formatKAS(auction.currentPrice)}
                  </span>
                  <span className="text-xl font-medium text-muted-foreground">KAS</span>
                </div>
                {auction.highestBidder && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Highest bidder:{' '}
                    <span className="font-medium text-foreground">
                      {auction.highestBidder.name || auction.highestBidder.address}
                    </span>
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Bid Controls */}
          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <BidControls
                  currentPrice={auction.currentPrice}
                  minimumIncrement={auction.minimumIncrement}
                  isConnected={isConnected}
                  destinationAddress={auction.seller.address}
                  onConnect={() => { /* Handled by WalletButton or we can expose connect from context if needed */ }}
                />
              </Card>
            </motion.div>
          )}

          {/* Mobile Bid Stream Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setMobileStreamExpanded(!mobileStreamExpanded)}
              className="w-full justify-between"
            >
              <span>Live Bid Stream ({bids.length} bids)</span>
              {mobileStreamExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {mobileStreamExpanded && (
              <Card className="mt-4 p-4">
                <BidStream bids={bids} showHeader={false} maxItems={5} />
              </Card>
            )}
            {!mobileStreamExpanded && (
              <div className="mt-4">
                <BidStreamCompact bids={bids} />
              </div>
            )}
          </div>

          {/* Desktop Bid Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <Card className="p-6">
              <BidStream bids={bids} maxItems={8} />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
