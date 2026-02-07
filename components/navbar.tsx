'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WalletButton } from '@/components/wallet-button'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '/', label: 'Auctions' },
  { href: '/create', label: 'Create' },
  { href: '/my-bids', label: 'My Bids' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 glass border-b border-border/50" />

      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Logo size={40} />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Kaspa
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground -mt-1">
              Auction
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                  isActive
                    ? 'text-[#4F46E5]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#4F46E5]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
