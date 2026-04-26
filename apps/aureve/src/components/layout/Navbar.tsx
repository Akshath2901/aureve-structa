'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [scrolled,  setScrolled]  = useState(false)
  const [user,      setUser]      = useState<any>(null)
  const [profile,   setProfile]   = useState<any>(null)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mounted,   setMounted]   = useState(false)

  const isAdmin     = pathname.startsWith('/admin')
  const isDashboard = pathname.startsWith('/dashboard')
  const isHome      = pathname === '/'

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name,role').eq('id', user.id).single()
        setProfile(data)
      }
    }
    load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load())
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null); setProfile(null)
    router.push('/'); router.refresh()
  }

  const ROLE_COLORS: Record<string, string> = {
    buyer: '#C9A84C', seller: '#1D9E75', agent: '#F59E0B',
    builder: '#E07B39', admin: '#C9A84C',
  }

  // Don't show navbar on admin pages
  if (isAdmin) return null

  const isLight = scrolled || isDashboard || !isHome
  const navBg   = scrolled || isDashboard ? 'rgba(255,255,255,0.97)' : 'transparent'
  const textCol  = isLight ? 'var(--charcoal)' : 'rgba(250,248,243,0.9)'

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,26,22,0.07)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(26,26,22,0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: textCol, textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.3s', flexShrink: 0 }}>
            Aureve
          </Link>

          {/* Desktop nav */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { label: 'Buy',        href: '/properties?type=sale' },
              { label: 'Rent',       href: '/properties?type=rent' },
              { label: 'Plots',      href: '/properties?category=plot' },
              { label: 'Commercial', href: '/properties?category=commercial' },
            ].map(link => (
              <Link key={link.label} href={link.href}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 400, color: textCol, borderRadius: '4px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', opacity: 0.85 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Structa link — desktop only */}
            <a href="http://localhost:3001" target="_blank"
              className="nav-links"
              style={{ fontSize: '12px', fontWeight: 500, padding: '7px 14px', borderRadius: '4px', border: '1px solid rgba(224,123,57,0.3)', color: '#E07B39', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(224,123,57,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              🧱 Structa
            </a>

            {mounted && user ? (
              <>
                <Link href="/dashboard"
                  style={{ fontSize: '12px', fontWeight: 500, padding: '8px 16px', borderRadius: '4px', border: `1px solid ${ROLE_COLORS[profile?.role] || 'var(--gold)'}40`, color: ROLE_COLORS[profile?.role] || 'var(--gold)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', background: `${ROLE_COLORS[profile?.role] || '#C9A84C'}10`, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⊞ Dashboard
                </Link>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${ROLE_COLORS[profile?.role] || '#C9A84C'}15`, border: `1.5px solid ${ROLE_COLORS[profile?.role] || '#C9A84C'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: ROLE_COLORS[profile?.role] || '#C9A84C', cursor: 'pointer', flexShrink: 0 }}
                  onClick={handleSignOut} title="Sign out">
                  {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="nav-links"
                  style={{ fontSize: '13px', fontWeight: 400, color: textCol, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', opacity: 0.8, padding: '8px 12px' }}>
                  Sign in
                </Link>
                <Link href="/properties"
                  style={{ fontSize: '12px', fontWeight: 600, padding: '9px 20px', borderRadius: '2px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em', boxShadow: '0 4px 16px rgba(201,168,76,0.25)', transition: 'all 0.3s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(201,168,76,0.4)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(201,168,76,0.25)' }}>
                  View properties
                </Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 60, flexShrink: 0 }}
              className="hamburger">
              <span style={{ width: '22px', height: '1.5px', background: textCol, display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
              <span style={{ width: '22px', height: '1.5px', background: textCol, display: 'block', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: '22px', height: '1.5px', background: textCol, display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
        background: 'rgba(250,248,243,0.98)', backdropFilter: 'blur(20px)',
        zIndex: 49, padding: '2rem 1.5rem',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {[
          { label: 'Buy properties',   href: '/properties?type=sale' },
          { label: 'Rent a home',      href: '/properties?type=rent' },
          { label: 'Plots & land',     href: '/properties?category=plot' },
          { label: 'Commercial',       href: '/properties?category=commercial' },
        ].map(link => (
          <Link key={link.label} href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{ padding: '1rem 0', fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, color: 'var(--charcoal)', textDecoration: 'none', borderBottom: '1px solid rgba(26,26,22,0.07)', display: 'block', transition: 'color 0.2s' }}>
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                style={{ padding: '14px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
                Go to dashboard →
              </Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                style={{ padding: '13px', background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '2px', fontSize: '12px', fontWeight: 500, color: '#dc2626', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                style={{ padding: '14px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
                Sign in →
              </Link>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)}
                style={{ padding: '13px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '12px', fontWeight: 500, color: 'var(--charcoal)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
                Create account
              </Link>
            </>
          )}
          <a href="http://localhost:3001" target="_blank"
            style={{ padding: '13px', border: '1px solid rgba(224,123,57,0.25)', borderRadius: '2px', fontSize: '12px', fontWeight: 500, color: '#E07B39', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
            🧱 Structa — Material prices
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}
