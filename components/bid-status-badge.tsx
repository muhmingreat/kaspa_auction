'use client'

import { Check, Radio, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/lib/mock-data'
import type { BidStatus } from '@/types/auction'

interface BidStatusBadgeProps {
  status: BidStatus
  showIcon?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function BidStatusBadge({
  status,
  showIcon = true,
  size = 'sm',
  className,
}: BidStatusBadgeProps) {
  const colors = getStatusColor(status)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }

  const iconClasses = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
  }

  const StatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className={cn(iconClasses[size], 'animate-spin')} />
      case 'detected':
        return <Radio className={iconClasses[size]} />
      case 'confirmed':
        return <Check className={iconClasses[size]} />
      default:
        return null
    }
  }

  const statusLabels: Record<BidStatus, string> = {
    pending: 'Pending',
    detected: 'Detected',
    confirmed: 'Confirmed',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wide border transition-colors duration-300',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        status === 'pending' && 'animate-pulse-live',
        className
      )}
    >
      {showIcon && <StatusIcon />}
      {statusLabels[status]}
    </span>
  )
}

// Status indicator dot for compact displays
export function StatusDot({
  status,
  size = 'sm',
  pulse = true,
  className,
}: {
  status: BidStatus
  size?: 'sm' | 'md'
  pulse?: boolean
  className?: string
}) {
  const colors = getStatusColor(status)
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
  }

  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          colors.dot,
          sizeClasses[size]
        )}
      />
      {pulse && status === 'pending' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            colors.dot
          )}
        />
      )}
    </span>
  )
}

// Auction status badge (Live, Ending Soon, Ended)
export function AuctionStatusBadge({
  status,
  className,
}: {
  status: 'live' | 'ending-soon' | 'ended' | 'upcoming'
  className?: string
}) {
  const statusConfig = {
    live: {
      label: 'Live',
      bg: 'bg-emerald-500',
      text: 'text-white',
      pulse: true,
    },
    'ending-soon': {
      label: 'Ending Soon',
      bg: 'bg-amber-500',
      text: 'text-white',
      pulse: true,
    },
    ended: {
      label: 'Ended',
      bg: 'bg-gray-500',
      text: 'text-white',
      pulse: false,
    },
    upcoming: {
      label: 'Upcoming',
      bg: 'bg-indigo-500',
      text: 'text-white',
      pulse: false,
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        config.bg,
        config.text,
        className
      )}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
      )}
      {config.label}
    </span>
  )
}
