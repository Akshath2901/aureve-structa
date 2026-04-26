import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AureveAdminPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: propCount },
    { count: enqCount },
    { data: recentProps },
    { data: localities },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('property_enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('title,slug,locality,price,is_featured,rera_number,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('locality_insights').select('locality,avg_price_per_sqft,price_trend_pct,growth_score').order('growth_score', { ascending: false }).limit(5),
  ])

  const formatPrice = (p: number) => {
    const r = p / 100
    if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
    if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
    return `₹${r.toLocaleString('en-IN')}`
  }

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Platform overview</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>Aureve Dashboard</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Real estate platform — Hyderabad</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total users',     value: userCount || 0, color: '#C9A84C', href: '/admin/users' },
          { label: 'Live listings',   value: propCount || 0, color: '#8B5CF6', href: '/admin/listings' },
          { label: 'All enquiries',   value: enqCount  || 0, color: '#10B981', href: '/admin/enquiries' },
          { label: 'Localities',      value: 12,             color: '#3B82F6', href: '/admin' },
        ].map(s => (
          <Link key={s.label} href={s.href} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${s.color}60, transparent)` }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent listings */}
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '1px', background: '#C9A84C' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#fff' }}>Recent listings</h3>
            </div>
            <Link href="/admin/listings" style={{ fontSize: '11px', color: '#C9A84C', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>ALL →</Link>
          </div>
          {recentProps?.map((p: any, i) => (
            <div key={p.slug} style={{ padding: '12px 16px', borderBottom: i < recentProps.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{p.title}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>📍 {p.locality}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#C9A84C', marginBottom: '2px' }}>{formatPrice(p.price)}</p>
                {p.rera_number && <span style={{ fontSize: '9px', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>RERA ✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Locality insights */}
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '1px', background: '#8B5CF6' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#fff' }}>Top localities by growth</h3>
          </div>
          {localities?.map((loc: any, i) => (
            <div key={loc.locality} style={{ padding: '12px 16px', borderBottom: i < localities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{loc.locality}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', fontFamily: 'DM Sans, sans-serif' }}>+{loc.price_trend_pct}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(to right, #8B5CF6, #C084FC)', width: `${loc.growth_score || 50}%` }} />
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>₹{loc.avg_price_per_sqft?.toLocaleString('en-IN')}/sqft</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
