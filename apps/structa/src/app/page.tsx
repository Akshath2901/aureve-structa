import { StructaHero } from '@/components/sections/StructaHero'
import { LivePrices } from '@/components/sections/LivePrices'
import { FleetSection } from '@/components/sections/FleetSection'
import { CalculatorSection } from '@/components/sections/CalculatorSection'
import { SuppliersSection } from '@/components/sections/SuppliersSection'
import { WhyStructa } from '@/components/sections/WhyStructa'
import { AureveCTA } from '@/components/sections/AureveCTA'

export default function StructaHomePage() {
  return (
    <main>
      <StructaHero />
      <LivePrices />
      <FleetSection />
      <CalculatorSection />
      <SuppliersSection />
      <WhyStructa />
      <AureveCTA />
    </main>
  )
}
