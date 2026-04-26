export default function EstimatesPage() {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Contractor portal</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>My Estimates</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Your saved cost estimates</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧮</div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', color: '#111927', marginBottom: '8px' }}>No estimates saved yet</h3>
        <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem' }}>
          Use the cost calculator and save your estimates here for future reference
        </p>
        <a href="/calculator" style={{ display: 'inline-block', padding: '11px 24px', background: '#E07B39', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          Open calculator →
        </a>
      </div>
    </div>
  )
}
