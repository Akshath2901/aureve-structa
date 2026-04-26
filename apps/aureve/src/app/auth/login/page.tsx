'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90', locality: 'Kokapet',      tag: 'Financial district living' },
  { img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1400&q=90', locality: 'Narsingi',     tag: 'Where luxury meets calm' },
  { img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=90', locality: 'Banjara Hills', tag: "Hyderabad's finest address" },
]

export default function LoginPage() {
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [slide,    setSlide]    = useState(0)
  const [ready,    setReady]    = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [mouse,    setMouse]    = useState({ x: 0, y: 0 })

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    const fn = (e: MouseEvent) => setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 14 })
    window.addEventListener('mousemove', fn, { passive: true })
    return () => { clearInterval(id); window.removeEventListener('mousemove', fn) }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
    outline: 'none', background: '#fff', color: 'var(--charcoal)',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cream)', cursor: 'default' }}>

      {/* ─── Left — cinematic ─── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'none' }} className="auth-left">

        {/* Parallax images */}
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: '-6%',
            backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.3}px) scale(1.06)`,
            transition: i === slide ? 'opacity 1.8s ease, transform 0.15s linear' : 'opacity 1.8s ease',
          }} />
        ))}

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,22,0.88) 0%, rgba(26,26,22,0.4) 60%, rgba(26,26,22,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

        {/* Vertical gold accent */}
        <div style={{ position: 'absolute', left: '8%', top: '15%', bottom: '15%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent)', opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 0.5s' }} />

        {/* Slide nav */}
        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 5 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: '2px', height: i === slide ? '40px' : '14px', background: i === slide ? '#C9A84C' : 'rgba(250,248,243,0.2)', border: 'none', cursor: 'pointer', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', padding: 0 }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem 3rem 3rem 10%' }}>
          {/* Logo */}
          <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(-10px)', transition: 'all 1s ease 0.3s' }}>
            <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, color: '#FAF8F3', textDecoration: 'none', letterSpacing: '0.05em' }}>
              Aureve
            </Link>
          </div>

          {/* Main text */}
          <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#C9A84C' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'DM Sans, sans-serif' }}>
                {SLIDES[slide].tag}
              </span>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
              Welcome back<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.5)' }}>to Aureve.</em>
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(250,248,243,0.45)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.8, maxWidth: '340px' }}>
              Access your saved properties, enquiries, and curated recommendations.
            </p>
          </div>

          {/* Bottom stats */}
          <div style={{ display: 'flex', gap: '3rem', opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 1s' }}>
            {[
              { value: '26+', label: 'Properties' },
              { value: '14',  label: 'Localities' },
              { value: '₹0',  label: 'Brokerage'  },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#C9A84C', fontWeight: 300, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.3)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right — form ─── */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', background: 'var(--cream)', position: 'relative' }}>

        {/* Back to home */}
        <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold-dark)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
          ← Home
        </Link>

        <div style={{ width: '100%', maxWidth: '360px', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(24px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>

          {/* Logo — mobile only */}
          <div style={{ marginBottom: '3rem' }}>
            <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, color: 'var(--charcoal)', textDecoration: 'none', letterSpacing: '0.05em', display: 'block', marginBottom: '2rem' }}>
              Aureve
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Welcome back</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em', lineHeight: 1 }}>Sign in</h1>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '2px', padding: '12px 16px', fontSize: '13px', color: '#dc2626', marginBottom: '1.25rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '7px', fontFamily: 'DM Sans, sans-serif' }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={inputBase}
                onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(26,26,22,0.12)'; e.target.style.boxShadow = 'none' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Password</label>
                <button type="button" style={{ fontSize: '11px', color: 'var(--gold-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Forgot?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required
                  style={{ ...inputBase, paddingRight: '44px' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(26,26,22,0.12)'; e.target.style.boxShadow = 'none' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', padding: '4px' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '8px', padding: '15px', background: loading ? 'rgba(26,26,22,0.08)' : 'var(--charcoal)', color: loading ? 'var(--text-muted)' : '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)' }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,22,0.08)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,22,0.08)' }} />
          </div>

          {/* Create account */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '12px', fontWeight: 300 }}>
              Don't have an account?
            </p>
            <Link href="/auth/signup"
              style={{ display: 'block', padding: '13px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '11px', fontWeight: 600, color: 'var(--charcoal)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold-dark)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.12)'; el.style.color = 'var(--charcoal)' }}>
              Create free account
            </Link>
          </div>

          {/* Trust signals */}
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🔒 Secure login', 'RERA verified', 'Zero brokerage'].map(t => (
              <span key={t} style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', opacity: 0.6 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .auth-left { display: block !important; flex: 1 !important; }
        }
        input::placeholder { color: rgba(26,26,22,0.25); }
      `}</style>
    </div>
  )
}
