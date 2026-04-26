import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: saved } = await supabase
    .from('saved_properties')
    .select(`
      id, created_at,
      properties (id, title, slug, price, locality, city, bedrooms, carpet_area, thumbnail_url, rera_number, status)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
          My collection
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
          Saved Properties
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            {saved?.length || 0} properties saved
          </p>
        </div>
      </div>

      {!saved || saved.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(201,168,76,0.2)', marginBottom: '1rem' }}>❤</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: '8px' }}>
            No saved properties yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
            Browse listings and tap the heart icon to save properties you love
          </p>
          <Link href="/properties" style={{ background: 'var(--gold)', color: '#fff', padding: '11px 24px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            Browse properties →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {saved.map((s: any) => {
            const p = s.properties
            if (!p) return null
            return (
              <Link key={s.id} href={`/property/${p.slug}`} style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(26,26,22,0.08)', textDecoration: 'none',
                display: 'block', transition: 'all 0.3s ease',
              }}>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'} alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.6) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 500, color: '#fff' }}>
                    {formatPrice(p.price)}
                  </div>
                  {p.rera_number && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(29,158,117,0.9)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>RERA ✓</div>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: '4px' }}>{p.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>📍 {p.locality}, {p.city}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                    {p.bedrooms && <span>🛏 {p.bedrooms} BHK</span>}
                    {p.carpet_area && <span>📐 {p.carpet_area?.toLocaleString('en-IN')} sq.ft</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
