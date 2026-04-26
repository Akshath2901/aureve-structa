'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const PRICES = [
  { name: 'Cement 53G', price: '₹370', unit: '/bag', change: '-2.1%', up: false },
  { name: 'TMT Steel',  price: '₹67',  unit: '/kg',  change: '+1.8%', up: true  },
  { name: 'M-Sand',     price: '₹52',  unit: '/cft', change: '+3.2%', up: true  },
  { name: 'Red Bricks', price: '₹9',   unit: '/pc',  change: 'Stable', up: null },
  { name: 'Aggregate',  price: '₹44',  unit: '/cft', change: '-0.5%', up: false },
  { name: 'OPC Cement', price: '₹355', unit: '/bag', change: '-1.2%', up: false },
  { name: 'River Sand', price: '₹68',  unit: '/cft', change: '+4.1%', up: true  },
  { name: 'TMT Fe550D', price: '₹72',  unit: '/kg',  change: '+2.1%', up: true  },
]

export function StructaHero() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111927 0%, #1E2A3A 40%, #0d1824 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(224,123,57,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224,123,57,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Diagonal amber accent */}
      <div style={{
        position: 'absolute', top: 0, right: '30%',
        width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(224,123,57,0.3), transparent)',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: '60%',
        width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(224,123,57,0.1), transparent)',
      }} />

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(224,123,57,0.15)',
        padding: '12px 0',
        background: 'rgba(17,25,39,0.5)',
        backdropFilter: 'blur(8px)',
        position: 'relative', zIndex: 10,
        marginTop: '64px',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', color: '#22c55e', textTransform: 'uppercase' }}>
              Live market prices
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
              Hyderabad · {time}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
            UPDATED DAILY FROM MARKET SOURCES
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div style={{
        background: 'rgba(224,123,57,0.08)',
        borderBottom: '1px solid rgba(224,123,57,0.1)',
        padding: '8px 0',
        overflow: 'hidden',
      }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...PRICES, ...PRICES].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '2.5rem', fontSize: '12px', fontWeight: 500 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{p.name}</span>
                <span style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{p.price}{p.unit}</span>
                <span style={{ color: p.up === true ? '#22c55e' : p.up === false ? '#ef4444' : 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
                  {p.up === true ? '▲' : p.up === false ? '▼' : '—'} {p.change}
                </span>
                <span style={{ color: 'rgba(224,123,57,0.3)', marginLeft: '1rem' }}>|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main hero content */}
      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

          {/* Left */}
          <div>
            <div className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', background: 'rgba(224,123,57,0.1)', border: '1px solid rgba(224,123,57,0.2)', padding: '6px 14px', borderRadius: '4px' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--amber-light)', textTransform: 'uppercase' }}>
                Construction intelligence · Hyderabad
              </span>
            </div>

            <h1 className="hero-h1" style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(3rem, 5vw, 5rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.0,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}>
              Real prices.<br />
              <span style={{
                color: 'var(--amber-light)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                Zero guesswork.
              </span>
            </h1>

            <p className="hero-sub" style={{ color: 'rgba(247,247,246,0.55)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '440px' }}>
              Live cement, steel, brick and sand prices — verified from Hyderabad suppliers daily.
              Estimators, supplier directory, and contractor listings built for serious builders.
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link href="/materials" className="btn btn-amber">
                View live prices →
              </Link>
              <Link href="/calculator" className="btn btn-outline-white">
                Cost calculator
              </Link>
            </div>

            {/* Mini stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: '2rem' }}>
              {[
                { val: '10+',  label: 'Materials tracked' },
                { val: '50+',  label: 'Verified suppliers' },
                { val: 'Daily', label: 'Price updates' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber-light)', lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(247,247,246,0.4)', marginTop: '4px', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Price cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {PRICES.slice(0, 6).map((p, i) => (
              <div key={i} className="card-lift" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                animation: `fadeUp 0.6s ease ${0.4 + i * 0.08}s both`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(224,123,57,0.08)'
                el.style.borderColor = 'rgba(224,123,57,0.3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(247,247,246,0.45)', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.05em' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '4px' }}>
                  {p.price}
                  <span style={{ fontSize: '12px', opacity: 0.45, fontWeight: 400 }}>{p.unit}</span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: p.up === true ? '#22c55e' : p.up === false ? '#ef4444' : 'rgba(247,247,246,0.35)' }}>
                  {p.up === true ? '▲' : p.up === false ? '▼' : '—'} {p.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div style={{ textAlign: 'center', paddingBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, var(--amber))', animation: 'float 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(247,247,246,0.3)', textTransform: 'uppercase' }}>scroll</span>
        </div>
      </div>
    </section>
  )
}
