import type { Metadata } from 'next'
import './globals.css'
import { StructaNavbar } from '@/components/layout/StructaNavbar'

export const metadata: Metadata = {
  title: {
    default: 'Structa — Live Construction Material Prices',
    template: '%s | Structa',
  },
  description: 'Live cement, steel, brick and sand prices for Hyderabad builders.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StructaNavbar />
        {children}
      </body>
    </html>
  )
}
