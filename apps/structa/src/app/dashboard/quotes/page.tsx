export default function QuotesPage() {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Supplier portal</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>Quote Requests</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Contractor quote requests for your materials</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✉</div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', color: '#111927', marginBottom: '8px' }}>No quote requests yet</h3>
        <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
          Keep your prices updated and complete your profile to start receiving quote requests from contractors
        </p>
        <a href="/dashboard/prices" style={{ display: 'inline-block', padding: '11px 24px', background: '#F59E0B', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          Update prices →
        </a>
      </div>
    </div>
  )
}
