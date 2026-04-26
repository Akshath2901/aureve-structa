import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatPrice(p: number) {
  const r = p / 100
  if (r >= 10000000) return `₹${(r/10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r/100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export default async function AdminBuildersPage() {
  const supabase = await createClient()

  const { data: builders } = await supabase
    .from('profiles')
    .select('id, full_name, phone, city, is_verified, created_at')
    .eq('role', 'builder')
    .order('created_at', { ascending: false })

  const { data: properties } = await supabase
    .from('properties')
    .select('builder_id, id, title, price, locality, status, views_count')

  const builderStats = builders?.map(b => ({
    ...b,
    listings:  properties?.filter(p => p.builder_id === b.id).length || 0,
    totalViews:properties?.filter(p => p.builder_id === b.id).reduce((a, p) => a + (p.views_count || 0), 0) || 0,
  }))

  return (
    <div style={{ padding: '2.5rem', background: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>
            Platform management
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
            Builder Management
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
              {builders?.length || 0} builders on Aureve
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total builders',   value: builders?.length || 0,                                       color: 'var(--charcoal)' },
          { label: 'Verified',         value: builders?.filter(b => b.is_verified).length || 0,            color: '#1D9E75' },
          { label: 'Total listings',   value: properties?.length || 0,                                     color: 'var(--gold-dark)' },
          { label: 'Paying (target)',  value: 0,                                                           color: '#534AB7' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Builders table */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>All builders</h3>
        </div>
        {!builderStats || builderStats.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(26,26,22,0.2)', marginBottom: '6px' }}>No builders yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Builders who sign up will appear here</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
              <tr>
                {['Builder', 'Phone', 'City', 'Listings', 'Total views', 'Joined', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {builderStats?.map((b: any, i) => (
                <tr key={b.id} style={{ borderTop: '1px solid rgba(26,26,22,0.04)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--gold-dark)', flexShrink: 0 }}>
                        {b.full_name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{b.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{b.phone || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{b.city || 'Hyderabad'}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{b.listings}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{b.totalViews}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, background: b.is_verified ? 'rgba(29,158,117,0.1)' : 'rgba(201,168,76,0.1)', color: b.is_verified ? '#085041' : '#866820', padding: '2px 8px', borderRadius: '3px' }}>
                      {b.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid rgba(29,158,117,0.2)', background: 'transparent', color: '#085041', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                        Verify
                      </button>
                      <button style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid rgba(201,168,76,0.2)', background: 'transparent', color: 'var(--gold-dark)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                        Message
                      </button>
                    </div>
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
