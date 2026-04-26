import { createClient } from '@/lib/supabase/server'

const ROLE_COLORS: Record<string, string> = {
  buyer: '#8B5CF6', seller: '#10B981', agent: '#F59E0B', builder: '#E07B39', admin: '#EF4444',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, role, phone, city, is_verified, created_at')
    .order('created_at', { ascending: false })

  const roleCount: Record<string, number> = {}
  users?.forEach(u => { roleCount[u.role] = (roleCount[u.role] || 0) + 1 })

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B5CF6', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>User management</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>All Users</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{users?.length || 0} total users across Aureve</p>
      </div>

      {/* Role breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {['buyer','seller','agent','builder','admin'].map(role => (
          <div key={role} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${ROLE_COLORS[role]}60, transparent)` }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: ROLE_COLORS[role], lineHeight: 1, marginBottom: '4px' }}>
              {roleCount[role] || 0}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>{role}s</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#8B5CF6' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#fff' }}>User directory</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['User', 'Role', 'Phone', 'City', 'Joined', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${ROLE_COLORS[u.role] || '#666'}20`, border: `1px solid ${ROLE_COLORS[u.role] || '#666'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: ROLE_COLORS[u.role] || '#666', flexShrink: 0 }}>
                      {u.full_name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500, color: '#fff' }}>{u.full_name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: `${ROLE_COLORS[u.role]}20`, color: ROLE_COLORS[u.role], padding: '2px 8px', borderRadius: '3px' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>{u.phone || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>{u.city || 'Hyderabad'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, background: u.is_verified ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: u.is_verified ? '#10B981' : '#F59E0B', padding: '2px 8px', borderRadius: '3px' }}>
                    {u.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
