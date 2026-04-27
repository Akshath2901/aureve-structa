'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const HERO_SLIDES = [
  {
    img:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85',
    tag:   'Live construction intelligence',
    head:  'Real prices.',
    sub:   'Zero guesswork.',
    desc:  'Cement, steel, bricks — verified daily from Hyderabad suppliers.',
  },
  {
    img:   'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1800&q=85',
    tag:   'TMT steel · Cement · Sand · Aggregates',
    head:  'Every material.',
    sub:   'Every price.',
    desc:  'Live rates on 50+ construction materials updated from Hyderabad market.',
  },
  {
    img:   'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1800&q=85',
    tag:   'Verified supplier network',
    head:  'Trusted suppliers.',
    sub:   'Direct connect.',
    desc:  'Skip the middleman. Connect directly with verified Hyderabad suppliers.',
  },
  {
    img:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85',
    tag:   'Cost calculator · Estimates',
    head:  'Plan smart.',
    sub:   'Build better.',
    desc:  'Full cost breakdowns for any plot size in under 60 seconds.',
  },
]

const MATERIAL_IMAGES: Record<string, string> = {
  cement:     'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
  steel:      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
  sand:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  aggregates: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  bricks:     'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
  tiles:      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
  paint:      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
  pipes:      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  wood:       'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80',
  glass:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
}

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
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

export function StructaHomeClient({ materials, total }: { materials: any[]; total: number }) {
  const [slide,  setSlide]  = useState(0)
  const [ready,  setReady]  = useState(false)
  const [mouse,  setMouse]  = useState({ x: 0, y: 0 })
  const [ticker, setTicker] = useState(0)

  useScrollReveal()

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    const slideId  = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500)
    const tickerId = setInterval(() => setTicker(t => (t + 1) % materials.length), 3000)
    const fn = (e: MouseEvent) => {
      if (window.innerWidth < 768) return
      setMouse({ x: (e.clientX / window.innerWidth - 0.5), y: (e.clientY / window.innerHeight - 0.5) })
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => { clearInterval(slideId); clearInterval(tickerId); window.removeEventListener('mousemove', fn) }
  }, [materials.length])

  const cur = HERO_SLIDES[slide]

  return (
    <div style={{ background: '#080E15', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

        {/* BG slides */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: '-6%',
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transform: `translate(${mouse.x * -14}px, ${mouse.y * -9}px) scale(1.06)`,
            transition: i === slide ? 'opacity 2s ease, transform 0.15s linear' : 'opacity 2s ease',
            filter: 'brightness(0.3) saturate(0.8)',
          }} />
        ))}

        {/* Industrial overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,14,21,0.97) 0%, rgba(8,14,21,0.7) 50%, rgba(8,14,21,0.3) 100%)' }} />

        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(224,123,57,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(224,123,57,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: ready ? 1 : 0, transition: 'opacity 2s ease' }} />

        {/* Diagonal accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(to right, #E07B39, transparent 60%)' }} />

        {/* Slide indicators */}
        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10, opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 1s' }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: '2px', height: i === slide ? '44px' : '14px', background: i === slide ? '#E07B39' : 'rgba(247,247,246,0.2)', border: 'none', cursor: 'pointer', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', padding: 0 }} />
          ))}
        </div>

        {/* Live price panel — right side desktop */}
        <div style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '6px', opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 1s', zIndex: 10 }} className="desktop-only">
          <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(224,123,57,0.5)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', marginBottom: '4px', paddingLeft: '12px' }}>Live rates</div>
          {materials.slice(0, 6).map((m, i) => (
            <div key={m.id} style={{ background: 'rgba(8,14,21,0.85)', backdropFilter: 'blur(16px)', border: `1px solid ${i === ticker ? 'rgba(224,123,57,0.4)' : 'rgba(247,247,246,0.06)'}`, borderLeft: `2px solid ${i === ticker ? '#E07B39' : 'rgba(247,247,246,0.1)'}`, borderRadius: '3px', padding: '8px 12px', width: '160px', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', transform: i === ticker ? 'translateX(-4px)' : 'translateX(0)' }}>
              <div style={{ fontSize: '8px', color: 'rgba(247,247,246,0.35)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.category}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F7F7F6', fontFamily: 'Space Grotesk, sans-serif' }}>₹{m.price}<span style={{ fontSize: '9px', color: 'rgba(247,247,246,0.3)', fontWeight: 400 }}>/{m.unit}</span></span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: m.change > 0 ? '#4ade80' : '#f87171', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.change > 0 ? '▲' : '▼'}{Math.abs(m.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', alignItems: 'center', padding: '0 clamp(1.25rem, 8vw, 7rem)', paddingRight: 'clamp(1.25rem, 22vw, 260px)' }}>
          <div style={{ maxWidth: '580px', width: '100%' }}>

            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', opacity: ready ? 1 : 0, transform: ready ? 'translateX(0)' : 'translateX(-20px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', padding: '4px 12px', borderRadius: '2px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', animation: 'structaPulse 2s infinite' }} />
                <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.2em', color: '#4ade80', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase' }}>Live market · Hyderabad</span>
              </div>
              <span style={{ fontSize: '8px', color: 'rgba(224,123,57,0.6)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{cur.tag}</span>
            </div>

            {/* Headline */}
            <div style={{ marginBottom: '1.5rem', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 700, color: '#F7F7F6', lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
                {cur.head}
              </h1>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 700, color: '#E07B39', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                {cur.sub}
              </h1>
            </div>

            {/* Sub */}
            <p style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', color: 'rgba(247,247,246,0.45)', fontFamily: 'Inter, sans-serif', fontWeight: 300, lineHeight: 1.85, maxWidth: '400px', marginBottom: '2.5rem', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s' }}>
              {cur.desc}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(15px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s' }}>
              <Link href="/materials"
                style={{ padding: '14px 28px', background: '#E07B39', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(224,123,57,0.35)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 44px rgba(224,123,57,0.5)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px rgba(224,123,57,0.35)' }}>
                View live prices →
              </Link>
              <Link href="/calculator"
                style={{ padding: '14px 24px', background: 'rgba(247,247,246,0.05)', border: '1px solid rgba(247,247,246,0.12)', color: 'rgba(247,247,246,0.7)', borderRadius: '3px', fontSize: '12px', fontWeight: 500, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(224,123,57,0.4)'; el.style.color = '#E07B39' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(247,247,246,0.12)'; el.style.color = 'rgba(247,247,246,0.7)' }}>
                Cost calculator
              </Link>
              <Link href="/auth/signup"
                style={{ padding: '14px 22px', background: 'transparent', border: '1px solid rgba(247,247,246,0.08)', color: 'rgba(247,247,246,0.4)', borderRadius: '3px', fontSize: '12px', fontWeight: 400, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', transition: 'all 0.3s' }}>
                Sign up free
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 1.2s', flexWrap: 'wrap' }}>
              {[
                { value: `${total}+`, label: 'Materials' },
                { value: '50+',       label: 'Suppliers'  },
                { value: 'Daily',     label: 'Updates'    },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: '#E07B39', lineHeight: 1, marginBottom: '3px' }}>{s.value}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(247,247,246,0.3)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: 'clamp(1.25rem, 8vw, 7rem)', display: 'flex', alignItems: 'center', gap: '10px', opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease 2s' }}>
          <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, transparent, rgba(224,123,57,0.7))', animation: 'floatAnim 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(247,247,246,0.2)', fontFamily: 'Space Grotesk, sans-serif' }}>Scroll</span>
        </div>

        {/* Ticker */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'rgba(8,14,21,0.88)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(224,123,57,0.12)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(224,123,57,0.12)', borderRight: '1px solid rgba(224,123,57,0.15)', flexShrink: 0 }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', animation: 'structaPulse 2s infinite' }} />
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Live prices</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeAnim 35s linear infinite' }}>
              {[...materials, ...materials, ...materials].map((m, i) => (
                <span key={i} style={{ fontSize: '11px', color: m.change > 0 ? '#4ade80' : m.change < 0 ? '#f87171' : 'rgba(247,247,246,0.35)', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  {m.name} ₹{m.price}/{m.unit} {m.change > 0 ? `▲${m.change}%` : m.change < 0 ? `▼${Math.abs(m.change)}%` : '—'} <span style={{ color: 'rgba(224,123,57,0.15)' }}>|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS STRUCTA ─── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 0', background: '#0D1520', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(224,123,57,0.3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=40)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.04 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div className="sv">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '2px', background: '#E07B39' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>What is Structa</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#F7F7F6', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                Construction intelligence<br />
                <span style={{ color: '#E07B39' }}>built for Hyderabad.</span>
              </h2>
              <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(247,247,246,0.45)', fontFamily: 'Inter, sans-serif', fontWeight: 300, lineHeight: 1.9, marginBottom: '2rem' }}>
                Structa is the only platform that tracks live material prices, connects contractors with verified suppliers, and calculates construction costs — all specific to Hyderabad's market.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/auth/signup" style={{ padding: '12px 24px', background: '#E07B39', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Get started free
                </Link>
                <Link href="/materials" style={{ padding: '12px 20px', border: '1px solid rgba(247,247,246,0.1)', color: 'rgba(247,247,246,0.5)', borderRadius: '3px', fontSize: '12px', fontWeight: 400, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(224,123,57,0.4)'; el.style.color = '#E07B39' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(247,247,246,0.1)'; el.style.color = 'rgba(247,247,246,0.5)' }}>
                  View prices →
                </Link>
              </div>
            </div>

            {/* Feature cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '📊', title: 'Live prices',      desc: 'Updated daily from verified Hyderabad market sources',  color: '#E07B39' },
                { icon: '🧮', title: 'Cost calculator',  desc: 'Full breakdown for any plot size in 60 seconds',        color: '#4ade80' },
                { icon: '🏭', title: 'Verified suppliers',desc: '50+ suppliers. Direct contact. No brokers.',           color: '#60a5fa' },
                { icon: '📱', title: 'Price alerts',     desc: 'Get notified when material prices drop',                color: '#f59e0b' },
              ].map((f, i) => (
                <div key={f.title} className="sv"
                  style={{ background: 'rgba(247,247,246,0.03)', border: `1px solid rgba(247,247,246,0.06)`, borderRadius: '4px', padding: '1.25rem', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${i * 0.08}s` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${f.color}08`; el.style.borderColor = `${f.color}25`; el.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(247,247,246,0.03)'; el.style.borderColor = 'rgba(247,247,246,0.06)'; el.style.transform = 'translateY(0)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{f.icon}</div>
                  <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F7F7F6', marginBottom: '6px' }}>{f.title}</h4>
                  <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.35)', fontFamily: 'Inter, sans-serif', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE PRICES SECTION ─── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#080E15', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1400&q=30)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sv" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', animation: 'structaPulse 2s infinite' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(224,123,57,0.7)', fontFamily: 'Space Grotesk, sans-serif' }}>Hyderabad market rates — updated daily</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#F7F7F6', letterSpacing: '-0.02em' }}>
                Live material prices
              </h2>
            </div>
            <Link href="/materials" style={{ fontSize: '11px', fontWeight: 600, color: '#E07B39', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(224,123,57,0.25)', padding: '9px 18px', borderRadius: '3px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(224,123,57,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              View all {total}+ →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1px', background: 'rgba(224,123,57,0.08)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(224,123,57,0.08)' }}>
            {materials.map((m, i) => (
              <div key={m.id} className="sv"
                style={{ background: '#0D1520', padding: '1.25rem 1.5rem', transition: 'background 0.25s', position: 'relative', overflow: 'hidden', transitionDelay: `${(i % 8) * 0.05}s` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#111d2e'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#0D1520'}>

                {/* Category image strip */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '100%', opacity: 0.08 }}>
                  <img src={MATERIAL_IMAGES[m.category] || MATERIAL_IMAGES.cement} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>{CATEGORY_ICONS[m.category] || '📦'}</span>
                    <span style={{ fontSize: '8px', color: 'rgba(247,247,246,0.25)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.category}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#F7F7F6', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '8px', lineHeight: 1.3 }}>{m.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#F7F7F6' }}>₹{m.price}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(247,247,246,0.25)', fontFamily: 'Inter, sans-serif', marginLeft: '4px' }}>/{m.unit}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: m.change > 0 ? '#4ade80' : m.change < 0 ? '#f87171' : 'rgba(247,247,246,0.3)', fontFamily: 'Space Grotesk, sans-serif', background: m.change > 0 ? 'rgba(74,222,128,0.1)' : m.change < 0 ? 'rgba(248,113,113,0.1)' : 'transparent', padding: '2px 7px', borderRadius: '2px' }}>
                        {m.change > 0 ? '▲' : m.change < 0 ? '▼' : '—'} {Math.abs(m.change)}%
                      </div>
                      <div style={{ fontSize: '9px', color: 'rgba(247,247,246,0.2)', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{m.brand}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#0D1520', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1400&q=30)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sv" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '2px', background: '#E07B39' }} />
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>Simple process</span>
              <div style={{ width: '28px', height: '2px', background: '#E07B39' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#F7F7F6', letterSpacing: '-0.02em' }}>
              How Structa works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse prices',     desc: 'Check live rates for cement, steel, sand, and 50+ other materials — updated daily.',        img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=70' },
              { step: '02', icon: '🧮', title: 'Calculate costs',   desc: 'Enter your plot size, get a full material cost breakdown instantly.',                        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70' },
              { step: '03', icon: '🏭', title: 'Find suppliers',    desc: 'Connect with verified suppliers in Hyderabad. Compare prices, get quotes directly.',        img: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=70' },
              { step: '04', icon: '🏗', title: 'Build confidently', desc: 'No middlemen, no surprises. Know exactly what your construction will cost before you start.', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=70' },
            ].map((s, i) => (
              <div key={s.step} className="sv"
                style={{ background: 'rgba(247,247,246,0.03)', border: '1px solid rgba(247,247,246,0.06)', borderRadius: '4px', overflow: 'hidden', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${i * 0.1}s` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(224,123,57,0.25)'; el.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(247,247,246,0.06)'; el.style.transform = 'translateY(0)' }}>
                <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(0.7)', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,21,32,0.9), transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'rgba(224,123,57,0.25)' }}>{s.step}</div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '1.5rem' }}>{s.icon}</div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F7F7F6', marginBottom: '8px' }}>{s.title}</h4>
                  <p style={{ fontSize: '12px', color: 'rgba(247,247,246,0.35)', fontFamily: 'Inter, sans-serif', lineHeight: 1.75, fontWeight: 300 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section style={{ background: '#E07B39', padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: `${total}+`, label: 'Materials tracked',   sub: 'And growing daily'   },
              { value: '50+',       label: 'Verified suppliers',  sub: 'Pan Hyderabad'        },
              { value: 'Daily',     label: 'Price updates',       sub: 'From market sources'  },
              { value: '₹0',        label: 'Brokerage',           sub: 'Always free'          },
            ].map(s => (
              <div key={s.label} className="sv">
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 0', background: '#080E15', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=30)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(224,123,57,0.08) 0%, transparent 70%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="sv">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '2px', background: '#E07B39' }} />
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'Space Grotesk, sans-serif' }}>Join Structa today</span>
              <div style={{ width: '36px', height: '2px', background: '#E07B39' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700, color: '#F7F7F6', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              Stop guessing.<br />
              <span style={{ color: '#E07B39' }}>Start building smart.</span>
            </h2>
            <p style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: 'rgba(247,247,246,0.4)', fontFamily: 'Inter, sans-serif', fontWeight: 300, marginBottom: '3rem', maxWidth: '480px', margin: '0 auto 3rem' }}>
              Live prices, verified suppliers, and cost tools — all free for contractors.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup"
                style={{ padding: '15px 36px', background: '#E07B39', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(224,123,57,0.35)', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 44px rgba(224,123,57,0.5)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px rgba(224,123,57,0.35)' }}>
                Create free account →
              </Link>
              <Link href="/materials"
                style={{ padding: '15px 28px', background: 'transparent', border: '1px solid rgba(247,247,246,0.1)', color: 'rgba(247,247,246,0.5)', borderRadius: '3px', fontSize: '12px', fontWeight: 400, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(224,123,57,0.4)'; el.style.color = '#E07B39' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(247,247,246,0.1)'; el.style.color = 'rgba(247,247,246,0.5)' }}>
                Browse prices first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AUREVE CROSSLINK ─── */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 0', background: '#0D1520', borderTop: '1px solid rgba(247,247,246,0.04)' }}>
        <div className="container">
          <div className="sv" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', padding: '2rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '20px', height: '1px', background: '#C9A84C' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'Space Grotesk, sans-serif' }}>Sister platform</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 700, color: '#F7F7F6', marginBottom: '6px' }}>
                Looking to buy a finished home?
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.3)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                Aureve — RERA verified premium properties across Hyderabad. Zero brokerage.
              </p>
            </div>
            <a href="https://aureve-app.vercel.app" target="_blank"
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 6px 20px rgba(201,168,76,0.2)', flexShrink: 0, transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 32px rgba(201,168,76,0.35)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 6px 20px rgba(201,168,76,0.2)' }}>
              Explore Aureve →
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#04080E', padding: 'clamp(3rem, 6vw, 5rem) 0 2rem', borderTop: '1px solid rgba(247,247,246,0.04)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#F7F7F6' }}>Structa</span>
                <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(224,123,57,0.15)', color: '#E07B39', padding: '3px 8px', borderRadius: '2px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>BETA</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.22)', fontFamily: 'Inter, sans-serif', lineHeight: 1.9, maxWidth: '260px', marginBottom: '1.5rem', fontWeight: 300 }}>
                Hyderabad's construction intelligence platform. Live prices, verified suppliers, cost tools.
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.15)', fontFamily: 'Inter, sans-serif' }}>
                By <a href="https://aureve-app.vercel.app" style={{ color: '#C9A84C', textDecoration: 'none' }}>Aureve Group</a>
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07B39', marginBottom: '1.25rem', fontFamily: 'Space Grotesk, sans-serif' }}>Platform</h5>
              {['Live prices', 'Cost calculator', 'Find suppliers', 'Sign up free', 'Sign in'].map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(247,247,246,0.22)', marginBottom: '9px', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 300, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,247,246,0.6)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,247,246,0.22)'}>{l}</a>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E07B39', marginBottom: '1.25rem', fontFamily: 'Space Grotesk, sans-serif' }}>Materials</h5>
              {['Cement & OPC', 'Steel & TMT', 'Sand & M-Sand', 'Bricks & AAC', 'Tiles & Granite', 'Pipes & Plumbing'].map(l => (
                <a key={l} href="/materials" style={{ display: 'block', fontSize: '13px', color: 'rgba(247,247,246,0.22)', marginBottom: '9px', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 300, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,247,246,0.6)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,247,246,0.22)'}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(247,247,246,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'rgba(247,247,246,0.12)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              © {new Date().getFullYear()} Structa by Aureve Group. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy', 'Terms'].map(l => (
                <a key={l} href="#" style={{ fontSize: '11px', color: 'rgba(247,247,246,0.12)', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes structaPulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes marqueeAnim   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes floatAnim     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .sv { opacity:0; transform:translateY(24px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .sv.sv-done { opacity:1; transform:translateY(0); }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          div[style*="grid-template-columns: repeat(auto-fill, minmax(min(240px"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-template-columns: repeat(auto-fill, minmax(min(160px"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="grid-column: span 2"] { grid-column: span 1 !important; }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
