export default function AnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Insights</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>Analytics</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Performance overview for your listings</p>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1A1A16 0%, #2C2C28 100%)', borderRadius: '16px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(201,168,76,0.3)', marginBottom: '1rem' }}>▲</div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#FAF8F3', marginBottom: '8px' }}>Analytics coming soon</h3>
        <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.45)', fontFamily: 'DM Sans, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
          Full analytics dashboard with views, enquiry trends, locality performance and more — launching with Phase 4.
        </p>
      </div>
    </div>
  )
}
