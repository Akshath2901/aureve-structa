'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StructaSignupPage() {
  const router  = useRouter()
  const [step,        setStep]        = useState<1|2>(1)
  const [role,        setRole]        = useState<'contractor'|'supplier'>('contractor')
  const [name,        setName]        = useState('')
  const [company,     setCompany]     = useState('')
  const [phone,       setPhone]       = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [loading,     setLoading]     = useState(false)
  const [done,        setDone]        = useState(false)
  const [error,       setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          full_name:    name,
          phone,
          role,
          company_name: company,
          structa_user: 'true',
        }
      }
    })

    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--concrete)' }}>
      <div style={{ textAlign: 'center', maxWidth: '380px', padding: '2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(224,123,57,0.1)', border: '2px solid #E07B39', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem' }}>✓</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 600, color: '#111927', marginBottom: '8px' }}>Account created!</h2>
        <p style={{ fontSize: '14px', color: '#8A96A8', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
          Welcome to Structa, {name.split(' ')[0]}. Your {role} account is ready.
        </p>
        <Link href="/auth/login" style={{ display: 'inline-block', padding: '12px 28px', background: '#E07B39', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          Sign in now →
        </Link>
      </div>
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1px solid rgba(17,25,39,0.15)',
    fontSize: '14px', fontFamily: 'Inter, sans-serif',
    outline: 'none', background: '#fff', color: '#111927',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, color: '#475569',
    display: 'block', marginBottom: '6px',
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--concrete)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        <Link href="/" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: '#1E2A3A', display: 'block', marginBottom: '2.5rem', textDecoration: 'none' }}>
          Structa
        </Link>

        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 600, color: '#111927', marginBottom: '6px' }}>Create account</h2>
        <p style={{ fontSize: '14px', color: '#8A96A8', marginBottom: '2rem', fontFamily: 'Inter, sans-serif' }}>
          Already have one?{' '}
          <Link href="/auth/login" style={{ color: '#E07B39', fontWeight: 500 }}>Sign in</Link>
        </p>

        {/* Step 1 — role picker */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '12px', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              I am a...
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              {[
                {
                  value: 'contractor',
                  icon: '🏗️',
                  label: 'Contractor',
                  desc: 'Building a house or project. I need material prices, suppliers and cost estimates.',
                },
                {
                  value: 'supplier',
                  icon: '🏭',
                  label: 'Supplier',
                  desc: 'I sell cement, steel, sand or other materials. I want to list on Structa and get leads.',
                },
              ].map(r => (
                <button key={r.value} onClick={() => setRole(r.value as any)} style={{
                  padding: '1.25rem', borderRadius: '12px', textAlign: 'left',
                  border: '1.5px solid',
                  borderColor: role === r.value ? '#E07B39' : 'rgba(17,25,39,0.12)',
                  background: role === r.value ? 'rgba(224,123,57,0.05)' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{r.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111927', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>{r.label}</div>
                  <div style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{r.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{
              width: '100%', padding: '13px', background: '#E07B39', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em',
            }}>
              Continue as {role} →
            </button>
          </div>
        )}

        {/* Step 2 — details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ fontSize: '12px', color: '#8A96A8', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
              ← Change role
            </button>

            {/* Role badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(224,123,57,0.08)', border: '1px solid rgba(224,123,57,0.2)', padding: '6px 12px', borderRadius: '6px', width: 'fit-content' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {role === 'contractor' ? '🏗️' : '🏭'} Signing up as {role}
              </span>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', fontFamily: 'Inter, sans-serif' }}>
                {error}
              </div>
            )}

            <div>
              <label style={labelStyle}>Full name *</label>
              <input style={inputStyle} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            {role === 'supplier' && (
              <div>
                <label style={labelStyle}>Company name *</label>
                <input style={inputStyle} placeholder="e.g. Aparna RMC Pvt Ltd" value={company} onChange={e => setCompany(e.target.value)} required />
              </div>
            )}

            <div>
              <label style={labelStyle}>Phone *</label>
              <input style={inputStyle} placeholder="+91 98765 43210" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input style={inputStyle} type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(224,123,57,0.5)' : '#E07B39',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em',
              marginTop: '4px',
            }}>
              {loading ? 'Creating account...' : `Create ${role} account →`}
            </button>

            <p style={{ fontSize: '11px', color: '#8A96A8', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
              By signing up you agree to our Terms and Privacy Policy
            </p>
          </form>
        )}
      </div>

      <style>{`input:focus { border-color: #E07B39 !important; box-shadow: 0 0 0 3px rgba(224,123,57,0.1); }`}</style>
    </div>
  )
}
