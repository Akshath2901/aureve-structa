import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { GlobalAnimations } from '@/components/GlobalAnimations'

export const metadata: Metadata = {
  title: 'Aureve — Premium Real Estate Hyderabad',
  description: 'Discover premium apartments, villas, and plots across Hyderabad. RERA certified. Zero brokerage.',
  openGraph: {
    title: 'Aureve — Premium Real Estate Hyderabad',
    description: 'Curated premium properties across Hyderabad. RERA certified. Zero brokerage.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Navbar />
        <GlobalAnimations />
        {children}
      </body>
    </html>
  )
}
