import { ScrollReveal } from '@/components/shared/ScrollReveal'

const SUPPLIERS = [
  {
    name: 'Aparna RMC',
    specialty: 'Ready Mix Concrete',
    city: 'Hyderabad',
    rating: 4.8,
    reviews: 142,
    fleet: '350+ transit mixers',
    plants: '35 RMC plants',
    years: 30,
    badge: 'Top supplier',
    icon: '🏭',
  },
  {
    name: 'Sri Sai Steel Traders',
    specialty: 'TMT Steel & Wire Rod',
    city: 'Secunderabad',
    rating: 4.7,
    reviews: 98,
    fleet: 'Direct mill supply',
    plants: 'Pan-Hyderabad delivery',
    years: 18,
    badge: 'Verified',
    icon: '⚙️',
  },
  {
    name: 'Hyderabad Cement Hub',
    specialty: 'All grades cement',
    city: 'Hyderabad',
    rating: 4.6,
    reviews: 211,
    fleet: '80+ delivery vehicles',
    plants: '12 warehouse locations',
    years: 22,
    badge: 'Verified',
    icon: '🏗️',
  },
  {
    name: 'Lakshmi Sand & Aggregate',
    specialty: 'M-Sand, River Sand, Aggregate',
    city: 'Hyderabad',
    rating: 4.5,
    reviews: 67,
    fleet: '40+ tipper lorries',
    plants: 'Direct quarry supply',
    years: 12,
    badge: 'New',
    icon: '🪨',
  },
]

const CLIENTS = ['GHMC', 'L&T', 'Prestige', 'Rajapushpa', 'My Home', 'NSL', 'Shapoorji', 'Aparna']

export function SuppliersSection() {
  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', padding: '5px 12px', borderRadius: '4px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803d', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Verified network
                </span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--slate)' }}>
                Top suppliers in<br />
                <span style={{ color: 'var(--amber)' }}>Hyderabad</span>
              </h2>
            </div>
            <a href="/suppliers" className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 20px' }}>
              All suppliers →
            </a>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {SUPPLIERS.map((s, i) => (
            <ScrollReveal key={s.name} delay={i * 80}>
              <div className="card card-lift hover-amber" style={{ padding: '1.75rem', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: 'var(--concrete)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  }}>
                    {s.icon}
                  </div>
                  <span className={`badge ${s.badge === 'Top supplier' ? 'badge-amber' : s.badge === 'New' ? 'badge-green' : 'badge-green'}`}>
                    {s.badge === 'Verified' ? '✓ ' : ''}{s.badge}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', color: 'var(--slate)', marginBottom: '4px' }}>
                  {s.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {s.specialty} · {s.city}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Fleet', val: s.fleet },
                    { label: 'Coverage', val: s.plants },
                  ].map((d) => (
                    <div key={d.label} style={{ background: 'var(--concrete)', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate)' }}>{d.val}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--amber)', fontSize: '14px' }}>{'★'.repeat(Math.floor(s.rating))}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate)' }}>{s.rating}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({s.reviews})</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.years}+ yrs</span>
                </div>

                <button className="btn btn-slate" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', fontSize: '12px', padding: '10px' }}>
                  Get quote →
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Client logos */}
        <ScrollReveal delay={200}>
          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--concrete)', borderRadius: '16px' }}>
            <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Trusted by leading builders & contractors
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {CLIENTS.map((c) => (
                <div key={c} style={{
                  padding: '8px 20px',
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.05em',
                }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
