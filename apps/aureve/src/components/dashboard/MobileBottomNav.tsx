'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ROLE_NAV: Record<string, any[]> = {
  buyer: [
    { icon: '◈', label: 'Home',     href: '/dashboard' },
    { icon: '♡', label: 'Saved',    href: '/dashboard/saved' },
    { icon: '✉', label: 'Enquiries',href: '/dashboard/enquiries' },
    { icon: '🔔', label: 'Alerts',  href: '/dashboard/alerts' },
    { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
  ],
  seller: [
    { icon: '◈', label: 'Home',     href: '/dashboard' },
    { icon: '⊞', label: 'Listings', href: '/dashboard/listings' },
    { icon: '✉', label: 'Enquiries',href: '/dashboard/enquiries' },
    { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
  ],
  agent: [
    { icon: '◈', label: 'Home',     href: '/dashboard' },
    { icon: '👥', label: 'Clients', href: '/dashboard/clients' },
    { icon: '📅', label: 'Visits',  href: '/dashboard/visits' },
    { icon: '⊞', label: 'Listings', href: '/dashboard/listings' },
    { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
  ],
  builder: [
    { icon: '◈', label: 'Home',     href: '/dashboard' },
    { icon: '🏗', label: 'Projects', href: '/dashboard/projects' },
    { icon: '✉', label: 'Enquiries',href: '/dashboard/enquiries' },
    { icon: '📋', label: 'RERA',    href: '/dashboard/rera' },
    { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
  ],
}

const ROLE_COLORS: Record<string, string> = {
  buyer: '#C9A84C', seller: '#1D9E75', agent: '#F59E0B', builder: '#E07B39',
}

export function MobileBottomNav({ role }: { role: string }) {
  const pathname = usePathname()
  const nav   = ROLE_NAV[role] || ROLE_NAV.buyer
  const color = ROLE_COLORS[role] || '#C9A84C'

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(26,26,22,0.08)',
      display: 'flex', alignItems: 'center',
      zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
    }} className="mobile-bottom-nav">
      {nav.map(item => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 4px', textDecoration: 'none', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.1rem', color: isActive ? color : 'rgba(26,26,22,0.3)', transition: 'color 0.2s' }}>
              {item.icon}
            </span>
            <span style={{ fontSize: '9px', fontWeight: isActive ? 600 : 400, color: isActive ? color : 'rgba(26,26,22,0.4)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }}>
              {item.label}
            </span>
            {isActive && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, position: 'absolute', top: '6px' }} />}
          </Link>
        )
      })}
    </nav>
  )
}
