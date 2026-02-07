import type { Auction, Bid, BidStatus } from '@/types/auction'

// Helper to create dates relative to now
const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000)
const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000)
const secondsAgo = (seconds: number) => new Date(Date.now() - seconds * 1000)

// Empty mock bid stream
export const mockBidStream: Bid[] = []

// Empty mock auctions
export const mockAuctions: Auction[] = []

// Helper function to format KAS amount
export function formatKAS(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Helper function to truncate address
// Helper function to truncate address
export function truncateAddress(address: string | null | undefined): string {
  if (!address) return ''
  if (address.length <= 16) return address
  return `${address.slice(0, 10)}...${address.slice(-4)}`
}

// Helper function to get time remaining
export function getTimeRemaining(endTime: Date | string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  isUrgent: boolean
} {
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime
  const total = end.getTime() - Date.now()
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const isUrgent = total > 0 && total < 10 * 60 * 1000 // Less than 10 minutes

  return { days, hours, minutes, seconds, total, isUrgent }
}

// Helper to get status color classes
export function getStatusColor(status: BidStatus): {
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (status) {
    case 'pending':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      }
    case 'detected':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      }
    case 'confirmed':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/40',
        dot: 'bg-emerald-500',
      }
    default:
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-500/30',
        dot: 'bg-gray-500',
      }
  }
}

export function getAuctionStatusColor(status: string): {
  bg: string
  text: string
} {
  switch (status) {
    case 'live':
      return {
        bg: 'bg-emerald-500',
        text: 'text-white',
      }
    case 'ending-soon':
      return {
        bg: 'bg-amber-500',
        text: 'text-white',
      }
    case 'ended':
      return {
        bg: 'bg-gray-500',
        text: 'text-white',
      }
    case 'upcoming':
      return {
        bg: 'bg-indigo-500',
        text: 'text-white',
      }
    default:
      return {
        bg: 'bg-gray-500',
        text: 'text-white',
      }
  }
}
