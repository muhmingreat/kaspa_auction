'use client'

import { motion } from 'framer-motion'
import { Zap, ArrowRight, Shield, Clock, Hexagon, Layers, Box } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuctions } from '@/hooks/use-auctions'
import { formatKAS } from '@/lib/mock-data'
import { useMemo } from 'react'

export function HeroSection() {
  const { auctions } = useAuctions()

  const { latestActivity, recentSale } = useMemo(() => {
    // Find active auction with highest/latest bid
    const active = auctions.filter(a => a.status === 'live' && a.bids && a.bids.length > 0);
    const topActive = active.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0))[0];

    // Find ended auction
    const ended = auctions.filter(a => a.status === 'ended');
    const lastSold = ended[0]; // Assuming closest to top is most recent if sorted, or just pick one

    return {
      latestActivity: topActive || (auctions.length > 0 ? auctions[0] : null),
      recentSale: lastSold || (auctions.length > 1 ? auctions[1] : null)
    }
  }, [auctions])

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex items-center">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-live" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse-glow" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-medium tracking-wide">LIVE KASPA MAINNET</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              The Fastest <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r
                          from-indigo-500 via-purple-500 to-indigo-500 animate-infinit 
                          bg-[length:200%_auto] glow-text">
                Live Auctions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Experience sub second finality.<br /> Bid on premium assets with the security of Proof-of-Work and the speed of Kaspa DAG.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 group"
              >
                <Link href="#auctions">
                  Start Bidding
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg border-indigo-200 hover:bg-indigo-500/5 hover:border-indigo-400 text-foreground transition-all duration-300"
              >
                <Link href="/create">
                  Create Auction
                </Link>
              </Button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8"
            >
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-1">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Speed</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">~1 Bps</div>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-1">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Security</span>
                </div>
                <div className="text-2xl font-bold">PoW</div>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-1">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Fee</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">&lt; 0.0001 KAS</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Motion Graphics */}
          <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center z-10 mt-12 lg:mt-0">
            {/* Center Block */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotateY: [0, 360],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className="relative z-20"
            >
              <div className="w-64 h-64 relative preserve-3d">
                {/* Glowing Cube Representation */}
                <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.2)] flex items-center justify-center transform rotate-45">
                  <Logo size={80} className="text-indigo-500 drop-shadow-[0_0_15px_rgba(79,70,229,0.8)]" />
                </div>
                {/* Inner Cube */}
                <div className="absolute inset-8 bg-indigo-500/10 backdrop-blur-md border border-indigo-400/20 rounded-xl transform -rotate-12 flex items-center justify-center">
                </div>
              </div>
            </motion.div>

            {/* Floating Elements (Orbs/Cards) */}
            <motion.div
              animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/4 right-10 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-indigo-500/20 shadow-lg z-30 w-48"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Box className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {latestActivity ? 'Top Bid' : 'Live Auction'}
                  </div>
                  <div className="text-sm font-bold">
                    {latestActivity ? formatKAS(latestActivity.currentPrice) : '0'} KAS
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[70%]" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 left-0 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20 shadow-lg z-10 w-40"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                  {recentSale ? 'Sold' : 'Trending'}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-foreground truncate max-w-[120px]">
                {recentSale ? recentSale.title : 'Kaspa Miner'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {recentSale ? 'Just now' : 'Live now'}
              </div>
            </motion.div>

            {/* Orbiting Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-indigo-500/10 rounded-full"
                  style={{ marginLeft: -200, marginTop: -200 }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.8)]" style={{ marginLeft: -6 }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
