import { LivePrices } from '@/components/sections/LivePrices'

export const metadata = { title: 'Live Material Prices' }

export default function MaterialsPage() {
  return (
    <div style={{ paddingTop: '4rem' }}>
      <LivePrices />
    </div>
  )
}
