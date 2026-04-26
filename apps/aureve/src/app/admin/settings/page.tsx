export default function AdminSettingsPage() {
  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F59E0B', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Configuration</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Platform configuration and integrations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {[
          { title: 'Razorpay', desc: 'Payment gateway for builder subscriptions', status: 'Not configured', color: '#3B82F6', icon: '💳' },
          { title: 'Twilio WhatsApp', desc: 'WhatsApp Business API for user notifications', status: 'Not configured', color: '#10B981', icon: '💬' },
          { title: 'Resend Email', desc: 'Transactional email for alerts and welcome emails', status: 'Not configured', color: '#8B5CF6', icon: '✉' },
          { title: 'Google Maps', desc: 'Property location maps and locality heatmaps', status: 'Not configured', color: '#F59E0B', icon: '🗺️' },
          { title: 'Cloudinary', desc: 'Image upload and optimization for properties', status: 'Not configured', color: '#E07B39', icon: '🖼️' },
          { title: 'Vercel Analytics', desc: 'Performance monitoring and error tracking', status: 'Not configured', color: '#EF4444', icon: '📊' },
        ].map(s => (
          <div key={s.title} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${s.color}40, transparent)` }} />
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{s.title}</h4>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                    {s.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, marginBottom: '12px' }}>{s.desc}</p>
                <button style={{ padding: '7px 16px', borderRadius: '6px', border: `1px solid ${s.color}40`, background: 'transparent', color: s.color, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Configure →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
