import { createClient } from '@/lib/supabase/server'

export default async function AdminAuditPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, admin:admin_id(email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EF4444', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Security</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>Audit Log</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Every admin action is recorded. Visible to Super Admin only.</p>
      </div>

      <div style={{ background: '#161616', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#EF4444' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#fff' }}>Action log</h3>
          <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
            SUPER ADMIN ONLY
          </span>
        </div>

        {!logs || logs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }}>📋</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>No admin actions recorded yet</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Sans, sans-serif' }}>All admin actions will be automatically logged here</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Admin', 'Action', 'Entity', 'Description', 'IP', 'Time'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any, i) => (
                <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>{log.admin?.email || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{log.entity_type}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{log.description || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '11px' }}>{log.ip_address || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(log.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
