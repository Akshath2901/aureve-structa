'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  {
    value: 'buyer',
    icon: '🏠',
    label: 'Buyer',
    desc: 'I want to buy or rent a home in Hyderabad.',
    color: '#C9A84C',
    bg: 'rgba(201,168,76,0.08)',
  },
  {
    value: 'seller',
    icon: '🔑',
    label: 'Seller / Owner',
    desc: 'I want to list my property on Aureve.',
    color: '#1D9E75',
    bg: 'rgba(29,158,117,0.08)',
  },
  {
    value: 'agent',
    icon: '🤝',
    label: 'Agent',
    desc: 'I am a real estate agent managing client portfolios.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    value: 'builder',
    icon: '🏗',
    label: 'Builder',
    desc: 'I develop residential and commercial projects.',
    color: '#E07B39',
    bg: 'rgba(224,123,57,0.08)',
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [step,     setStep]     = useState<1|2|3>(1)
  const [role,     setRole]     = useState('buyer')
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)
  const [ready,    setReady]    = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  const selectedRole = ROLES.find(r => r.value === role) || ROLES[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, phone, role } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'var(--gold)', fontWeight: 300 }}>✓</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Welcome to Aureve</span>
          <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
        </div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          Account created,<br />{name.split(' ')[0]}.
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.8, marginBottom: '2rem' }}>
          Your {selectedRole.label.toLowerCase()} account is ready. Sign in to access your personal dashboard.
        </p>
        <Link href="/auth/login"
          style={{ display: 'inline-block', padding: '14px 40px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'all 0.3s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#C9A84C'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)'}>
          Sign in now →
        </Link>
      </div>
      <style>{`@keyframes scaleIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
    outline: 'none', background: '#fff', color: 'var(--charcoal)',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: '5rem' }}>

      {/* Back */}
      <Link href="/" style={{ position: 'fixed', top: '2rem', left: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s', zIndex: 10 }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold-dark)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
        ← Home
      </Link>

      <div style={{ width: '100%', maxWidth: step === 1 ? '700px' : '440px', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, color: 'var(--charcoal)', textDecoration: 'none', letterSpacing: '0.05em' }}>Aureve</Link>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '3rem' }}>
          {[1, 2].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${step >= s ? 'var(--gold)' : 'rgba(26,26,22,0.15)'}`, background: step > s ? 'var(--gold)' : step === s ? 'rgba(201,168,76,0.08)' : 'transparent', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                {step > s
                  ? <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>
                  : <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', color: step === s ? 'var(--gold)' : 'var(--text-muted)' }}>{s}</span>
                }
              </div>
              <div style={{ marginLeft: '8px', marginRight: i < 1 ? '0' : '0' }}>
                <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: step === s ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                  {s === 1 ? 'Choose role' : 'Your details'}
                </div>
              </div>
              {i < 1 && <div style={{ width: '60px', height: '1px', background: step > 1 ? 'var(--gold)' : 'rgba(26,26,22,0.1)', margin: '0 16px', transition: 'background 0.4s' }} />}
            </div>
          ))}
        </div>

        {/* ─── Step 1 — Role picker ─── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Step 1 of 2</span>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em' }}>I am a...</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
              {ROLES.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)}
                  style={{ padding: '1.5rem', textAlign: 'left', border: `1.5px solid ${role === r.value ? r.color : 'rgba(26,26,22,0.1)'}`, borderRadius: '4px', background: role === r.value ? r.bg : '#fff', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: role === r.value ? `0 8px 24px ${r.color}15` : '0 2px 8px rgba(26,26,22,0.04)', transform: role === r.value ? 'translateY(-2px)' : 'translateY(0)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{r.icon}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '5px', fontWeight: 400 }}>{r.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.6 }}>{r.desc}</div>
                  {role === r.value && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '16px', height: '1px', background: r.color }} />
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: r.color, fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)}
              style={{ width: '100%', padding: '15px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#C9A84C'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)'}>
              Continue as {selectedRole.label} →
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Already have an account? <Link href="/auth/login" style={{ color: 'var(--gold-dark)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        )}

        {/* ─── Step 2 — Details ─── */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Step 2 of 2</span>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em', marginBottom: '8px' }}>Your details</h2>

              {/* Role badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: selectedRole.bg, border: `1px solid ${selectedRole.color}25`, padding: '6px 14px', borderRadius: '2px' }}>
                <span>{selectedRole.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: selectedRole.color, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Signing up as {selectedRole.label}</span>
                <button onClick={() => setStep(1)} style={{ fontSize: '10px', color: selectedRole.color, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: 0.6 }}>Change</button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '2px', padding: '12px 16px', fontSize: '13px', color: '#dc2626', marginBottom: '1.25rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Full name *',      key: 'name',     type: 'text',     placeholder: 'Akshath Togari',        value: name,     set: setName },
                { label: 'Phone number *',   key: 'phone',    type: 'tel',      placeholder: '+91 98765 43210',       value: phone,    set: setPhone },
                { label: 'Email address *',  key: 'email',    type: 'email',    placeholder: 'your@email.com',        value: email,    set: setEmail },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '7px', fontFamily: 'DM Sans, sans-serif' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)} required
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = selectedRole.color; e.target.style.boxShadow = `0 0 0 3px ${selectedRole.color}12` }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(26,26,22,0.12)'; e.target.style.boxShadow = 'none' }} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '7px', fontFamily: 'DM Sans, sans-serif' }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required
                    style={{ ...inputBase, paddingRight: '44px' }}
                    onFocus={e => { e.target.style.borderColor = selectedRole.color; e.target.style.boxShadow = `0 0 0 3px ${selectedRole.color}12` }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(26,26,22,0.12)'; e.target.style.boxShadow = 'none' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                {password && (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '2px', borderRadius: '1px', background: password.length >= i * 2 ? (password.length >= 8 ? '#1D9E75' : '#F59E0B') : 'rgba(26,26,22,0.08)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{ marginTop: '8px', padding: '15px', background: loading ? 'rgba(26,26,22,0.08)' : selectedRole.color, color: loading ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s', boxShadow: loading ? 'none' : `0 8px 24px ${selectedRole.color}25` }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${selectedRole.color}40` } }}
                onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${selectedRole.color}25` } }}>
                {loading ? 'Creating account...' : `Create ${selectedRole.label} account →`}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.7 }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: 'var(--gold-dark)', textDecoration: 'none' }}>Terms</a> and{' '}
              <a href="#" style={{ color: 'var(--gold-dark)', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
