'use client'

import React from "react"
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gavel, Plus, Minus, Loader2, Check, AlertCircle, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatKAS } from '@/lib/mock-data'

type BidState = 'idle' | 'signing' | 'broadcasting' | 'success' | 'error'

interface BidControlsProps {
  currentPrice: number
  minimumIncrement: number
  isConnected?: boolean
  destinationAddress: string
  onPlaceBid?: (amount: number, txHash: string) => Promise<void>
  onConnect?: () => void
  className?: string
}

export function BidControls({
  currentPrice,
  minimumIncrement,
  isConnected = false,
  destinationAddress,
  onPlaceBid,
  onConnect,
  className,
}: BidControlsProps) {
  const [bidAmount, setBidAmount] = useState(currentPrice + minimumIncrement)
  const [bidState, setBidState] = useState<BidState>('idle')
  const [error, setError] = useState<string | null>(null)

  const quickIncrements = [
    { label: '+100', value: 100 },
    { label: '+500', value: 500 },
    { label: '+1K', value: 1000 },
    { label: '+5K', value: 5000 },
  ]

  const handleQuickIncrement = (increment: number) => {
    setBidAmount((prev) => prev + increment)
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setBidAmount(value)
    setError(null)
  }

  const handlePlaceBid = useCallback(async () => {
    // 1. Check for provider
    let provider = typeof window !== 'undefined' ? (window as any).kasware : null;

    // 2. Quick retry for late injection
    if (!provider) {
      await new Promise(resolve => setTimeout(resolve, 200));
      provider = typeof window !== 'undefined' ? (window as any).kasware : null;
    }

    console.log('[BidControls] handlePlaceBid triggered. isConnected:', isConnected, 'Provider:', !!provider);

    if (!isConnected) {
      if (provider) {
        try {
          console.log('[BidControls] Requesting accounts via KasWare...');
          setBidState('signing')
          const accounts = await provider.requestAccounts()
          console.log('[BidControls] Request accounts result:', accounts);
          if (accounts && accounts.length > 0) {
            onConnect?.()
            console.log('[BidControls] Connection successful, proceeding to bid logic...');
            // Proceed to the bidding logic below
          } else {
            setError('Connect request cancelled or no accounts found')
            setBidState('idle')
            return
          }
        } catch (err: any) {
          console.error('[BidControls] Connection error:', err);
          setError(err.message || 'Failed to connect')
          setBidState('idle')
          return
        }
      } else {
        console.warn('[BidControls] KasWare provider not found at click time');
        setError('KasWare Wallet not detected. Please ensure it is enabled and refresh the page.');
        setBidState('error');
        return
      }
    }

    const minBid = currentPrice + minimumIncrement
    if (bidAmount < minBid) {
      setError(`Minimum bid is ${formatKAS(minBid)} KAS`)
      setBidState('idle')
      return
    }

    try {
      setBidState('signing')
      setError(null)

      if (!provider) {
        throw new Error('KasWare wallet not found')
      }

      // 1. Send Kaspa Transaction
      // Amount is in Sompi (1 KAS = 100,000,000 Sompi)
      const sompiAmount = Math.floor(bidAmount * 1e8)

      console.log('[BidControls] Initiating sendKaspa for', sompiAmount, 'sompi to', destinationAddress);
      setBidState('broadcasting')

      const txHash = await provider.sendKaspa(
        destinationAddress,
        sompiAmount
      )

      console.log('[BidControls] Transaction broadcasted! Hash:', txHash);

      if (!txHash) {
        throw new Error('Transaction failed or was cancelled')
      }

      // 2. Notify parent/backend (optional, as backend monitors anyway)
      if (onPlaceBid) {
        await onPlaceBid(bidAmount, txHash)
      }

      setBidState('success')

      // Reset after success
      setTimeout(() => {
        setBidState('idle')
        setBidAmount(bidAmount + minimumIncrement)
      }, 3000)
    } catch (err: any) {
      console.error('[BidControls] Bid/Transaction error:', err)
      setBidState('error')
      setError(err.message || 'Failed to place bid')
      setTimeout(() => setBidState('idle'), 5000)
    }
  }, [bidAmount, currentPrice, minimumIncrement, isConnected, onPlaceBid, onConnect, destinationAddress])

  const getBidButtonContent = () => {
    switch (bidState) {
      case 'signing':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Check Wallet...</span>
          </>
        )
      case 'broadcasting':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Broadcasting...</span>
          </>
        )
      case 'success':
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Bid Sent!</span>
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="h-5 w-5" />
            <span>Failed</span>
          </>
        )
      default:
        if (!isConnected) {
          return (
            <>
              <Wallet className="h-5 w-5" />
              <span>Connect Wallet to Bid</span>
            </>
          )
        }
        return (
          <>
            <Gavel className="h-5 w-5" />
            <span>Place Bid</span>
          </>
        )
    }
  }

  const getBidButtonClass = () => {
    switch (bidState) {
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'error':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-[#4F46E5] hover:bg-[#4338CA]'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Price Display */}
      <div className="rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#6366F1]/5 p-4 border border-[#4F46E5]/20">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Price</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground tabular-nums">
            {formatKAS(currentPrice)}
          </span>
          <span className="text-lg font-medium text-muted-foreground">KAS</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Minimum increment: {formatKAS(minimumIncrement)} KAS
        </p>
      </div>

      {/* Bid Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Your Bid</label>

        <div className="relative">
          <Input
            type="number"
            value={bidAmount}
            onChange={handleInputChange}
            className={cn(
              'h-14 text-xl font-bold tabular-nums pr-16',
              error && 'border-red-500 focus-visible:ring-red-500/20'
            )}
            min={currentPrice + minimumIncrement}
            step={minimumIncrement}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            KAS
          </span>
        </div>

        {/* Quick Increment Buttons */}
        <div className="flex gap-2">
          {quickIncrements.map((inc) => (
            <Button
              key={inc.value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickIncrement(inc.value)}
              className="flex-1 font-mono text-xs hover:bg-[#4F46E5]/10 hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
            >
              <Plus className="mr-1 h-3 w-3" />
              {inc.label}
            </Button>
          ))}
        </div>

        {/* Manual adjustment */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBidAmount((prev) => Math.max(currentPrice + minimumIncrement, prev - minimumIncrement))}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground">
              Bid {formatKAS(bidAmount - currentPrice)} KAS above current
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBidAmount((prev) => prev + minimumIncrement)}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {error.includes('not detected') && (
              <a
                href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-6 text-xs text-[#4F46E5] underline hover:text-[#4338CA] block"
              >
                Download KasWare Wallet
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Place Bid Button */}
      <Button
        onClick={handlePlaceBid}
        disabled={bidState !== 'idle' && bidState !== 'error'}
        className={cn(
          'w-full h-14 text-lg font-semibold text-white gap-2 transition-all',
          getBidButtonClass(),
          bidState === 'idle' && 'shadow-kaspa hover:shadow-kaspa-lg'
        )}
      >
        {getBidButtonContent()}
      </Button>

      {/* Transaction Info */}
      <p className="text-center text-xs text-muted-foreground">
        Bids are native Kaspa transactions. Confirmation in ~1s.
      </p>
    </div>
  )
}
