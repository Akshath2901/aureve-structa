'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLE_MENUS = {
  buyer: [
    { icon: '◈', label: 'Overview',          href: '/dashboard' },
    { icon: '❤', label: 'Saved properties',  href: '/dashboard/saved' },
    { icon: '✉', label: 'My enquiries',      href: '/dashboard/enquiries' },
    { icon: '◎', label: 'Price alerts',      href: '/dashboard/alerts' },
    { icon: '⬡', label: 'EMI calculator',   href: '/dashboard/emi' },
    { icon: '◉', label: 'Profile',           href: '/dashboard/profile' },
  ],
  seller: [
    { icon: '◈', label: 'Overview',          href: '/dashboard' },
    { icon: '⊞', label: 'My listings',       href: '/dashboard/listings' },
    { icon: '✦', label: 'Add property',      href: '/dashboard/listings/new' },
    { icon: '✉', label: 'Enquiries',         href: '/dashboard/enquiries' },
    { icon: '▲', label: 'Analytics',         href: '/dashboard/analytics' },
    { icon: '◉', label: 'Profile',           href: '/dashboard/profile' },
  ],
  agent: [
    { icon: '◈', label: 'Overview',          href: '/dashboard' },
    { icon: '⊞', label: 'Client listings',   href: '/dashboard/listings' },
    { icon: '◎', label: 'My clients',        href: '/dashboard/clients' },
    { icon: '✉', label: 'Lead pipeline',     href: '/dashboard/enquiries' },
    { icon: '⬡', label: 'Site visits',      href: '/dashboard/visits' },
    { icon: '◉', label: 'Profile',           href: '/dashboard/profile' },
  ],
  builder: [
    { icon: '◈', label: 'Overview',          href: '/dashboard' },
    { icon: '⊞', label: 'My projects',       href: '/dashboard/projects' },
    { icon: '✦', label: 'Add project',       href: '/dashboard/projects/new' },
    { icon: '✉', label: 'All enquiries',     href: '/dashboard/enquiries' },
    { icon: '▲', label: 'Analytics',         href: '/dashboard/analytics' },
    { icon: '◉', label: 'RERA documents',    href: '/dashboard/rera' },
    { icon: '◉', label: 'Profile',           href: '/dashboard/profile' },
  ],
  admin: [
    { icon: '⚡', label: 'Super admin',      href: '/admin' },
    { icon: '◈', label: 'Aureve admin',      href: '/admin/aureve' },
    { icon: '◈', label: 'Structa admin',     href: '/admin/structa' },
    { icon: '◎', label: 'All users',         href: '/admin/users' },
    { icon: '▲', label: 'Analytics',         href: '/admin/analytics' },
  ],
}

const ROLE_META = {
  buyer:   { color: '#866820', accent: '#C9A84C', bg: 'rgba(201,168,76,0.08)',  label: 'Buyer'   },
  seller:  { color: '#085041', accent: '#1D9E75', bg: 'rgba(29,158,117,0.08)', label: 'Seller'  },
  agent:   { color: '#866820', accent: '#C9A84C', bg: 'rgba(201,168,76,0.08)', label: 'Agent'   },
  builder: { color: '#7A3010', accent: '#E07B39', bg: 'rgba(224,123,57,0.08)', label: 'Builder' },
  admin:   { color: '#7f1d1d', accent: '#ef4444', bg: 'rgba(239,68,68,0.08)',  label: 'Admin'   },
}

export function DashboardSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const router   = useRouter()
  const role     = (profile?.role || 'buyer') as keyof typeof ROLE_MENUS
  const menu     = ROLE_MENUS[role] || ROLE_MENUS.buyer
  const meta     = ROLE_META[role] || ROLE_META.buyer

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
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(26,26,22,0.08)',
    }}>
      <div style={{ height: '2px', background: `linear-gradient(to right, ${meta.accent}, transparent)` }} />

      {/* User card */}
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
            background: meta.bg, border: `1.5px solid ${meta.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 500, color: meta.color,
          }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A16', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
              {profile?.full_name}
            </p>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: meta.bg, color: meta.color, padding: '2px 8px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif', border: `1px solid ${meta.accent}30` }}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,22,0.3)', padding: '0 0.75rem', marginBottom: '0.75rem', fontFamily: 'DM Sans, sans-serif' }}>
          Navigation
        </p>
        {menu.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
              fontSize: '13px', fontWeight: isActive ? 500 : 400,
              fontFamily: 'DM Sans, sans-serif',
              color: isActive ? meta.color : '#4A4A45',
              background: isActive ? meta.bg : 'transparent',
              borderLeft: `2px solid ${isActive ? meta.accent : 'transparent'}`,
              transition: 'all 0.2s ease', textDecoration: 'none',
            }}>
              <span style={{ fontSize: '12px', color: isActive ? meta.accent : 'rgba(26,26,22,0.25)', width: '16px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(26,26,22,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
          <span style={{ color: meta.accent, fontSize: '10px' }}>←</span>
          Back to Aureve
        </Link>
        <button onClick={handleSignOut} style={{ width: '100%', padding: '9px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
