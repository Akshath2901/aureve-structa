'use client'

import Link from 'next/link'

export function SupplierDashboard({ profile }: { profile: any }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  const stats = [
    { icon: '👁', label: 'Profile views',    value: '0', color: '#E07B39', bg: 'rgba(224,123,57,0.08)' },
    { icon: '✉', label: 'Quote requests',   value: '0', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { icon: '⊞', label: 'Active listings',  value: '0', color: '#1E2A3A', bg: 'rgba(30,42,58,0.08)'   },
    { icon: '★', label: 'Rating',           value: '—', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)' },
  ]

  const MATERIALS = [
    { name: 'Cement 53G',  price: 370, unit: 'bag', change: -2.1 },
    { name: 'TMT Steel',   price: 67,  unit: 'kg',  change:  1.8 },
    { name: 'M-Sand',      price: 52,  unit: 'cft', change:  3.2 },
    { name: 'Red Bricks',  price: 9,   unit: 'pc',  change:  0   },
    { name: 'Aggregate',   price: 44,  unit: 'cft', change: -0.5 },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>
          {greeting} · Supplier portal
        </p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          {profile?.company_name || firstName}'s Portal
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>
            Manage your listings, prices and quote requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(17,25,39,0.08)', borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 14px 0 50px' }} />
            <div style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 600, color: s.color, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Update prices CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)', borderRadius: '14px', padding: '1.75rem', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,25,39,0.08)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #F59E0B, transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: '16px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B', fontFamily: 'Space Grotesk, sans-serif' }}>Daily task</span>
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
            Update your prices
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(247,247,246,0.5)', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Keep your prices current so contractors see accurate rates and contact you for quotes.
          </p>
          <Link href="/dashboard/prices" style={{ background: '#F59E0B', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', display: 'inline-block' }}>
            ▲ Update prices →
          </Link>
        </div>

        {/* Market prices reference */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(17,25,39,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', animation: 'pulse 2s infinite' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Market rates today</h3>
          </div>
          <div style={{ padding: '0.75rem' }}>
            {MATERIALS.map((m, i) => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: i % 2 === 0 ? 'var(--concrete)' : '#fff', borderRadius: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#111927', fontFamily: 'Space Grotesk, sans-serif' }}>{m.name}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#111927', fontSize: '13px' }}>
                    ₹{m.price}<span style={{ fontSize: '10px', fontWeight: 400, color: '#8A96A8' }}>/{m.unit}</span>
                  </span>
                  {m.change !== 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: m.change > 0 ? '#dc2626' : '#1D9E75', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {m.change > 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote requests */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', padding: '1.75rem', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Recent quote requests</h3>
          </div>
          <Link href="/dashboard/quotes" style={{ fontSize: '11px', color: '#E07B39', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>VIEW ALL →</Link>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉</div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', color: 'rgba(17,25,39,0.3)', marginBottom: '6px' }}>No quote requests yet</p>
          <p style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>
            Complete your profile and update prices to start receiving contractor enquiries
          </p>
          <Link href="/dashboard/prices" style={{ fontSize: '12px', color: '#E07B39', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', border: '1px solid rgba(224,123,57,0.3)', padding: '8px 18px', borderRadius: '6px' }}>
            Update your prices →
          </Link>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
