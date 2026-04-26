import { SuppliersSection } from '@/components/sections/SuppliersSection'

export const metadata = { title: 'Verified Suppliers' }

export default function SuppliersPage() {
  return (
    <div style={{ paddingTop: '4rem' }}>
      <SuppliersSection />
    </div>
  )
}
