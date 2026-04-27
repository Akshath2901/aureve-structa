'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLE_CONFIG = {
  buyer: {
    color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', label: 'Buyer',
    gradient: 'linear-gradient(135deg, #1A1A16 0%, #2C2820 100%)',
    nav: [
      { icon: '◈', label: 'Overview',     href: '/dashboard' },
      { icon: '♡', label: 'Saved',        href: '/dashboard/saved' },
      { icon: '✉', label: 'Enquiries',    href: '/dashboard/enquiries' },
      { icon: '🔔', label: 'Alerts',      href: '/dashboard/alerts' },
      { icon: '◎', label: 'EMI',          href: '/dashboard/emi' },
      { icon: '◉', label: 'Profile',      href: '/dashboard/profile' },
    ],
  },
  seller: {
    color: '#1D9E75', bg: 'rgba(29,158,117,0.08)', label: 'Seller',
    gradient: 'linear-gradient(135deg, #0D1F1A 0%, #1A2E24 100%)',
    nav: [
      { icon: '◈', label: 'Overview',  href: '/dashboard' },
      { icon: '⊞', label: 'Listings', href: '/dashboard/listings' },
      { icon: '✉', label: 'Enquiries',href: '/dashboard/enquiries' },
      { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
    ],
  },
  agent: {
    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Agent',
    gradient: 'linear-gradient(135deg, #1F1A0D 0%, #2E2614 100%)',
    nav: [
      { icon: '◈', label: 'Overview', href: '/dashboard' },
      { icon: '👥', label: 'Clients', href: '/dashboard/clients' },
      { icon: '📅', label: 'Visits',  href: '/dashboard/visits' },
      { icon: '⊞', label: 'Listings',href: '/dashboard/listings' },
      { icon: '◉', label: 'Profile', href: '/dashboard/profile' },
    ],
  },
  builder: {
    color: '#E07B39', bg: 'rgba(224,123,57,0.08)', label: 'Builder',
    gradient: 'linear-gradient(135deg, #1F1208 0%, #2E1C10 100%)',
    nav: [
      { icon: '◈', label: 'Overview',  href: '/dashboard' },
      { icon: '🏗', label: 'Projects', href: '/dashboard/projects' },
      { icon: '✉', label: 'Enquiries',href: '/dashboard/enquiries' },
      { icon: '📋', label: 'RERA',    href: '/dashboard/rera' },
      { icon: '◉', label: 'Profile',  href: '/dashboard/profile' },
    ],
  },
  admin: {
    color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', label: 'Admin',
    gradient: 'linear-gradient(135deg, #1A1A16 0%, #2C2820 100%)',
    nav: [
      { icon: '⚡', label: 'Admin',   href: '/admin' },
      { icon: '◉', label: 'Profile', href: '/dashboard/profile' },
    ],
  },
}

export function DashboardShell({ profile, children }: { profile: any; children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const role     = (profile?.role || 'buyer') as keyof typeof ROLE_CONFIG
  const config   = ROLE_CONFIG[role] || ROLE_CONFIG.buyer
  const [collapsed, setCollapsed] = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [mobileMenuOpen, setMobileMenu] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 80) }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/'); router.refresh()
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', display: 'flex', paddingTop: '72px' }}>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside style={{
        width: collapsed ? '68px' : '260px',
        flexShrink: 0,
        background: '#fff',
        minHeight: 'calc(100vh - 72px)',
        borderRight: '1px solid rgba(26,26,22,0.07)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: '72px', alignSelf: 'flex-start',
        height: 'calc(100vh - 72px)',
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
        transitionProperty: 'width, opacity, transform',
        transitionDuration: '0.4s, 0.6s, 0.6s',
        zIndex: 20,
      }} className="dashboard-sidebar">

        {/* Gold accent top */}
        <div style={{ height: '2px', background: `linear-gradient(to right, ${config.color}, transparent)`, flexShrink: 0 }} />

        {/* User card */}
        <div style={{ padding: collapsed ? '1rem 0.5rem' : '1.25rem', borderBottom: '1px solid rgba(26,26,22,0.06)', flexShrink: 0 }}>
          {collapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: config.bg, border: `1.5px solid ${config.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: config.color, fontWeight: 400 }}>
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, background: config.bg, border: `1.5px solid ${config.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: config.color, fontWeight: 400, animation: mounted ? 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both' : 'none' }}>
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-10px)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name}
                </p>
                <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: config.bg, color: config.color, padding: '2px 8px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', border: `1px solid ${config.color}25` }}>
                  {config.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '1rem 0.5rem' : '1rem 0.75rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {!collapsed && (
            <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(26,26,22,0.25)', padding: '0 0.75rem', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>
              Navigation
            </p>
          )}
          {config.nav.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '10px', padding: collapsed ? '10px' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '4px', marginBottom: '2px',
                  fontSize: '13px', fontWeight: isActive ? 600 : 400,
                  fontFamily: 'DM Sans, sans-serif',
                  color: isActive ? config.color : 'var(--text-secondary)',
                  background: isActive ? config.bg : 'transparent',
                  borderLeft: collapsed ? 'none' : `2px solid ${isActive ? config.color : 'transparent'}`,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                  transition: `all 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease ${i * 0.05 + 0.25}s, transform 0.5s ease ${i * 0.05 + 0.25}s`,
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(26,26,22,0.04)'; (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)' } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' } }}>
                <span style={{ fontSize: '14px', color: isActive ? config.color : 'rgba(26,26,22,0.22)', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: collapsed ? '0.75rem' : '1rem', borderTop: '1px solid rgba(26,26,22,0.06)', flexShrink: 0 }}>
          {!collapsed && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = config.color}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
              <span style={{ color: config.color }}>←</span> Back to Aureve
            </Link>
          )}
          <button onClick={handleSignOut}
            style={{ width: '100%', padding: collapsed ? '8px 6px' : '8px 12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '4px', fontSize: '11px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.04)'}>
            {collapsed ? '×' : 'Sign out'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ position: 'absolute', top: '50%', right: '-12px', transform: 'translateY(-50%)', width: '24px', height: '24px', background: '#fff', border: '1px solid rgba(26,26,22,0.1)', borderRadius: '50%', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', boxShadow: '0 2px 8px rgba(26,26,22,0.1)', zIndex: 10, transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = config.color; el.style.color = '#fff' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.color = 'var(--text-muted)' }}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{
        flex: 1, minWidth: 0,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s',
      }}>

        {/* ─── MOBILE HEADER ─── */}
        <div className="mobile-dash-header" style={{ display: 'none', background: config.gradient, padding: '1.5rem 1.25rem 1.25rem', position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${config.color}20` }}>
          {/* Background pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${config.color}, transparent)` }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${config.color}08` }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${config.color}15`, border: `1.5px solid ${config.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: config.color, fontWeight: 400 }}>
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '10px', color: `${config.color}80`, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>
                  {greeting}
                </p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 300, color: '#FAF8F3', lineHeight: 1 }}>
                  {firstName}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: `${config.color}20`, color: config.color, padding: '4px 10px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', border: `1px solid ${config.color}30` }}>
                {config.label}
              </span>
              <button onClick={() => setMobileMenu(!mobileMenuOpen)}
                style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: '#FAF8F3' }}>
                {mobileMenuOpen ? '×' : '☰'}
              </button>
            </div>
          </div>

          {/* Date strip */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', animation: 'dashPulse 2s infinite' }} />
            <span style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <div className="mobile-dash-header" style={{
          display: 'none',
          background: '#fff',
          borderBottom: '1px solid rgba(26,26,22,0.07)',
          overflow: 'hidden',
          maxHeight: mobileMenuOpen ? '400px' : '0',
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: mobileMenuOpen ? '0 8px 24px rgba(26,26,22,0.1)' : 'none',
        }}>
          <div style={{ padding: '1rem' }}>
            {config.nav.map((item, i) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '4px', marginBottom: '4px', textDecoration: 'none', background: isActive ? config.bg : 'transparent', borderLeft: `2px solid ${isActive ? config.color : 'transparent'}`, transition: 'all 0.2s', opacity: mobileMenuOpen ? 1 : 0, transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)', transitionDelay: `${i * 0.04}s` }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(26,26,22,0.04)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: isActive ? 600 : 400, color: isActive ? config.color : 'var(--charcoal)' }}>{item.label}</span>
                  {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: config.color }} />}
                </Link>
              )
            })}
            <div style={{ borderTop: '1px solid rgba(26,26,22,0.06)', marginTop: '8px', paddingTop: '8px', display: 'flex', gap: '8px' }}>
              <Link href="/" style={{ flex: 1, padding: '10px', background: 'var(--cream)', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, color: 'var(--charcoal)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
                ← Aureve
              </Link>
              <button onClick={handleSignOut} style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* ─── DESKTOP GREETING ─── */}
        <div className="desktop-only" style={{ padding: '2rem 2.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                {greeting}, {firstName}
              </p>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.25rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1, letterSpacing: '-0.01em' }}>
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
        </div>

        {/* ─── PAGE CONTENT ─── */}
        <div style={{ padding: '1.5rem 2.5rem 5rem' }} className="dash-content">
          {children}
        </div>
      </main>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(26,26,22,0.08)',
        display: 'none', alignItems: 'center',
        zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px rgba(26,26,22,0.08)',
      }}>
        {config.nav.slice(0, 5).map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 4px 8px', textDecoration: 'none', position: 'relative', transition: 'all 0.2s' }}>
              {isActive && (
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: '2px', background: config.color, borderRadius: '0 0 2px 2px' }} />
              )}
              <span style={{ fontSize: '1.15rem', color: isActive ? config.color : 'rgba(26,26,22,0.28)', transition: 'all 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '9px', fontWeight: isActive ? 700 : 400, color: isActive ? config.color : 'rgba(26,26,22,0.35)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <style>{`
        @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes dashPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        @media (min-width: 769px) {
          .mobile-dash-header { display: none !important; }
          .mobile-bottom-nav  { display: none !important; }
          .desktop-only       { display: block !important; }
          .dash-content       { padding: 0 2.5rem 5rem !important; }
        }

        @media (max-width: 768px) {
          .dashboard-sidebar  { display: none !important; }
          .mobile-dash-header { display: block !important; }
          .mobile-bottom-nav  { display: flex !important; }
          .desktop-only       { display: none !important; }
          .dash-content       { padding: 1.25rem 1rem 6rem !important; }

          /* Stat cards — 2 col */
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }

          /* Dashboard 2-col layouts */
          div[style*="grid-template-columns: 1fr 340px"],
          div[style*="grid-template-columns: 1fr 300px"],
          div[style*="grid-template-columns: 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }

          /* Tables */
          table { display: block; overflow-x: auto; font-size: 12px; }

          /* Builder/agent pipeline */
          div[style*="grid-template-columns: 1fr 300px"],
          div[style*="grid-template-columns: 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 420px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
