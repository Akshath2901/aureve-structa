'use client'

import Link from 'next/link'
import { StatCard } from './StatCard'

const PIPELINE = [
  { client: 'Ramesh Kumar', property: 'Green Vista 3BHK',    stage: 'Site visit',  value: '₹1.25 Cr', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  { client: 'Priya Sharma', property: 'Aurum Towers 2BHK',   stage: 'Negotiating', value: '₹98 Lac',  color: '#1D9E75', bg: 'rgba(29,158,117,0.1)'  },
  { client: 'Suresh Reddy', property: 'Kokapet Plot 200yd',  stage: 'Enquired',    value: '₹75 Lac',  color: '#534AB7', bg: 'rgba(83,74,183,0.1)'   },
  { client: 'Anita Desai',  property: 'Elara Heights Villa', stage: 'Closed ✓',   value: '₹2.1 Cr',  color: '#4A4A45', bg: 'rgba(74,74,69,0.1)'    },
]

export function AgentDashboard({ profile }: { profile: any }) {
  const color = '#F59E0B'
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon="👥" label="Active clients"     value={4}  color={color}    bg="rgba(245,158,11,0.08)" href="/dashboard/clients" delay={0}   />
        <StatCard icon="🏠" label="Active listings"    value={3}  color="#1D9E75"  bg="rgba(29,158,117,0.08)" href="/dashboard/listings"delay={100} />
        <StatCard icon="📅" label="Visits this week"   value={2}  color="#534AB7"  bg="rgba(83,74,183,0.08)"  href="/dashboard/visits" delay={200} />
        <StatCard icon="₹" label="Commission MTD"      value={0}  color="#C9A84C"  bg="rgba(201,168,76,0.08)" prefix="₹" delay={300} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Pipeline */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '16px', height: '1px', background: color }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>Lead pipeline</h3>
            </div>
            <Link href="/dashboard/clients" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>View all →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
                {['Client', 'Property', 'Stage', 'Value'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,26,22,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--charcoal)' }}>{p.client}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{p.property}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', background: p.bg, color: p.color, padding: '3px 9px', borderRadius: '2px' }}>{p.stage}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--charcoal)', fontWeight: 400 }}>{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: '👥', label: 'My clients',  href: '/dashboard/clients', desc: '4 active buyers' },
            { icon: '📅', label: 'Site visits', href: '/dashboard/visits',  desc: '2 this week' },
            { icon: '⊞', label: 'Listings',    href: '/dashboard/listings',desc: '3 active' },
            { icon: '🏠', label: 'Browse',      href: '/properties',        desc: 'Find properties' },
          ].map(q => (
            <Link key={q.label} href={q.href}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color + '40'; el.style.transform = 'translateX(4px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.07)'; el.style.transform = 'translateX(0)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '4px', background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{q.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{q.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{q.desc}</div>
              </div>
              <span style={{ color: color, fontSize: '14px' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
