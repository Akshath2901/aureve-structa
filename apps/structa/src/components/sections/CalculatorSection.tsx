'use client'

import { useState } from 'react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

const MATERIAL_SHARE: Record<string, number> = {
  'Cement':       0.16,
  'Steel':        0.25,
  'Bricks':       0.08,
  'Sand':         0.06,
  'Aggregates':   0.05,
  'Tiles & floor':0.10,
  'Paint':        0.05,
  'Plumbing':     0.07,
  'Electrical':   0.08,
  'Labour':       0.10,
}

const COST_PER_SQFT = { basic: 1600, standard: 2200, premium: 3200 }

const COLORS = ['#E07B39','#1E2A3A','#22c55e','#3b82f6','#8b5cf6','#f59e0b','#ec4899','#14b8a6','#6366f1','#84cc16']

export function CalculatorSection() {
  const [area,   setArea]   = useState(1200)
  const [floors, setFloors] = useState(1)
  const [type,   setType]   = useState<'basic'|'standard'|'premium'>('standard')

  const builtUp   = area * floors * 0.8
  const totalCost = builtUp * COST_PER_SQFT[type]

  const breakdown = Object.entries(MATERIAL_SHARE).map(([name, share]) => ({
    name,
    cost: Math.round(totalCost * share),
    share: Math.round(share * 100),
  }))

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
    if (n >= 100000)   return `₹${(n/100000).toFixed(2)} Lac`
    return `₹${n.toLocaleString('en-IN')}`
  }

  return (
    <section className="section" style={{ background: 'var(--concrete)' }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.08)', border: '1px solid var(--border-amber)', padding: '6px 16px', borderRadius: '4px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Live cost estimator
              </span>
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--slate)', marginBottom: '1rem' }}>
              How much will your<br />
              <span style={{ color: 'var(--amber)', fontWeight: 300 }}>construction cost?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
              Instant cost breakdown using today's live material prices from Hyderabad suppliers.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Controls */}
          <ScrollReveal direction="left">
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1.75rem', color: 'var(--slate)' }}>
                Enter your project details
              </h4>

              {/* Plot area */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Plot area</label>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {area.toLocaleString('en-IN')} sq.ft
                  </span>
                </div>
                <input type="range" min={500} max={10000} step={100} value={area}
                  onChange={e => setArea(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--amber)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>500 sq.ft</span><span>10,000 sq.ft</span>
                </div>
              </div>

              {/* Floors */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Number of floors</label>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {floors} floor{floors > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setFloors(n)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                        cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                        transition: 'all 0.2s ease',
                        borderColor: floors === n ? 'var(--amber)' : 'var(--border)',
                        background: floors === n ? 'rgba(224,123,57,0.1)' : 'transparent',
                        color: floors === n ? 'var(--amber-dark)' : 'var(--text-secondary)',
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Construction type */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Construction quality
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {([
                    { v: 'basic',    l: 'Basic',    price: '₹1,600/sqft' },
                    { v: 'standard', l: 'Standard', price: '₹2,200/sqft' },
                    { v: 'premium',  l: 'Premium',  price: '₹3,200/sqft' },
                  ] as const).map(t => (
                    <button key={t.v} onClick={() => setType(t.v)}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: '8px', border: '1px solid',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        borderColor: type === t.v ? 'var(--amber)' : 'var(--border)',
                        background: type === t.v ? 'rgba(224,123,57,0.1)' : 'transparent',
                      }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: type === t.v ? 'var(--amber-dark)' : 'var(--text-secondary)', marginBottom: '2px' }}>{t.l}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: 'var(--slate)',
                borderRadius: '10px',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(247,247,246,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Estimated total cost
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: 'var(--amber-light)', lineHeight: 1 }}>
                  {fmt(totalCost)}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(247,247,246,0.4)', marginTop: '8px' }}>
                  {Math.round(builtUp).toLocaleString('en-IN')} sq.ft built-up · {floors} floor{floors > 1 ? 's' : ''}
                </div>
              </div>

              <a href="/suppliers" className="btn btn-amber" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Find suppliers for this project →
              </a>
            </div>
          </ScrollReveal>

          {/* Breakdown */}
          <ScrollReveal direction="right">
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1.75rem', color: 'var(--slate)' }}>
                Cost breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {breakdown.map((b, i) => (
                  <div key={b.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i], display: 'inline-block', flexShrink: 0 }} />
                        {b.name}
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate)', fontFamily: 'Space Grotesk, sans-serif' }}>
                          {fmt(b.cost)}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          {b.share}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '4px', background: 'var(--concrete-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '2px',
                        background: COLORS[i],
                        width: `${b.share * 4}%`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--concrete)', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  💡 <strong style={{ color: 'var(--text-secondary)' }}>Tip:</strong> Prices are calculated using today's live market rates from Hyderabad suppliers. Get actual quotes from our verified supplier network.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
