import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export default async function AdminListingsPage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('properties')
    .select('id,title,slug,price,locality,property_type,listing_type,status,is_active,is_featured,rera_number,views_count,created_at')
    .order('created_at', { ascending: false })

  const active    = listings?.filter(l => l.is_active).length || 0
  const featured  = listings?.filter(l => l.is_featured).length || 0
  const withRera  = listings?.filter(l => l.rera_number).length || 0

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Platform management</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>All Listings</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{listings?.length || 0} total properties on Aureve</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total listings', value: listings?.length || 0, color: '#C9A84C' },
          { label: 'Active',         value: active,                color: '#10B981' },
          { label: 'Featured',       value: featured,              color: '#8B5CF6' },
          { label: 'RERA verified',  value: withRera,              color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${s.color}60, transparent)` }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#C9A84C' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#fff' }}>Property listings</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Property', 'Locality', 'Price', 'Type', 'Views', 'RERA', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings?.map((l, i) => (
              <tr key={l.id} style={{ borderBottom: i < listings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{l.title}</div>
                  {l.is_featured && <span style={{ fontSize: '9px', background: 'rgba(201,168,76,0.2)', color: '#C9A84C', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>FEATURED</span>}
                </td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{l.locality}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Cormorant Garamond, serif', color: '#C9A84C', fontSize: '1rem' }}>{formatPrice(l.price)}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{l.listing_type}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{l.views_count || 0}</td>
                <td style={{ padding: '12px 16px' }}>
                  {l.rera_number
                    ? <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>✓ {l.rera_number}</span>
                    : <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>—</span>
                  }
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, background: l.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: l.is_active ? '#10B981' : '#EF4444', padding: '2px 8px', borderRadius: '3px' }}>
                    {l.is_active ? 'LIVE' : 'OFFLINE'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/property/${l.slug}`} target="_blank" style={{ fontSize: '11px', color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>VIEW →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
