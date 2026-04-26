'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const MENUS = {
  contractor: [
    { icon: '◈', label: 'Overview',         href: '/dashboard' },
    { icon: '🧮', label: 'My estimates',    href: '/dashboard/estimates' },
    { icon: '❤', label: 'Saved materials', href: '/dashboard/saved' },
    { icon: '🏭', label: 'Saved suppliers', href: '/dashboard/suppliers' },
    { icon: '🔔', label: 'Price alerts',    href: '/dashboard/alerts' },
    { icon: '◉', label: 'Profile',          href: '/dashboard/profile' },
  ],
  supplier: [
    { icon: '◈', label: 'Overview',         href: '/dashboard' },
    { icon: '▲', label: 'Update prices',    href: '/dashboard/prices' },
    { icon: '✉', label: 'Quote requests',  href: '/dashboard/quotes' },
    { icon: '⊞', label: 'My listings',     href: '/dashboard/listings' },
    { icon: '📊', label: 'Analytics',      href: '/dashboard/analytics' },
    { icon: '◉', label: 'Profile',          href: '/dashboard/profile' },
  ],
}

const ROLE_META = {
  contractor: { color: '#E07B39', bg: 'rgba(224,123,57,0.1)', accent: '#E07B39', label: 'Contractor' },
  supplier:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', accent: '#F59E0B', label: 'Supplier'   },
}

export function StructaDashboardSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const router   = useRouter()
  const role     = (profile?.role || 'contractor') as keyof typeof MENUS
  const menu     = MENUS[role] || MENUS.contractor
  const meta     = ROLE_META[role] || ROLE_META.contractor

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside style={{
      width: '260px', flexShrink: 0,
      background: '#fff',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(17,25,39,0.08)',
    }}>
      {/* Top accent */}
      <div style={{ height: '2px', background: `linear-gradient(to right, ${meta.accent}, transparent)` }} />

      {/* User card */}
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(17,25,39,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
            background: meta.bg, border: `1.5px solid ${meta.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: meta.color,
          }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111927', marginBottom: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
              {profile?.full_name}
            </p>
            {profile?.company_name && (
              <p style={{ fontSize: '11px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                {profile.company_name}
              </p>
            )}
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              background: meta.bg, color: meta.color, padding: '2px 8px', borderRadius: '3px',
              fontFamily: 'Space Grotesk, sans-serif', border: `1px solid ${meta.accent}30`,
            }}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(17,25,39,0.3)', padding: '0 0.75rem', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          Navigation
        </p>
        {menu.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              fontFamily: 'Inter, sans-serif',
              color: isActive ? meta.color : '#475569',
              background: isActive ? meta.bg : 'transparent',
              borderLeft: `2px solid ${isActive ? meta.accent : 'transparent'}`,
              transition: 'all 0.2s ease', textDecoration: 'none',
            }}>
              <span style={{ fontSize: '12px', color: isActive ? meta.accent : 'rgba(17,25,39,0.25)', width: '16px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(17,25,39,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8A96A8', marginBottom: '8px', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: meta.accent }}>←</span> Back to Structa
        </Link>
        <button onClick={handleSignOut} style={{ width: '100%', padding: '9px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
