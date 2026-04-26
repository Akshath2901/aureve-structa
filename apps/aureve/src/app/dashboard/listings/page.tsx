import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export default async function ListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: listings } = await supabase
    .from('properties')
    .select('id,title,slug,price,locality,status,views_count,thumbnail_url,is_active,created_at')
    .eq('builder_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>My portfolio</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>My Listings</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{listings?.length || 0} listings</p>
          </div>
        </div>
        <Link href="/dashboard/listings/new" style={{
          background: 'var(--gold)', color: '#fff', padding: '11px 22px', borderRadius: '6px',
          fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          ✦ Add listing
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(201,168,76,0.2)', marginBottom: '1rem' }}>⊞</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: '8px' }}>No listings yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>Add your first property listing to reach thousands of buyers</p>
          <Link href="/dashboard/listings/new" style={{ background: 'var(--gold)', color: '#fff', padding: '11px 24px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            Add your first listing →
          </Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
              <tr>
                {['Property', 'Locality', 'Price', 'Views', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listings.map((l: any, i: number) => (
                <tr key={l.id} style={{ borderBottom: i < listings.length - 1 ? '1px solid rgba(26,26,22,0.04)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={l.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=60'} alt={l.title}
                        style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{l.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{l.locality}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, color: 'var(--charcoal)', fontSize: '1rem' }}>{formatPrice(l.price)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{l.views_count || 0}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.05em',
                      background: l.is_active ? 'rgba(29,158,117,0.1)' : 'rgba(239,68,68,0.1)',
                      color: l.is_active ? '#1D9E75' : '#dc2626',
                    }}>
                      {l.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/property/${l.slug}`} style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>VIEW →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
