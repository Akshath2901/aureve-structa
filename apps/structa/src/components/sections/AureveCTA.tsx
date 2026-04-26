import { ScrollReveal } from '@/components/shared/ScrollReveal'

export function AureveCTA() {
  return (
    <section style={{
      padding: '7rem 0',
      background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.05,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(224,123,57,0.5), transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(224,123,57,0.3), transparent)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.1)', border: '1px solid rgba(224,123,57,0.2)', padding: '6px 14px', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber-light)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Sister platform
                </span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', marginBottom: '1.25rem', lineHeight: 1.1 }}>
                Looking for a<br />
                property to buy?
              </h2>
              <p style={{ color: 'rgba(247,247,246,0.5)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
                Aureve is Hyderabad's premium real estate platform — RERA-verified listings,
                AI-powered search, and live market insights.
                Your Structa account works on Aureve too.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="http://localhost:3000" className="btn btn-amber">
                  🏠 Explore Aureve →
                </a>
                <a href="http://localhost:3000/properties" className="btn btn-outline-white">
                  Browse properties
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '✓', text: '2,400+ RERA-verified listings across Hyderabad' },
                { icon: '🤖', text: 'AI-powered search — describe your dream home in plain language' },
                { icon: '📊', text: 'Live price trends and locality growth scores' },
                { icon: '🔗', text: 'Your Structa build cost estimate links directly to matching plots' },
                { icon: '₹0', text: 'Zero brokerage on direct builder connections' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    background: 'rgba(224,123,57,0.15)',
                    borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', color: 'var(--amber-light)', fontWeight: 700,
                  }}>
                    {f.icon}
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.6)', lineHeight: 1.6, margin: 0 }}>
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
