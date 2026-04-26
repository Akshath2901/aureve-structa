import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('properties')
    .select('id,title,slug,price,locality,status,views_count,thumbnail_url,rera_number,bedrooms,is_active,created_at')
    .eq('builder_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Builder portfolio</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>My Projects</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{projects?.length || 0} projects listed</p>
          </div>
        </div>
        <Link href="/dashboard/projects/new" style={{
          background: '#E07B39', color: '#fff', padding: '11px 22px', borderRadius: '6px',
          fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          ✦ Add project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(224,123,57,0.2)', marginBottom: '1rem' }}>⊞</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: '8px' }}>No projects yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
            List your first project and start receiving qualified enquiries
          </p>
          <Link href="/dashboard/projects/new" style={{ background: '#E07B39', color: '#fff', padding: '11px 24px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            Add first project →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {projects.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.08)' }}>
              <div style={{ position: 'relative', height: '160px' }}>
                <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'} alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.6) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#fff', fontWeight: 500 }}>
                  {formatPrice(p.price)}
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, background: p.is_active ? 'rgba(29,158,117,0.9)' : 'rgba(26,26,22,0.7)', color: '#fff' }}>
                    {p.is_active ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--charcoal)', marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>📍 {p.locality}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {p.rera_number && <span style={{ fontSize: '10px', background: 'rgba(29,158,117,0.1)', color: '#1D9E75', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>RERA ✓</span>}
                  {p.bedrooms && <span style={{ fontSize: '10px', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-dark)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{p.bedrooms} BHK</span>}
                  <span style={{ fontSize: '10px', background: 'rgba(83,74,183,0.1)', color: '#534AB7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{p.views_count || 0} views</span>
                </div>
                <Link href={`/property/${p.slug}`} style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                  VIEW LISTING →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
