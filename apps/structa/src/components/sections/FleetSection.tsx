'use client'

import { ScrollReveal } from '@/components/shared/ScrollReveal'

const FLEET = [
  {
    icon: '🚛',
    name: 'Transit Mixer',
    desc: 'Ready-mix concrete delivery in 6–8 cubic metre capacity mixers. On-site delivery within 4 hours of order.',
    capacity: '6–8 m³',
    available: 24,
    color: 'rgba(224,123,57,0.1)',
    border: 'rgba(224,123,57,0.2)',
  },
  {
    icon: '🏗️',
    name: 'Boom Pump',
    desc: 'High-reach concrete pumping for multi-storey buildings. Reach up to 42 metres with remote-controlled arm.',
    capacity: 'Up to 42m',
    available: 5,
    color: 'rgba(30,42,58,0.06)',
    border: 'rgba(30,42,58,0.12)',
  },
  {
    icon: '🚚',
    name: 'Tipper Lorry',
    desc: 'Bulk material delivery — sand, aggregate, and bricks. Full-load delivery across Hyderabad in 24 hours.',
    capacity: '10–15 tonnes',
    available: 80,
    color: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.15)',
  },
  {
    icon: '🏭',
    name: 'Batching Plant',
    desc: '35 RMC batching plants across Hyderabad. Consistent quality concrete with lab-tested mix designs.',
    capacity: '35 plants',
    available: 35,
    color: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.15)',
  },
  {
    icon: '🚜',
    name: 'JCB / Excavator',
    desc: 'Site preparation, excavation, and material handling. Hourly and daily rental available across the city.',
    capacity: '0.9m³ bucket',
    available: 30,
    color: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.2)',
  },
  {
    icon: '🛻',
    name: 'Pickup Delivery',
    desc: 'Small quantity delivery of cement, bricks, and hardware. Perfect for individual homebuilders.',
    capacity: '1–2 tonnes',
    available: 120,
    color: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.15)',
  },
]

export function FleetSection() {
  return (
    <section className="section" style={{ background: 'var(--slate)', position: 'relative', overflow: 'hidden' }}>

      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(224,123,57,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224,123,57,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Animated truck */}
      <div style={{ position: 'absolute', top: '20px', overflow: 'hidden', width: '100%', height: '60px', opacity: 0.15 }}>
        <div className="truck-animate" style={{ display: 'inline-block', fontSize: '2.5rem', whiteSpace: 'nowrap' }}>
          🚛 ─────────────────────────────────────────────────────────────
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.1)', border: '1px solid rgba(224,123,57,0.2)', padding: '6px 16px', borderRadius: '4px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber-light)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Delivery fleet
              </span>
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', marginBottom: '1rem' }}>
              From our plant<br />
              <span style={{ color: 'var(--amber-light)', fontWeight: 300, fontStyle: 'italic' }}>to your site</span>
            </h2>
            <p style={{ color: 'rgba(247,247,246,0.5)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
              Our verified supplier network operates 350+ transit mixers, 5 boom pumps,
              and 35 RMC plants across Hyderabad — all bookable through Structa.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {FLEET.map((f, i) => (
            <ScrollReveal key={f.name} delay={i * 80}>
              <div className="card-lift" style={{
                background: f.color,
                border: `1px solid ${f.border}`,
                borderRadius: '12px',
                padding: '1.75rem',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff', marginBottom: '8px', fontSize: '1.1rem' }}>
                  {f.name}
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.55)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {f.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(247,247,246,0.35)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Capacity
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--amber-light)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {f.capacity}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(247,247,246,0.35)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Available
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {f.available}+ units
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={300}>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="/suppliers" className="btn btn-amber">
              Browse all suppliers & fleet →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
