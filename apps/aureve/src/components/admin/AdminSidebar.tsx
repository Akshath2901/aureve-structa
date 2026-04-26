'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { section: 'Overview',
    items: [
      { icon: '⚡', label: 'Super Dashboard',  href: '/admin',           tier: ['super'] },
      { icon: '◈', label: 'Aureve Dashboard',  href: '/admin/aureve',   tier: ['super','cofounder','operations','content'] },
      { icon: '🧱', label: 'Structa Dashboard', href: '/admin/structa',  tier: ['super','cofounder','operations','content'] },
    ]
  },
  { section: 'Users & Platform',
    items: [
      { icon: '◎', label: 'All users',         href: '/admin/users',    tier: ['super','cofounder','operations'] },
      { icon: '⊞', label: 'Builders',          href: '/admin/builders', tier: ['super','cofounder','operations'] },
      { icon: '🏠', label: 'Listings',          href: '/admin/listings', tier: ['super','cofounder','operations','content'] },
      { icon: '✉', label: 'Enquiries',         href: '/admin/enquiries',tier: ['super','cofounder','operations'] },
    ]
  },
  { section: 'Structa',
    items: [
      { icon: '🏭', label: 'Suppliers',         href: '/admin/suppliers',tier: ['super','cofounder','operations'] },
      { icon: '▲',  label: 'Material prices',   href: '/admin/prices',  tier: ['super','cofounder','content'] },
    ]
  },
  { section: 'Business',
    items: [
      { icon: '◉', label: 'Revenue',           href: '/admin/revenue',  tier: ['super','cofounder'] },
      { icon: '📢', label: 'Communications',   href: '/admin/comms',    tier: ['super','cofounder','operations'] },
      { icon: '◎', label: 'Audit log',         href: '/admin/audit',    tier: ['super'] },
      { icon: '⚙', label: 'Settings',          href: '/admin/settings', tier: ['super'] },
    ]
  },
]

const TIER_META: Record<string, { color: string; label: string; bg: string }> = {
  super:      { color: '#866820', label: 'Super Admin', bg: 'rgba(201,168,76,0.12)' },
  cofounder:  { color: '#534AB7', label: 'Co-founder',  bg: 'rgba(83,74,183,0.1)'  },
  operations: { color: '#085041', label: 'Operations',  bg: 'rgba(29,158,117,0.1)' },
  content:    { color: '#4A4A45', label: 'Content',     bg: 'rgba(74,74,69,0.1)'   },
}

export function AdminSidebar({ profile, adminProfile }: { profile: any; adminProfile: any }) {
  const pathname = usePathname()
  const router   = useRouter()
  const tier     = adminProfile?.tier || 'operations'
  const meta     = TIER_META[tier] || TIER_META.operations

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
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(26,26,22,0.08)',
      position: 'sticky', top: 0,
    }}>
      {/* Gold top accent */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />

      {/* Logo + user */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--charcoal)', textDecoration: 'none' }}>Aureve</Link>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-dark)', padding: '2px 6px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif' }}>
            ADMIN
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--cream)', borderRadius: '10px', border: '1px solid rgba(26,26,22,0.06)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: meta.bg, border: `1.5px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: meta.color }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.full_name}
            </p>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: meta.bg, color: meta.color, padding: '1px 6px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif' }}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {NAV.map((section) => {
          const visibleItems = section.items.filter(item => item.tier.includes(tier))
          if (visibleItems.length === 0) return null
          return (
            <div key={section.section} style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,22,0.3)', padding: '0 0.75rem', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                {section.section}
              </p>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px', marginBottom: '1px',
                    fontSize: '13px', fontWeight: isActive ? 500 : 400,
                    color: isActive ? 'var(--gold-dark)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                    borderLeft: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                    transition: 'all 0.15s ease', textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    <span style={{ fontSize: '12px', color: isActive ? 'var(--gold)' : 'rgba(26,26,22,0.25)', width: '16px', textAlign: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(26,26,22,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
          <span style={{ color: 'var(--gold)' }}>←</span> Back to Aureve
        </Link>
        <button onClick={handleSignOut} style={{ width: '100%', padding: '8px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
