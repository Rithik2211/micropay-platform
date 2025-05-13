import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, CreditCard, Clock, Shield, Users } from 'lucide-react'
import { HeroAnimation } from '@/components/HeroAnimation'
import { FeatureCard } from '@/components/FeatureCard'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { PricingTable } from '@/components/PricingTable'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full  bg-gradient-to-b from-blue-50 to-violet-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section with Animation */}
      <section className="w-full flex items-center justify-center py-12 mt-[80px]">
        <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex flex-col space-y-4 lg:w-1/2">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                <Sparkles className="mr-1 h-3 w-3" />
                Now powered by Uniswap v4 hooks
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Microtransactions & Subscriptions
              <span className="text-primary"> Made Simple</span>
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Empower your content with flexible monetization. Instant settlements, minimal fees, on Base.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="h-12 px-8 transition-all hover:scale-105">
                <Zap className="mr-2 h-5 w-5" />
                Launch App
              </Button>
              <Link href="/creators">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  For Creators
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full flex items-center justify-center py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Redefining Digital Payments
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Unlock new business models with our advanced payment infrastructure.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-12">
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-primary" />}
              title="Microtransactions"
              description="Process payments as small as $0.01 with near-zero fees using Uniswap v4 hooks."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Flexible Subscriptions"
              description="Daily, weekly, monthly, or custom billing cycles with automatic renewals."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure & Transparent"
              description="All transactions are on-chain with complete visibility and security."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Instant Settlement"
              description="No waiting for payment clearing. Access content immediately."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Subscriber Management"
              description="Comprehensive dashboard to manage your audience and content access."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Dynamic Pricing"
              description="Implement pay-per-view, tiered access, or consumption-based pricing."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Trusted by Creators
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full flex items-center justify-center py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Start for free, grow with us. Only pay for what you use.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl pt-12">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex items-center justify-center py-12 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto max-w-[600px] md:text-xl">
                Join the future of digital payments and content monetization today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-white text-black hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}