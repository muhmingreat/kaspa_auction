'use client'

import { useState } from 'react'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatKAS } from '@/lib/mock-data'
import { getExplorerAddressUrl } from '@/lib/constants'
import { useWallet } from '@/context/wallet-context'

export function WalletButton() {
  const { connected, address, balance, name, allAccounts, connect, disconnect, isConnecting, error } = useWallet()
  const [copied, setCopied] = useState(false)

  // Local state for copy feedback only
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-end gap-2">
        <Button
          onClick={connect}
          disabled={isConnecting}
          className={cn(
            "gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium shadow-kaspa transition-all hover:shadow-kaspa-lg disabled:opacity-70",
            isConnecting && "animate-pulse"
          )}
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          <span className="hidden sm:inline text-sm">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
          <span className="sm:hidden">{isConnecting ? '...' : 'Connect'}</span>
        </Button>

        {error && (
          <div className="flex flex-col items-end gap-1 px-1">
            <div className="flex items-center gap-1 text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              <span>{error}</span>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#4F46E5] underline hover:text-[#4338CA]"
            >
              Missing wallet? Install here
            </a>
          </div>
        )}
      </div>
    )
  }

  // Helper for manual updates if needed, though context handles it mostly
  // We keep this bare minimum since context does the heavy lifting
  const truncatedAddress = address
    ? `${address.slice(0, 10)}...${address.slice(-4)}`
    : ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-[#4F46E5]/30 bg-[#4F46E5]/5 hover:bg-[#4F46E5]/10 animate-pulse-glow"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5]">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-xs font-semibold text-[#4F46E5] tabular-nums">
                KAS: {formatKAS(balance || 0)}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#4F46E5] tabular-nums sm:hidden">
              {formatKAS(balance || 0)}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3">
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            {truncatedAddress}
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="p-3">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {formatKAS(balance || 0)} <span className="text-sm font-medium text-muted-foreground">KAS</span>
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Connect Accounts
          </p>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {allAccounts?.map((account) => (
              <DropdownMenuItem
                key={account}
                className={cn(
                  "flex flex-col items-start px-2 py-1.5 cursor-pointer rounded-md",
                  address === account ? "bg-[#4F46E5]/10 border-[#4F46E5]/20" : "hover:bg-accent"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[11px] font-mono truncate">
                    {account.slice(0, 8)}...{account.slice(-4)}
                  </span>
                  {address === account && (
                    <Check className="h-3 w-3 text-[#4F46E5]" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a
            href={getExplorerAddressUrl(address || '')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
