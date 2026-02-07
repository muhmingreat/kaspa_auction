'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, SortAsc, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuctionCard } from '@/components/auction-card'
import { useAuctions } from '@/hooks/use-auctions'
import type { AuctionStatus, AuctionSortBy } from '@/types/auction'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const statusFilters: { label: string; value: AuctionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Ending Soon', value: 'ending-soon' },
  { label: 'Ended', value: 'ended' },
]

const sortOptions: { label: string; value: AuctionSortBy }[] = [
  { label: 'Ending Soon', value: 'ending-soon' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Bids', value: 'most-bids' },
]

export function AuctionGrid() {
  const { auctions, loading } = useAuctions()
  const [activeFilter, setActiveFilter] = useState<AuctionStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<AuctionSortBy>('ending-soon')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort auctions
  const filteredAuctions = auctions
    .filter((auction) => {
      if (activeFilter !== 'all' && auction.status !== activeFilter) return false
      if (searchQuery && !auction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })

    .sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'newest':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'most-bids':
          return b.bidCount - a.bidCount;
        default:
          return 0;
      }
    })

  return (
    <section id="auctions" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Live Auctions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover unique items and place your bids in real-time
            </p>
          </div>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mt-6 flex items-center gap-3 lg:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-[#4F46E5]/10 border-[#4F46E5]/30')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Pills */}
        <div className={cn(
          'mt-6 flex flex-wrap items-center gap-3',
          !showFilters && 'hidden lg:flex'
        )}>
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeFilter === filter.value
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as AuctionSortBy)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-muted animate-pulse" />
            ))
          ) : (
            filteredAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AuctionCard auction={auction} />
              </motion.div>
            ))
          )}
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No auctions found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                setActiveFilter('all')
                setSearchQuery('')
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredAuctions.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-[#4F46E5]/30 hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/50 bg-transparent"
            >
              Load More Auctions
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
