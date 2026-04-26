'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StructaLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(17,25,39,0.15)',
    fontSize: '14px', fontFamily: 'Inter, sans-serif',
    outline: 'none', background: '#fff',
    color: '#111927', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--concrete)' }}>

      {/* Left panel — dark industrial */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, #111927 0%, #1E2A3A 100%)',
        padding: '3rem', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }} className="login-left">

        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(224,123,57,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(224,123,57,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Structa
            <span style={{ fontSize: '10px', background: 'rgba(224,123,57,0.15)', color: '#E07B39', padding: '2px 6px', borderRadius: '4px' }}>BETA</span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '30px', height: '1px', background: '#E07B39' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>
              Construction intelligence
            </span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#fff', fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            Welcome back<br />
            <span style={{ color: '#F5BC5C', fontWeight: 300 }}>to Structa.</span>
          </h2>
          <p style={{ color: 'rgba(247,247,246,0.5)', fontSize: '14px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
            Access live material prices, your saved estimates, and supplier contacts.
          </p>

          {/* Live prices preview */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Cement 53G', price: '₹370/bag', change: '-2.1%', up: false },
              { name: 'TMT Steel',  price: '₹67/kg',   change: '+1.8%', up: true  },
              { name: 'M-Sand',     price: '₹52/cft',  change: '+3.2%', up: true  },
            ].map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', color: 'rgba(247,247,246,0.6)', fontFamily: 'Inter, sans-serif' }}>{m.name}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{m.price}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: m.up ? '#1D9E75' : '#E07B39' }}>
                    {m.up ? '▲' : '▼'} {m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(247,247,246,0.2)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
          © {new Date().getFullYear()} Structa · A product of Aureve Group
        </p>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <Link href="/" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: '#1E2A3A', display: 'block', marginBottom: '2.5rem', textDecoration: 'none' }}>
            Structa
          </Link>

          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 600, color: '#111927', marginBottom: '6px' }}>Sign in</h2>
          <p style={{ fontSize: '14px', color: '#8A96A8', marginBottom: '2rem', fontFamily: 'Inter, sans-serif' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#E07B39', fontWeight: 500 }}>Create one</Link>
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
              </div>
              <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(224,123,57,0.5)' : '#E07B39',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em',
              marginTop: '4px',
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(224,123,57,0.05)', borderRadius: '8px', border: '1px solid rgba(224,123,57,0.15)' }}>
            <p style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0 }}>
              Are you a <strong style={{ color: '#E07B39' }}>material supplier</strong>? Sign up to list your products and receive quote requests from contractors.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .login-left { display: flex !important; } }
        input:focus { border-color: #E07B39 !important; box-shadow: 0 0 0 3px rgba(224,123,57,0.1); }
      `}</style>
    </div>
  )
}
