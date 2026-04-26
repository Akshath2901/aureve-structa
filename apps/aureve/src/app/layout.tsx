import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'Aureve — Premium Real Estate in Hyderabad',
    template: '%s | Aureve',
  },
  description: 'Discover premium residences, plots, and commercial spaces across Hyderabad.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}