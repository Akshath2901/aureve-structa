import { createClient } from '@/lib/supabase/server'

export default async function StructaProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('structa_profiles').select('*').eq('id', user?.id).single()

  const ROLE_META: Record<string, { color: string; label: string }> = {
    contractor: { color: '#E07B39', label: 'Contractor' },
    supplier:   { color: '#F59E0B', label: 'Supplier'   },
  }
  const meta = ROLE_META[profile?.role] || ROLE_META.contractor

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Account</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>My Profile</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: meta.color, borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Your account details on Structa</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Avatar card */}
        <div style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)', borderRadius: '14px', padding: '2rem', border: `1px solid ${meta.color}25`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${meta.color}, transparent)` }} />
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${meta.color}20`, border: `2px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: meta.color }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{profile?.full_name}</h3>
          {profile?.company_name && <p style={{ fontSize: '12px', color: 'rgba(247,247,246,0.5)', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>{profile.company_name}</p>}
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: `${meta.color}20`, color: meta.color, padding: '3px 10px', borderRadius: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
            {meta.label}
          </span>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.4)', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>Member since</p>
            <p style={{ fontSize: '13px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid rgba(17,25,39,0.08)', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '16px', height: '2px', background: meta.color, borderRadius: '1px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Account details</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Full name',     value: profile?.full_name   },
              { label: 'Email',         value: user?.email          },
              { label: 'Phone',         value: profile?.phone || '—'},
              { label: 'Company',       value: profile?.company_name || '—' },
              { label: 'City',          value: profile?.city || 'Hyderabad' },
              { label: 'GST number',    value: profile?.gst_number || '—' },
              { label: 'Verified',      value: profile?.is_verified ? 'Yes ✓' : 'Pending verification' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 14px', background: 'var(--concrete)', borderRadius: '8px', border: '1px solid rgba(17,25,39,0.04)' }}>
                <div style={{ width: '120px', flexShrink: 0 }}>
                  <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A96A8', fontFamily: 'Space Grotesk, sans-serif' }}>{f.label}</p>
                </div>
                <p style={{ fontSize: '14px', color: '#111927', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{f.value}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(224,123,57,0.05)', borderRadius: '8px', border: '1px solid rgba(224,123,57,0.15)' }}>
            <p style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>
              💡 Profile editing coming soon. Contact <strong style={{ color: '#E07B39' }}>hello@structa.in</strong> to update details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
