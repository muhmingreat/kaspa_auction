import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { AuctionGrid } from '@/components/home/auction-grid'
import { StatsSection } from '@/components/home/stats-section'
import { FeaturesSection } from '@/components/home/features-section'
import { MotionWrapper } from '@/components/ui/motion-wrapper'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <MotionWrapper delay={0.2}>
          <StatsSection />
        </MotionWrapper>

        <MotionWrapper delay={0.3}>
          <AuctionGrid />
        </MotionWrapper>

        <MotionWrapper delay={0.4}>
          <FeaturesSection />
        </MotionWrapper>
      </main>

      <Footer />
    </div>
  )
}
