'use client'

import { motion } from 'framer-motion'
import { Gavel, Users, Zap, TrendingUp } from 'lucide-react'
import { useAuctions } from '@/hooks/use-auctions'
import { useMemo } from 'react'

export function StatsSection() {
  const { auctions } = useAuctions()

  const stats = useMemo(() => {
    // 1. Total Auctions
    const totalAuctions = auctions.length

    // 2. Active Bidders
    const uniqueBidders = new Set<string>()
    auctions.forEach(auction => {
      auction.bids?.forEach(bid => {
        if (bid.bidderAddress) uniqueBidders.add(bid.bidderAddress)
      })
    })
    const activeBidders = uniqueBidders.size

    // 3. Avg Confirmation (Static protocol spec)
    const avgConfirmation = "~1s"

    // 4. Total Volume (Sum of current prices)
    const volume = auctions.reduce((acc, auction) => acc + (auction.currentPrice || 0), 0)
    const formattedVolume = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(volume) + ' KAS'

    return [
      {
        label: 'Total Auctions',
        value: totalAuctions.toLocaleString(),
        change: 'Live Data',
        icon: Gavel,
        color: 'text-[#4F46E5]',
        bg: 'bg-[#4F46E5]/10',
      },
      {
        label: 'Active Bidders',
        value: activeBidders.toLocaleString(),
        change: 'Global',
        icon: Users,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10',
      },
      {
        label: 'Avg. Confirmation',
        value: avgConfirmation,
        change: 'Network Speed',
        icon: Zap,
        color: 'text-amber-600',
        bg: 'bg-amber-500/10',
      },
      {
        label: 'Total Volume',
        value: formattedVolume,
        change: 'Total Value',
        icon: TrendingUp,
        color: 'text-[#6366F1]',
        bg: 'bg-[#6366F1]/10',
      },
    ]
  }, [auctions])

  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {stat.change}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
