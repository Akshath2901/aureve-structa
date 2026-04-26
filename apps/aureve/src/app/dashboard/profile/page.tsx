import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  const ROLE_META: Record<string, { color: string; label: string }> = {
    buyer:   { color: '#C9A84C', label: 'Buyer'   },
    seller:  { color: '#1D9E75', label: 'Seller'  },
    agent:   { color: '#C9A84C', label: 'Agent'   },
    builder: { color: '#E07B39', label: 'Builder' },
    admin:   { color: '#ef4444', label: 'Admin'   },
  }
  const meta = ROLE_META[profile?.role] || ROLE_META.buyer

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Account</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>My Profile</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Manage your account details</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
        {/* Avatar card */}
        <div style={{ background: 'linear-gradient(135deg, #1A1A16 0%, #2C2C28 100%)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(201,168,76,0.15)', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)', borderRadius: '16px' }} />
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
            background: `${meta.color}20`,
            border: `2px solid ${meta.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 500, color: meta.color,
          }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#FAF8F3', marginBottom: '6px' }}>
            {profile?.full_name}
          </h3>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: `${meta.color}20`, color: meta.color, padding: '3px 10px', borderRadius: '4px', fontFamily: 'DM Sans, sans-serif' }}>
            {meta.label}
          </span>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>Member since</p>
            <p style={{ fontSize: '13px', color: '#FAF8F3', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Account details</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Full name',  value: profile?.full_name, icon: '◉' },
              { label: 'Email',      value: user?.email,        icon: '✉' },
              { label: 'Phone',      value: profile?.phone || '—', icon: '◎' },
              { label: 'City',       value: profile?.city || 'Hyderabad', icon: '◈' },
              { label: 'Account ID', value: user?.id?.slice(0, 16) + '...', icon: '⬡' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', background: 'var(--cream)', borderRadius: '10px', border: '1px solid rgba(26,26,22,0.05)' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(201,168,76,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--gold)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px', fontFamily: 'DM Sans, sans-serif' }}>{f.label}</p>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(83,74,183,0.05)', borderRadius: '10px', border: '1px solid rgba(83,74,183,0.1)' }}>
            <p style={{ fontSize: '12px', color: '#534AB7', fontFamily: 'DM Sans, sans-serif' }}>
              💡 Profile editing coming soon. Contact <strong>hello@aureve.in</strong> to update your details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
