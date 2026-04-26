'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MobileBottomNav } from './MobileBottomNav'

const ROLE_CONFIG = {
  buyer: {
    color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', label: 'Buyer',
    nav: [
      { icon: '◈', label: 'Overview',     href: '/dashboard' },
      { icon: '♡', label: 'Saved homes',  href: '/dashboard/saved' },
      { icon: '✉', label: 'Enquiries',    href: '/dashboard/enquiries' },
      { icon: '🔔', label: 'Price alerts', href: '/dashboard/alerts' },
      { icon: '◎', label: 'EMI calc',     href: '/dashboard/emi' },
      { icon: '◉', label: 'Profile',      href: '/dashboard/profile' },
    ],
  },
  seller: {
    color: '#1D9E75', bg: 'rgba(29,158,117,0.1)', label: 'Seller',
    nav: [
      { icon: '◈', label: 'Overview',     href: '/dashboard' },
      { icon: '⊞', label: 'My listings',  href: '/dashboard/listings' },
      { icon: '✉', label: 'Enquiries',    href: '/dashboard/enquiries' },
      { icon: '◉', label: 'Profile',      href: '/dashboard/profile' },
    ],
  },
  agent: {
    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Agent',
    nav: [
      { icon: '◈', label: 'Overview',      href: '/dashboard' },
      { icon: '👥', label: 'My clients',   href: '/dashboard/clients' },
      { icon: '📅', label: 'Site visits',  href: '/dashboard/visits' },
      { icon: '⊞', label: 'Listings',      href: '/dashboard/listings' },
      { icon: '◉', label: 'Profile',       href: '/dashboard/profile' },
    ],
  },
  builder: {
    color: '#E07B39', bg: 'rgba(224,123,57,0.1)', label: 'Builder',
    nav: [
      { icon: '◈', label: 'Overview',     href: '/dashboard' },
      { icon: '🏗', label: 'Projects',    href: '/dashboard/projects' },
      { icon: '✉', label: 'Enquiries',    href: '/dashboard/enquiries' },
      { icon: '📋', label: 'RERA docs',   href: '/dashboard/rera' },
      { icon: '◉', label: 'Profile',      href: '/dashboard/profile' },
    ],
  },
  admin: {
    color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', label: 'Admin',
    nav: [
      { icon: '⚡', label: 'Admin panel', href: '/admin' },
      { icon: '◉', label: 'Profile',     href: '/dashboard/profile' },
    ],
  },
}

export { }

export function DashboardShell({ profile, children }: { profile: any; children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const role     = (profile?.role || 'buyer') as keyof typeof ROLE_CONFIG
  const config   = ROLE_CONFIG[role] || ROLE_CONFIG.buyer
  const [collapsed, setCollapsed] = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/'); router.refresh()
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', paddingTop: '72px' }}>

      {/* ─── Sidebar — desktop only ─── */}
      <aside className="dashboard-sidebar" style={{
        width: collapsed ? '64px' : '260px',
        flexShrink: 0, background: '#fff',
        minHeight: 'calc(100vh - 72px)',
        borderRight: '1px solid rgba(26,26,22,0.07)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: '72px', alignSelf: 'flex-start',
        height: 'calc(100vh - 72px)',
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
      }}>
        <div style={{ height: '2px', background: `linear-gradient(to right, ${config.color}, transparent)`, flexShrink: 0 }} />

        {!collapsed && (
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: config.bg, border: `1.5px solid ${config.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: config.color }}>
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name}
                </p>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: config.bg, color: config.color, padding: '2px 7px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(26,26,22,0.06)', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: config.bg, border: `1.5px solid ${config.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: config.color }}>
              {profile?.full_name?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: collapsed ? '1rem 0.5rem' : '1.25rem 0.75rem', overflowY: 'auto' }}>
          {!collapsed && (
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(26,26,22,0.3)', padding: '0 0.75rem', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
              Navigation
            </p>
          )}
          {config.nav.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: collapsed ? '10px' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '4px', marginBottom: '2px', fontSize: '13px', fontWeight: isActive ? 600 : 400, fontFamily: 'DM Sans, sans-serif', color: isActive ? config.color : 'var(--text-secondary)', background: isActive ? config.bg : 'transparent', borderLeft: collapsed ? 'none' : `2px solid ${isActive ? config.color : 'transparent'}`, transition: 'all 0.2s', textDecoration: 'none', whiteSpace: 'nowrap', opacity: mounted ? 1 : 0, transitionDelay: `${i * 0.05 + 0.2}s` }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(26,26,22,0.04)' } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent' } }}>
                <span style={{ fontSize: '13px', color: isActive ? config.color : 'rgba(26,26,22,0.25)', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: collapsed ? '0.75rem' : '1rem', borderTop: '1px solid rgba(26,26,22,0.06)', flexShrink: 0 }}>
          {!collapsed && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = config.color}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
              <span style={{ color: config.color }}>←</span> Back to Aureve
            </Link>
          )}
          <button onClick={handleSignOut}
            style={{ width: '100%', padding: collapsed ? '8px 6px' : '8px 12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}>
            {collapsed ? '×' : 'Sign out'}
          </button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)}
          style={{ position: 'absolute', top: '50%', right: '-12px', transform: 'translateY(-50%)', width: '24px', height: '24px', background: '#fff', border: '1px solid rgba(26,26,22,0.1)', borderRadius: '50%', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', boxShadow: '0 2px 8px rgba(26,26,22,0.08)', zIndex: 10, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = config.color; (e.currentTarget as HTMLElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* ─── Main ─── */}
      <main style={{ flex: 1, padding: '2.5rem', minWidth: 0, paddingBottom: '6rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
              {greeting}, {firstName}
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1, letterSpacing: '-0.01em' }}>
              {config.label} dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', animation: 'dashPulse 2s infinite' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav role={role} />

      <style>{`
        @keyframes dashPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
          main { padding: 1.25rem !important; padding-bottom: 5rem !important; }
        }
        .mobile-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
