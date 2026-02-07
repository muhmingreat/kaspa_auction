'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Gavel,
  Trophy,
  Clock,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BidStatusBadge } from '@/components/bid-status-badge'
import { CountdownInline } from '@/components/countdown-timer'
import { formatKAS } from '@/lib/mock-data'
import { useAuctions } from '@/hooks/use-auctions'
import { Auction, Bid } from '@/types/auction'
import { getExplorerTxUrl } from '@/lib/constants'

// Derives stats from real list
function calculateStats(myBids: { auction: Auction, bid: Bid }[]) {
  const activeCount = myBids.filter(x => x.auction.status !== 'ended').length;
  const wonCount = myBids.filter(x =>
    x.auction.status === 'ended' &&
    x.auction.highestBidder?.address?.toLowerCase() === x.bid.bidderAddress?.toLowerCase()
  ).length;
  const totalSpent = myBids
    .filter(x =>
      x.auction.status === 'ended' &&
      x.auction.highestBidder?.address?.toLowerCase() === x.bid.bidderAddress?.toLowerCase()
    )
    .reduce((acc, curr) => acc + curr.bid.amount, 0);

  return [
    {
      label: 'Active Bids',
      value: activeCount.toString(),
      icon: Gavel,
      color: 'text-[#4F46E5]',
      bg: 'bg-[#4F46E5]/10',
    },
    {
      label: 'Won Auctions',
      value: wonCount.toString(),
      icon: Trophy,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Total Spent',
      value: `${formatKAS(totalSpent)} KAS`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
    },
  ];
}

export function MyBidsView() {
  const [activeTab, setActiveTab] = useState('active')
  const { auctions, loading } = useAuctions()
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // 1. Get Wallet Address
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.kasware !== 'undefined') {
        try {
          const accounts = await window.kasware.getAccounts()
          if (accounts && accounts.length > 0) {
            setUserAddress(accounts[0])
          }
        } catch (e) {
          console.error("Wallet check failed", e)
        }
      }
    }
    checkWallet()

    // Poll for detection
    const interval = setInterval(() => {
      if (typeof window.kasware !== 'undefined' && !userAddress) {
        checkWallet();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userAddress])

  // 2. Filter Bids for this user
  // We want to find auctions where this user has placed a bid.
  // For each such auction, we care about their *latest* (highest) bid.
  const myBidsInteraction = auctions.map(auction => {
    if (!userAddress) return null;

    // Safety check for bids array
    const auctionBids = auction.bids || [];

    const myBids = auctionBids.filter(b =>
      b.bidderAddress?.toLowerCase() === userAddress.toLowerCase()
    );

    if (myBids.length === 0) return null;

    // User's highest bid on this auction (bids are usually sorted new->old, so first one)
    const myLatestBid = myBids[0];

    const isWinning = auction.highestBidder?.address?.toLowerCase() === userAddress.toLowerCase();
    const isOutbid = !isWinning && auction.status !== 'ended';

    return {
      auction,
      bid: myLatestBid,
      isWinning,
      isOutbid
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const myCreatedAuctions = auctions.filter(a =>
    a.seller?.address.toLowerCase() === userAddress?.toLowerCase()
  );

  const activeBids = myBidsInteraction.filter((b) => b.auction.status !== 'ended')
  const pastBids = myBidsInteraction.filter((b) => b.auction.status === 'ended')
  const stats = calculateStats(myBidsInteraction);

  if (!userAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
        <p className="text-muted-foreground mb-4">Please connect your KasWare wallet to view your bids.</p>
      </div>
    )
  }

  // DEBUGGING LOGS
  console.log('MyBidsView Debug:', {
    userAddress,
    auctionsCount: auctions.length,
    sampleAuction: auctions[0],
    myBidsInteraction,
    myCreatedAuctions
  });

  if (loading) {
    return <div className="py-20 text-center">Loading bids...</div>
  }


  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bids Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Active Bids ({activeBids.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Trophy className="h-4 w-4" />
            Past Bids ({pastBids.length})
          </TabsTrigger>
          <TabsTrigger value="created" className="gap-2">
            <Gavel className="h-4 w-4" />
            Created ({myCreatedAuctions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBids.length === 0 ? (
            <EmptyState
              title="No active bids"
              description="You haven't placed any bids yet. Browse auctions to get started!"
              actionLabel="Browse Auctions"
              actionHref="/"
            />
          ) : (
            activeBids.map((item, index) => (
              <motion.div
                key={item.auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BidCard {...item} />
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBids.length === 0 ? (
            <EmptyState
              title="No past bids"
              description="Your completed auction history will appear here."
              actionLabel="Browse Auctions"
              actionHref="/"
            />
          ) : (
            pastBids.map((item, index) => (
              <motion.div
                key={item.auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BidCard {...item} />
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          {myCreatedAuctions.length === 0 ? (
            <EmptyState
              title="No created auctions"
              description="You haven't listed any items for auction yet."
              actionLabel="Create Auction"
              actionHref="/create"
            />
          ) : (
            myCreatedAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-kaspa transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative aspect-video w-full sm:aspect-square sm:w-40 flex-shrink-0">
                        <Image
                          src={auction.imageUrl || "/placeholder.svg"}
                          alt={auction.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4 justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{auction.title}</h3>
                          <p className="text-sm text-muted-foreground">{auction.description.substring(0, 100)}...</p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Current Price</p>
                            <p className="font-bold">{formatKAS(auction.currentPrice)} KAS</p>
                          </div>
                          <Button asChild size="sm" className="bg-[#4F46E5] text-white">
                            <Link href={`/auction/${auction.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BidCardProps {
  auction: Auction
  bid: Bid
  isWinning: boolean
  isOutbid: boolean
}

function BidCard({ auction, bid, isWinning, isOutbid }: BidCardProps) {
  const isEnded = auction.status === 'ended'

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-kaspa',
      isWinning && !isEnded && 'border-emerald-500/30 bg-emerald-500/5',
      isOutbid && !isEnded && 'border-amber-500/30 bg-amber-500/5'
    )}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative aspect-video w-full sm:aspect-square sm:w-40 flex-shrink-0">
            <Image
              src={auction.imageUrl || "/placeholder.svg"}
              alt={auction.title}
              fill
              className="object-cover"
            />
            {isWinning && !isEnded && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20">
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Winning!
                </span>
              </div>
            )}
            {isOutbid && !isEnded && (
              <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20">
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Outbid
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/auction/${auction.id}`}
                  className="font-semibold text-foreground hover:text-[#4F46E5] transition-colors line-clamp-1"
                >
                  {auction.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  by {auction.seller.name || 'Anonymous'}
                </p>
              </div>
              <BidStatusBadge status={bid.status} size="md" />
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Your Bid</p>
                <p className="mt-0.5 font-bold text-foreground tabular-nums">
                  {formatKAS(bid.amount)} KAS
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="mt-0.5 font-bold text-foreground tabular-nums">
                  {formatKAS(auction.currentPrice)} KAS
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {isEnded ? 'Ended' : 'Time Left'}
                </p>
                <div className="mt-0.5">
                  {isEnded ? (
                    <span className="font-medium text-muted-foreground">Auction ended</span>
                  ) : (
                    <CountdownInline endTime={auction.endTime} className="font-bold" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Bids</p>
                <p className="mt-0.5 font-bold text-foreground tabular-nums">
                  {auction.bidCount}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <Button
                asChild
                size="sm"
                className={cn(
                  'gap-1',
                  isOutbid && !isEnded
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-[#4F46E5] hover:bg-[#4338CA]'
                )}
              >
                <Link href={`/auction/${auction.id}`}>
                  {isOutbid && !isEnded ? 'Increase Bid' : 'View Auction'}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
              {bid.txHash && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent"
                >
                  <a
                    href={getExplorerTxUrl(bid.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View TX
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Gavel className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <Button
        asChild
        className="mt-6 bg-[#4F46E5] hover:bg-[#4338CA]"
      >
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  )
}
