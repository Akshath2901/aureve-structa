'use client'

import Link from 'next/link'

export function ContractorDashboard({ profile, materials }: { profile: any, materials: any[] }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  const stats = [
    { icon: '🧮', label: 'Saved estimates',  value: '0', color: '#E07B39', bg: 'rgba(224,123,57,0.08)', href: '/dashboard/estimates' },
    { icon: '❤', label: 'Saved materials',   value: '0', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', href: '/dashboard/saved' },
    { icon: '🏭', label: 'Saved suppliers',  value: '0', color: '#1E2A3A', bg: 'rgba(30,42,58,0.08)',   href: '/dashboard/suppliers' },
    { icon: '🔔', label: 'Active alerts',    value: '0', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)', href: '/dashboard/alerts' },
  ]

  const quickActions = [
    { icon: '🧮', label: 'Cost calculator',   href: '/calculator',       desc: 'Estimate your build cost' },
    { icon: '▲',  label: 'Live prices',        href: '/materials',        desc: 'Check today\'s rates' },
    { icon: '🏭', label: 'Find suppliers',     href: '/suppliers',        desc: 'Verified Hyderabad suppliers' },
    { icon: '🏠', label: 'Buy property',       href: 'http://localhost:3000', desc: 'Browse on Aureve' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>
          {greeting}
        </p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          {firstName}'s Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>
            Track material prices, estimates and suppliers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} style={{
            background: '#fff', border: '1px solid rgba(17,25,39,0.08)',
            borderRadius: '14px', padding: '1.5rem', display: 'block',
            textDecoration: 'none', position: 'relative', overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(17,25,39,0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(17,25,39,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(17,25,39,0.04)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 14px 0 50px' }} />
            <div style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 600, color: s.color, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Live prices */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(17,25,39,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', animation: 'pulse 2s infinite' }} />
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Live prices today</h3>
            </div>
            <Link href="/materials" style={{ fontSize: '11px', color: '#E07B39', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>VIEW ALL →</Link>
          </div>
          <div style={{ padding: '0.75rem' }}>
            {materials.map((m, i) => {
              const price = m.material_prices?.[0]
              const up = price?.price_change_pct > 0
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: i % 2 === 0 ? 'var(--concrete)' : '#fff', borderRadius: '8px', marginBottom: '4px' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#111927', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1px' }}>{m.name}</p>
                    <p style={{ fontSize: '10px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>{m.category}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#111927', fontSize: '14px', marginBottom: '1px' }}>
                      ₹{price?.price || '—'}<span style={{ fontSize: '10px', fontWeight: 400, color: '#8A96A8' }}>/{m.unit}</span>
                    </p>
                    {price?.price_change_pct !== 0 && (
                      <p style={{ fontSize: '10px', fontWeight: 600, color: up ? '#dc2626' : '#1D9E75', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {up ? '▲' : '▼'} {Math.abs(price?.price_change_pct)}%
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', padding: '1.5rem', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '16px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Quick actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickActions.map(a => (
              <Link key={a.label} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                border: '1px solid rgba(17,25,39,0.06)',
                background: 'var(--concrete)', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,57,0.3)'; e.currentTarget.style.background = 'rgba(224,123,57,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(17,25,39,0.06)'; e.currentTarget.style.background = 'var(--concrete)' }}>
                <div style={{ width: '34px', height: '34px', background: 'rgba(224,123,57,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111927', fontFamily: 'Space Grotesk, sans-serif' }}>{a.label}</div>
                  <div style={{ fontSize: '11px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>{a.desc}</div>
                </div>
                <span style={{ color: '#E07B39', fontSize: '14px' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Start estimate banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)',
        borderRadius: '16px', padding: '1.75rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
        border: '1px solid rgba(224,123,57,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #E07B39, transparent)' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>
              Cost estimator
            </span>
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            How much will your project cost?
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(247,247,246,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Get an instant breakdown using today's live Hyderabad material prices
          </p>
        </div>
        <Link href="/calculator" style={{
          background: '#E07B39', color: '#fff', padding: '12px 24px', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
          fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em',
        }}>
          🧮 Open calculator →
        </Link>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
