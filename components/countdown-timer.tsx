'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getTimeRemaining } from '@/lib/mock-data'

interface CountdownTimerProps {
  endTime: Date
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  className?: string
  onEnd?: () => void
}

export function CountdownTimer({
  endTime,
  size = 'md',
  showLabels = true,
  className,
  onEnd,
}: CountdownTimerProps) {
  const targetDate = typeof endTime === 'string' ? new Date(endTime) : endTime
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate))
  const [hasEnded, setHasEnded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate)
      setTimeLeft(remaining)

      if (remaining.total <= 0 && !hasEnded) {
        setHasEnded(true)
        onEnd?.()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, hasEnded, onEnd])

  if (!mounted) return null

  const sizeClasses = {
    sm: {
      container: 'gap-1',
      digit: 'text-sm min-w-[24px] h-6 px-1',
      label: 'text-[10px]',
      separator: 'text-sm',
    },
    md: {
      container: 'gap-2',
      digit: 'text-lg min-w-[36px] h-9 px-2',
      label: 'text-xs',
      separator: 'text-lg',
    },
    lg: {
      container: 'gap-3',
      digit: 'text-3xl min-w-[60px] h-14 px-3',
      label: 'text-sm',
      separator: 'text-3xl',
    },
  }

  const styles = sizeClasses[size]
  const isUrgent = timeLeft.total > 0 && timeLeft.total < 10 * 1000 // Less than 10 seconds
  const isEnding = timeLeft.total > 0 && timeLeft.total < 60 * 1000 // Less than 1 minute

  if (hasEnded || timeLeft.total <= 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn(
          'font-mono font-bold text-muted-foreground',
          size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'
        )}>
          Auction Ended
        </span>
      </div>
    )
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg font-mono font-bold tabular-nums',
          'bg-card border border-border shadow-sm',
          styles.digit,
          isUrgent && 'animate-countdown-urgent bg-red-500/10 border-red-500/30',
          isEnding && !isUrgent && 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30'
        )}
      >
        {String(value).padStart(2, '0')}
      </div>
      {showLabels && (
        <span className={cn('mt-1 text-muted-foreground uppercase tracking-wider', styles.label)}>
          {label}
        </span>
      )}
    </div>
  )

  const Separator = () => (
    <span className={cn(
      'font-mono font-bold text-muted-foreground pb-4',
      styles.separator,
      isUrgent && 'animate-countdown-urgent',
      isEnding && !isUrgent && 'text-amber-600 dark:text-amber-400'
    )}>
      :
    </span>
  )

  return (
    <div className={cn('flex items-start', styles.container, className)}>
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" />
          <Separator />
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  )
}

// Compact inline version for cards
export function CountdownInline({
  endTime,
  className,
}: {
  endTime: Date
  className?: string
}) {
  const endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (!mounted) return null;

  if (timeLeft.total <= 0) {
    return <span className={cn('text-muted-foreground', className)}>Ended</span>
  }

  const isUrgent = timeLeft.total < 10 * 60 * 1000 // Less than 10 minutes

  const formatTime = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    }
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`
    }
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`
  }

  return (
    <span
      className={cn(
        'font-mono tabular-nums font-medium',
        isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-foreground',
        timeLeft.total < 60 * 1000 && 'animate-pulse-warning',
        className
      )}
    >
      {formatTime()}
    </span>
  )
}
