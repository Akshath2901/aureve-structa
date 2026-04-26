'use client'

import Link from 'next/link'
import { StatCard } from './StatCard'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(0)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export function BuilderDashboard({ profile, projects }: { profile: any; projects: any[] }) {
  const color = '#E07B39'
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon="🏗" label="Active projects" value={projects.length || 1}   color={color}   bg="rgba(224,123,57,0.08)" href="/dashboard/projects" delay={0}   />
        <StatCard icon="◉" label="Total units"     value={180}                     color="#C9A84C" bg="rgba(201,168,76,0.08)"  delay={100} />
        <StatCard icon="✓" label="Units sold"       value={45}                      color="#1D9E75" bg="rgba(29,158,117,0.08)"  delay={200} />
        <StatCard icon="✉" label="Enquiries"        value={230}                     color="#534AB7" bg="rgba(83,74,183,0.08)"   delay={300} />
      </div>

      {/* Add project CTA */}
      <div style={{ background: 'var(--charcoal)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${color}, transparent)` }} />
        <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '8rem', fontWeight: 300, color: 'rgba(224,123,57,0.05)', lineHeight: 1, userSelect: 'none' }}>A</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '24px', height: '1px', background: color }} />
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: color, fontFamily: 'DM Sans, sans-serif' }}>List a new project</span>
          </div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: '#FAF8F3', marginBottom: '4px' }}>Reach qualified buyers on Aureve</h3>
          <p style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>Upload floor plans, photos, RERA docs and go live in minutes</p>
        </div>
        <Link href="/dashboard/projects/new"
          style={{ padding: '13px 28px', background: color, color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', flexShrink: 0, position: 'relative', zIndex: 1, transition: 'all 0.3s', boxShadow: `0 8px 24px ${color}30` }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${color}50` }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${color}30` }}>
          + Add project
        </Link>
      </div>

      {/* Projects table */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '16px', height: '1px', background: color }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>My projects</h3>
          </div>
          <Link href="/dashboard/projects" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>View all →</Link>
        </div>

        {projects.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 300, color: 'rgba(26,26,22,0.2)', marginBottom: '8px' }}>No projects yet</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>Add your first project to start receiving enquiries</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
                {['Project', 'Locality', 'Units', 'Sold', 'Enquiries', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(26,26,22,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{p.title}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: color }}>{formatPrice(p.price)}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{p.locality}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>—</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(26,26,22,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '40%', background: color, borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>—</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(29,158,117,0.1)', color: '#085041', padding: '3px 9px', borderRadius: '2px', letterSpacing: '0.08em' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
