import { ScrollReveal } from '@/components/shared/ScrollReveal'

const REASONS = [
  { icon: '📊', title: 'Live price tracking',      desc: 'Prices updated daily from verified Hyderabad market sources. No stale data, no guesswork.' },
  { icon: '✓',  title: 'Verified suppliers only',  desc: 'Every supplier is GST-registered, physically verified, and rated by real buyers on our platform.' },
  { icon: '🧮', title: 'Instant cost estimation',  desc: 'Get a material-by-material cost breakdown in seconds using today\'s live prices.' },
  { icon: '🚛', title: 'Fleet visibility',          desc: 'See available transit mixers, tipper lorries and boom pumps near your site in real time.' },
  { icon: '🔔', title: 'Price drop alerts',         desc: 'Set your target price and we\'ll notify you the moment cement or steel hits that level.' },
  { icon: '🤝', title: 'Direct supplier connect',  desc: 'No middlemen. Call, WhatsApp, or email suppliers directly from Structa — zero commission.' },
]

export function WhyStructa() {
  return (
    <section className="section" style={{ background: 'var(--concrete)' }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.08)', border: '1px solid var(--border-amber)', padding: '6px 16px', borderRadius: '4px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Why Structa
              </span>
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--slate)', marginBottom: '1rem' }}>
              Built for builders,<br />
              <span style={{ color: 'var(--amber)', fontWeight: 300 }}>not browsers</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
              Every feature on Structa was designed around one question:
              what does a serious Hyderabad builder actually need?
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {REASONS.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 70}>
              <div className="hover-amber" style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.75rem',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'rgba(224,123,57,0.1)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', marginBottom: '1rem',
                }}>
                  {r.icon}
                </div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', color: 'var(--slate)', marginBottom: '8px' }}>
                  {r.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {r.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
