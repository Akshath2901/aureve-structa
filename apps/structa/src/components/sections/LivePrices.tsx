'use client'

import { useState } from 'react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

const CATEGORIES = ['All', 'Cement', 'Steel', 'Bricks', 'Sand', 'Aggregates']

const ALL_PRICES = [
  { name: '53-Grade OPC Cement', brand: 'Ultratech', cat: 'Cement',     unit: 'bag', price: 370, prev: 378, icon: '🏗️', spec: '50kg bag' },
  { name: '43-Grade OPC Cement', brand: 'ACC',        cat: 'Cement',     unit: 'bag', price: 355, prev: 361, icon: '🏗️', spec: '50kg bag' },
  { name: 'PPC Cement',          brand: 'Dalmia',     cat: 'Cement',     unit: 'bag', price: 340, prev: 344, icon: '🏗️', spec: '50kg bag' },
  { name: 'TMT Fe500D',          brand: 'TATA Tiscon', cat: 'Steel',     unit: 'kg',  price: 67,  prev: 66,  icon: '⚙️', spec: '8–20mm dia' },
  { name: 'TMT Fe550D',          brand: 'JSW',         cat: 'Steel',     unit: 'kg',  price: 72,  prev: 71,  icon: '⚙️', spec: '12–25mm dia' },
  { name: 'Wire Rod MS',         brand: 'SAIL',        cat: 'Steel',     unit: 'kg',  price: 62,  prev: 62,  icon: '⚙️', spec: '6mm coil' },
  { name: 'First Class Red Brick', brand: 'Local',     cat: 'Bricks',    unit: 'pc',  price: 9,   prev: 9,   icon: '🧱', spec: '230×110×75mm' },
  { name: 'Fly Ash Brick',       brand: 'Local',       cat: 'Bricks',    unit: 'pc',  price: 8,   prev: 8,   icon: '🧱', spec: '230×110×75mm' },
  { name: 'M-Sand',              brand: 'Local',       cat: 'Sand',      unit: 'cft', price: 52,  prev: 50,  icon: '🪨', spec: 'Zone II washed' },
  { name: 'River Sand',          brand: 'Local',       cat: 'Sand',      unit: 'cft', price: 68,  prev: 65,  icon: '🪨', spec: 'Natural graded' },
  { name: '20mm Aggregate',      brand: 'Local',       cat: 'Aggregates', unit: 'cft', price: 44, prev: 45,  icon: '⬜', spec: 'Crushed stone' },
  { name: '40mm Aggregate',      brand: 'Local',       cat: 'Aggregates', unit: 'cft', price: 38, prev: 39,  icon: '⬜', spec: 'Crushed stone' },
]

export function LivePrices() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' ? ALL_PRICES : ALL_PRICES.filter(p => p.cat === activeTab)

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span className="live-dot" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Live prices · Updated today
                </span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--slate)' }}>
                Material price index
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Hyderabad market · Prices in INR · All change vs last week
              </p>
            </div>
            <a href="/materials" className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 20px' }}>
              Full price list →
            </a>
          </div>
        </ScrollReveal>

        {/* Category tabs */}
        <ScrollReveal delay={100}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderColor: activeTab === cat ? 'var(--amber)' : 'var(--border)',
                  background: activeTab === cat ? 'rgba(224,123,57,0.08)' : 'transparent',
                  color: activeTab === cat ? 'var(--amber-dark)' : 'var(--text-secondary)',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Price table */}
        <ScrollReveal delay={150}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: 'var(--concrete)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  {['Material', 'Brand', 'Spec', 'City', 'Price', 'Change', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const change = ((p.price - p.prev) / p.prev * 100)
                  const pct = change.toFixed(1)
                  const up = change > 0.1 ? true : change < -0.1 ? false : null
                  return (
                    <tr key={p.name} style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(17,25,39,0.05)' : 'none',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,123,57,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                          <span style={{ fontWeight: 600, color: 'var(--slate)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>{p.brand}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '12px' }}>{p.spec}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>Hyderabad</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--slate)' }}>
                          ₹{p.price}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '3px' }}>/{p.unit}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontWeight: 600, fontSize: '12px',
                          color: up === true ? '#dc2626' : up === false ? '#15803d' : 'var(--text-muted)',
                        }}>
                          {up === true ? '▲' : up === false ? '▼' : '—'}
                          {up !== null ? ` ${Math.abs(Number(pct))}%` : ' Stable'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button style={{
                          fontSize: '11px', fontWeight: 600, padding: '5px 12px',
                          borderRadius: '4px', border: '1px solid var(--border-amber)',
                          background: 'transparent', color: 'var(--amber)',
                          cursor: 'pointer', letterSpacing: '0.05em',
                        }}>
                          GET QUOTE
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
          * Prices are indicative and may vary by supplier, quantity, and delivery location. Always confirm with supplier before ordering.
        </p>
      </div>
    </section>
  )
}
