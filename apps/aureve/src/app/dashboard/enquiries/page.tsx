import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function EnquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enquiries } = await supabase
    .from('property_enquiries')
    .select(`id, name, phone, message, created_at, is_contacted, site_visit_date, properties(title, slug, locality, thumbnail_url)`)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>My activity</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>My Enquiries</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{enquiries?.length || 0} enquiries sent</p>
        </div>
      </div>

      {!enquiries || enquiries.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(201,168,76,0.2)', marginBottom: '1rem' }}>✉</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: '8px' }}>No enquiries yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
            When you enquire about a property, it will appear here
          </p>
          <Link href="/properties" style={{ background: 'var(--gold)', color: '#fff', padding: '11px 24px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            Browse properties →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enquiries.map((e: any) => (
            <div key={e.id} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(26,26,22,0.08)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {e.properties?.thumbnail_url && (
                <img src={e.properties.thumbnail_url} alt={e.properties.title}
                  style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>
                    {e.properties?.title}
                  </h4>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px',
                    background: e.is_contacted ? 'rgba(29,158,117,0.1)' : 'rgba(201,168,76,0.1)',
                    color: e.is_contacted ? '#1D9E75' : '#866820',
                    fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em',
                  }}>
                    {e.is_contacted ? 'CONTACTED' : 'PENDING'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
                  📍 {e.properties?.locality}
                </p>
                {e.message && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>
                    "{e.message}"
                  </p>
                )}
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'DM Sans, sans-serif' }}>
                  Sent on {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {e.site_visit_date && ` · Site visit: ${new Date(e.site_visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                </p>
              </div>
              {e.properties?.slug && (
                <Link href={`/property/${e.properties.slug}`} style={{
                  fontSize: '11px', fontWeight: 600, color: 'var(--gold)',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                  letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif',
                }}>
                  VIEW →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
