'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80',
    tag: 'Live construction intelligence',
    label: 'Hyderabad',
  },
  {
    img: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1800&q=80',
    tag: 'Real prices. Zero guesswork.',
    label: 'Updated daily',
  },
  {
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1800&q=80',
    tag: 'Verified suppliers network',
    label: 'Pan Hyderabad',
  },
]

const CATEGORY_ICONS: Record<string, string> = {
  cement: '🏗', steel: '⚙', sand: '🪨', aggregates: '🪨',
  bricks: '🧱', tiles: '◼', paint: '🎨', pipes: '🔧',
  wood: '🪵', glass: '🔲',
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sv')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('sv-done') })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

export function StructaHomeClient({ materials, total }: { materials: any[]; total: number }) {
  const [slide, setSlide] = useState(0)
  const [ready, setReady] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useScrollReveal()

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500)
    const fn = (e: MouseEvent) => {
      if (window.innerWidth < 768) return
      setMouse({ x: (e.clientX / window.innerWidth - 0.5), y: (e.clientY / window.innerHeight - 0.5) })
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => { clearInterval(id); window.removeEventListener('mousemove', fn) }
  }, [])

  // Group materials by category for ticker
  const tickerItems = materials.map(m => `${m.name} ₹${m.price}/${m.unit} ${m.change > 0 ? `▲${m.change}%` : `▼${Math.abs(m.change)}%`}`)

  return (
    <div style={{ background: '#0F1620', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

        {/* Background slides */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: '-6%',
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transform: `translate(${mouse.x * -12}px, ${mouse.y * -8}px) scale(1.06)`,
            transition: i === slide ? 'opacity 2s ease, transform 0.15s linear' : 'opacity 2s ease',
            filter: 'brightness(0.45)',
          }} />
        ))}

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,22,32,0.95) 0%, rgba(15,22,32,0.6) 50%, rgba(15,22,32,0.2) 100%)' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(224,123,57,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(224,123,57,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: ready ? 1 : 0, transition: 'opacity 2s ease' }} />

        {/* Slide indicators */}
        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: '2px', height: i === slide ? '40px' : '14px', background: i === slide ? '#E07B39' : 'rgba(247,247,246,0.2)', border: 'none', cursor: 'pointer', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', padding: 0 }} />
          ))}
        </div>

        {/* Live prices ticker overlay */}
        <div style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', opacity: ready ? 0.9 : 0, transition: 'opacity 1.5s ease 1s', maxWidth: '180px' }}>
          {materials.slice(0, 5).map((m, i) => (
            <div key={m.id} style={{ background: 'rgba(15,22,32,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(224,123,57,0.15)', borderRadius: '4px', padding: '8px 12px', opacity: ready ? 1 : 0, transform: ready ? 'translateX(0)' : 'translateX(20px)', transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.1}s` }}>
              <div style={{ fontSize: '9px', color: 'rgba(247,247,246,0.4)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.category}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#F7F7F6', fontFamily: 'Space Grotesk, sans-serif' }}>₹{m.price}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: m.change > 0 ? '#4ade80' : '#f87171', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.change > 0 ? '▲' : '▼'}{Math.abs(m.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 'max(5vw, 1.25rem)', paddingRight: 'max(min(15vw, 220px), 1.25rem)' }}>
          <div style={{ maxWidth: '600px' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', opacity: ready ? 1 : 0, transform: ready ? 'translateX(0)' : 'translateX(-20px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'structaPulse 2s infinite' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>
                {HERO_SLIDES[slide].tag}
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 700, color: '#F7F7F6', lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '2rem', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
              Real prices.<br />
              <span style={{ color: '#E07B39' }}>Zero</span><br />
              guesswork.
            </h1>

            {/* Sub */}
            <p style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', color: 'rgba(247,247,246,0.5)', fontFamily: 'Inter, sans-serif', fontWeight: 300, lineHeight: 1.85, maxWidth: '440px', marginBottom: '2.5rem', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s' }}>
              Live cement, steel, brick and sand prices verified from Hyderabad suppliers daily. Estimator tools, supplier directory, and contractor listings.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s' }}>
              <Link href="/materials" style={{ padding: '14px 28px', background: '#E07B39', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(224,123,57,0.3)' }}>
                View live prices →
              </Link>
              <Link href="/calculator" style={{ padding: '14px 24px', background: 'transparent', border: '1px solid rgba(247,247,246,0.15)', color: 'rgba(247,247,246,0.7)', borderRadius: '4px', fontSize: '12px', fontWeight: 500, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Cost calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'rgba(15,22,32,0.85)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(224,123,57,0.12)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', background: 'rgba(224,123,57,0.15)', borderRight: '1px solid rgba(224,123,57,0.15)', flexShrink: 0 }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', marginRight: '8px', animation: 'structaPulse 2s infinite' }} />
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Live</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 35s linear infinite' }}>
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} style={{ fontSize: '11px', color: item.includes('▲') ? '#4ade80' : item.includes('▼') ? '#f87171' : 'rgba(247,247,246,0.35)', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  {item} <span style={{ color: 'rgba(224,123,57,0.2)' }}>·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: '#0F1620', padding: '4rem 0', borderBottom: '1px solid rgba(224,123,57,0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { value: `${total}+`, label: 'Materials tracked' },
              { value: '50+',       label: 'Verified suppliers' },
              { value: 'Daily',     label: 'Price updates' },
              { value: '₹0',        label: 'Brokerage' },
            ].map((s, i) => (
              <div key={s.label} className="sv" style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(247,247,246,0.03)', border: '1px solid rgba(224,123,57,0.08)', borderRadius: '4px' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#E07B39', marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: 'rgba(247,247,246,0.3)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE PRICES ─── */}
      <section style={{ padding: '5rem 0', background: '#111827' }}>
        <div className="container">
          <div className="sv" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'structaPulse 2s infinite' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>Hyderabad market rates</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#F7F7F6', letterSpacing: '-0.02em' }}>
                Live material prices
              </h2>
            </div>
            <Link href="/materials" style={{ fontSize: '11px', fontWeight: 600, color: '#E07B39', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(224,123,57,0.25)', padding: '9px 18px', borderRadius: '4px' }}>
              View all →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'rgba(224,123,57,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            {materials.map((m, i) => (
              <div key={m.id} className="sv"
                style={{ background: '#111827', padding: '1.25rem 1.5rem', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a2435'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#111827'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1rem' }}>{CATEGORY_ICONS[m.category] || '📦'}</span>
                  <span style={{ fontSize: '9px', color: 'rgba(247,247,246,0.3)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.category}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#F7F7F6', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '6px', lineHeight: 1.3 }}>{m.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#F7F7F6' }}>₹{m.price}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(247,247,246,0.3)', fontFamily: 'Inter, sans-serif', marginLeft: '4px' }}>/{m.unit}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: m.change > 0 ? '#4ade80' : '#f87171', fontFamily: 'Space Grotesk, sans-serif', background: m.change > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', padding: '3px 8px', borderRadius: '3px' }}>
                    {m.change > 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(247,247,246,0.2)', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}>{m.brand}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '5rem 0', background: '#0F1620', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sv" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#F7F7F6', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Everything a builder needs
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(247,247,246,0.4)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              One platform for prices, suppliers, and estimates
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '📊', title: 'Live price tracking',    desc: 'Cement, steel, sand, bricks — updated every day from verified Hyderabad suppliers.', href: '/materials' },
              { icon: '🧮', title: 'Cost calculator',         desc: 'Enter your plot area and get a complete cost breakdown in 60 seconds.',              href: '/calculator' },
              { icon: '🏭', title: 'Verified suppliers',      desc: '50+ verified suppliers across Hyderabad. Direct contact, no middleman.',             href: '/suppliers' },
              { icon: '🏠', title: 'Buy a home on Aureve',   desc: 'Looking for a finished home? Browse premium properties on our sister platform.',     href: 'https://aureve-app.vercel.app' },
            ].map((f, i) => (
              <Link key={f.title} href={f.href} className="sv"
                style={{ display: 'block', padding: '1.75rem', background: 'rgba(247,247,246,0.03)', border: '1px solid rgba(224,123,57,0.1)', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(224,123,57,0.06)'; el.style.borderColor = 'rgba(224,123,57,0.25)'; el.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(247,247,246,0.03)'; el.style.borderColor = 'rgba(224,123,57,0.1)'; el.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#F7F7F6', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.4)', fontFamily: 'Inter, sans-serif', lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUREVE CTA ─── */}
      <section style={{ padding: '4rem 0', background: '#111827', borderTop: '1px solid rgba(247,247,246,0.04)' }}>
        <div className="container">
          <div className="sv" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', padding: '2.5rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '1px', background: '#C9A84C' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'Space Grotesk, sans-serif' }}>Sister platform</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: '#F7F7F6', marginBottom: '6px' }}>Looking for a property to buy?</h3>
              <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.35)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>RERA-verified listings across Hyderabad's finest localities. Zero brokerage.</p>
            </div>
            <a href="https://aureve-app.vercel.app" target="_blank" style={{ padding: '13px 28px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(201,168,76,0.2)', flexShrink: 0 }}>
              Explore Aureve →
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0A1018', padding: '3.5rem 0 2rem', borderTop: '1px solid rgba(247,247,246,0.04)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#F7F7F6' }}>Structa</span>
                <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(224,123,57,0.15)', color: '#E07B39', padding: '3px 7px', borderRadius: '2px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>BETA</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.25)', fontFamily: 'Inter, sans-serif', lineHeight: 1.9, maxWidth: '260px', marginBottom: '1.5rem', fontWeight: 300 }}>
                Hyderabad's construction intelligence platform. Live prices, verified suppliers, and cost tools.
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.2)', fontFamily: 'Inter, sans-serif' }}>
                A product by <a href="https://aureve-app.vercel.app" style={{ color: '#C9A84C', textDecoration: 'none' }}>Aureve Group</a>
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07B39', marginBottom: '1.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Platform</h5>
              {['Live prices', 'Cost calculator', 'Suppliers', 'Sign up', 'Sign in'].map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(247,247,246,0.25)', marginBottom: '10px', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>{l}</a>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07B39', marginBottom: '1.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Materials</h5>
              {['Cement', 'Steel & TMT', 'Sand & Aggregates', 'Bricks & Blocks', 'Tiles & Flooring'].map(l => (
                <a key={l} href="/materials" style={{ display: 'block', fontSize: '13px', color: 'rgba(247,247,246,0.25)', marginBottom: '10px', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(247,247,246,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.15)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>© {new Date().getFullYear()} Structa by Aureve Group. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy', 'Terms'].map(l => (
                <a key={l} href="#" style={{ fontSize: '11px', color: 'rgba(247,247,246,0.15)', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes structaPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .sv { opacity:0; transform:translateY(20px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .sv.sv-done { opacity:1; transform:translateY(0); }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: 2fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="right: 4rem"][style*="position: absolute"] { display: none !important; }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
