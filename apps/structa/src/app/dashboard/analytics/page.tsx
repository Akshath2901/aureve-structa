export default function SupplierAnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Supplier portal</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>Analytics</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Profile views, quote conversion and price performance</p>
        </div>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)', borderRadius: '14px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Analytics coming soon</h3>
        <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.45)', fontFamily: 'Inter, sans-serif', maxWidth: '380px', margin: '0 auto' }}>
          Profile views, quote request trends and price performance charts — launching with Phase 5.
        </p>
      </div>
    </div>
  )
}
