'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Eye, Clock, Layers, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Millisecond Confirmations',
    description: 'Bids confirm in ~100ms thanks to Kaspa\'s blockDAG architecture. No more waiting, no more uncertainty.',
    color: 'text-[#4F46E5]',
    bg: 'bg-[#4F46E5]/10',
  },
  {
    icon: Shield,
    title: 'Trustless & Secure',
    description: 'Every bid is a native blockchain transaction. No middleman, no custody risk, complete transparency.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Eye,
    title: 'Real-Time Visibility',
    description: 'Watch bids flow through the mempool and confirm in real-time. Full transaction lifecycle visibility.',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Clock,
    title: 'Fair Timing',
    description: 'Blockchain timestamps ensure fair auction endings. No server manipulation, no unfair advantages.',
    color: 'text-[#6366F1]',
    bg: 'bg-[#6366F1]/10',
  },
  {
    icon: Layers,
    title: 'Multi-Asset Support',
    description: 'Auction physical items, digital goods, NFTs, and services. Flexible escrow and delivery options.',
    color: 'text-pink-600',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: '24/7 auctions accessible worldwide. No banking hours, no geographic restrictions.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-500/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-gradient-to-b from-background to-[#4F46E5]/5 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/30 bg-[#4F46E5]/10 px-4 py-1.5 text-sm font-medium text-[#4F46E5]"
          >
            Why Kaspa Auction?
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold text-foreground sm:text-4xl"
          >
            The Fastest Auction Experience
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Built on Kaspa&apos;s revolutionary blockDAG technology for unparalleled speed and security.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#4F46E5]/30 hover:shadow-kaspa"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-[#4F46E5] transition-colors">
                {feature.title}
              </h3>
              
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
