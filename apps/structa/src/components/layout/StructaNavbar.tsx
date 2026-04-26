'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function StructaNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [profile,  setProfile]  = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('structa_profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    loadUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
      else loadUser()
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  const ROLE_COLORS: Record<string, string> = {
    contractor: '#E07B39',
    supplier:   '#F59E0B',
  }

  const navColor = scrolled ? '#475569' : 'rgba(247,247,246,0.85)'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(17,25,39,0.1)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1.4rem', fontWeight: 600,
          color: scrolled ? '#1E2A3A' : '#fff',
          letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none',
        }}>
          Structa
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', background: 'rgba(224,123,57,0.15)', color: '#E07B39', padding: '2px 6px', borderRadius: '4px' }}>
            BETA
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { label: 'Materials',  href: '/materials' },
            { label: 'Suppliers',  href: '/suppliers' },
            { label: 'Calculator', href: '/calculator' },
            { label: 'Prices',     href: '/materials' },
          ].map((link) => (
            <Link key={link.label} href={link.href} style={{
              padding: '7px 12px', fontSize: '14px', fontWeight: 500,
              color: navColor, borderRadius: '6px', textDecoration: 'none',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="https://aureve-app.vercel.app" target="_blank" style={{
            fontSize: '12px', fontWeight: 500, padding: '6px 12px',
            borderRadius: '99px', border: '1px solid rgba(224,123,57,0.3)',
            color: scrolled ? '#8A96A8' : 'rgba(247,247,246,0.7)',
            textDecoration: 'none',
          }}>
            🏠 Aureve
          </a>

          {user && profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Dashboard link */}
              <Link href="/dashboard" style={{
                fontSize: '13px', fontWeight: 500,
                padding: '7px 14px', borderRadius: '6px',
                color: scrolled ? '#4A4A45' : 'rgba(247,247,246,0.85)',
                border: '1px solid rgba(224,123,57,0.3)',
                background: 'rgba(224,123,57,0.08)',
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                ⊞ Dashboard
              </Link>

              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `${ROLE_COLORS[profile?.role] || '#E07B39'}20`,
                border: `1.5px solid ${ROLE_COLORS[profile?.role] || '#E07B39'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600,
                color: ROLE_COLORS[profile?.role] || '#E07B39',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>

              <button onClick={handleSignOut} style={{
                fontSize: '13px', fontWeight: 500,
                color: navColor, background: 'none', border: 'none',
                cursor: 'pointer', padding: '8px 4px',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/auth/login" style={{
                fontSize: '13px', fontWeight: 500,
                color: navColor, padding: '7px 14px',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                Sign in
              </Link>
              <Link href="/auth/signup" style={{
                fontSize: '13px', fontWeight: 600, padding: '8px 18px',
                borderRadius: '6px', background: '#E07B39', color: '#fff',
                textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif',
              }}>
                List as supplier
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
