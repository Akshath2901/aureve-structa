import { createClient } from '@/lib/supabase/server'

export default async function AdminEnquiriesPage() {
  const supabase = await createClient()

  const { data: enquiries } = await supabase
    .from('property_enquiries')
    .select('id, name, phone, email, message, is_contacted, created_at, properties(title, locality)')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10B981', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Lead management</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>All Enquiries</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{enquiries?.length || 0} total enquiries received</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total enquiries', value: enquiries?.length || 0,                                   color: '#10B981' },
          { label: 'Contacted',       value: enquiries?.filter(e => e.is_contacted).length || 0,       color: '#3B82F6' },
          { label: 'Pending',         value: enquiries?.filter(e => !e.is_contacted).length || 0,      color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${s.color}60, transparent)` }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#10B981' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#fff' }}>Enquiry log</h3>
        </div>
        {!enquiries || enquiries.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>No enquiries yet</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Sans, sans-serif' }}>Enquiries from property pages will appear here in real time</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Enquirer', 'Phone', 'Property', 'Message', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e: any, i) => (
                <tr key={e.id} style={{ borderBottom: i < enquiries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#fff' }}>{e.name}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{e.phone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#fff', marginBottom: '2px', fontSize: '12px' }}>{e.properties?.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>📍 {e.properties?.locality}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.message || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, background: e.is_contacted ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: e.is_contacted ? '#10B981' : '#F59E0B', padding: '2px 8px', borderRadius: '3px' }}>
                      {e.is_contacted ? 'Contacted' : 'Pending'}
                    </span>
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
