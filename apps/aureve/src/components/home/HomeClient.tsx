'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

function formatPrice(paise: number, listingType?: string): string {
  const r = paise / 100
  if (listingType === 'rent') return `₹${Math.round(r / 1000).toLocaleString('en-IN')}k/mo`
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(0)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sr')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('sr-done') })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true)
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 2000, 1)
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target, started])
  return <div ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</div>
}

// Mobile-friendly property card for pinned section
function MobileFeaturedCard({ p }: { p: any }) {
  return (
    <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(26,26,22,0.1)', marginBottom: '1rem' }}>
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.8) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, color: '#FAF8F3' }}>
            {formatPrice(p.price, p.listing_type)}
          </div>
        </div>
        {p.is_premium && <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '8px', fontWeight: 700, background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif' }}>✦ PREMIUM</span>}
        {p.rera_number && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '8px', fontWeight: 700, background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '3px 8px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>RERA ✓</span>}
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '16px', height: '1px', background: '#C9A84C' }} />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'DM Sans, sans-serif' }}>{p.locality}</span>
        </div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '10px' }}>{p.title}</h3>
        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '12px' }}>
          {p.bedrooms && <span>{p.bedrooms} BHK</span>}
          {p.carpet_area && <span>{p.carpet_area.toLocaleString('en-IN')} sqft</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/property/${p.slug}`} style={{ flex: 1, padding: '10px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '10px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
            View property
          </Link>
          <Link href={`/property/${p.slug}/brochure`} target="_blank" style={{ padding: '10px 14px', border: '1px solid rgba(26,26,22,0.15)', color: 'var(--charcoal)', borderRadius: '2px', fontSize: '10px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
            ↓
          </Link>
        </div>
      </div>
    </div>
  )
}

// Desktop pinned showcase
function PinnedShowcase({ properties }: { properties: any[] }) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const onScroll = () => {
      const el = containerRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      const idx = Math.min(properties.length - 1, Math.floor(progress * properties.length))
      setActive(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [properties.length, isMobile])

  if (!properties.length) return null

  // Mobile — just show cards stacked
  if (isMobile) {
    return (
      <div style={{ padding: '0 1rem 2rem' }}>
        {properties.map(p => <MobileFeaturedCard key={p.id} p={p} />)}
      </div>
    )
  }

  // Desktop — pinned scroll
  return (
    <section ref={containerRef} style={{ height: `${properties.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Left — image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {properties.map((p, i) => (
            <div key={p.id} style={{ position: 'absolute', inset: 0, opacity: i === active ? 1 : 0, transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1)', transform: i === active ? 'scale(1)' : 'scale(1.03)' }}>
              <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'} alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', display: 'flex', gap: '8px' }}>
            {properties.map((_, i) => (
              <div key={i} style={{ width: i === active ? '28px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? '#C9A84C' : 'rgba(250,248,243,0.3)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', top: '2.5rem', right: '2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'rgba(250,248,243,0.5)' }}>
            {String(active + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}
          </div>
        </div>

        {/* Right — content */}
        <div style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', padding: '4rem 5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', right: '-2rem', transform: 'translateY(-50%)', fontFamily: 'Cormorant Garamond, serif', fontSize: '20rem', fontWeight: 300, color: 'rgba(26,26,22,0.03)', lineHeight: 1, userSelect: 'none' }}>
            {String(active + 1).padStart(2, '0')}
          </div>
          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            {properties.map((p, i) => (
              <div key={p.id} style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: i === active ? 'translateY(-50%)' : i < active ? 'translateY(-120%)' : 'translateY(80%)', opacity: i === active ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                  <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
                  <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{p.locality} · Hyderabad</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>{p.title}</h3>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--charcoal)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1 }}>
                  {formatPrice(p.price, p.listing_type)}
                  {p.price_per_sqft && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, marginLeft: '12px' }}>₹{p.price_per_sqft.toLocaleString('en-IN')}/sqft</span>}
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
                  {[
                    { label: 'Beds',   value: p.bedrooms ? `${p.bedrooms} BHK` : '—' },
                    { label: 'Area',   value: p.carpet_area ? `${p.carpet_area.toLocaleString('en-IN')} sqft` : '—' },
                    { label: 'Status', value: p.status === 'under_construction' ? 'UC' : 'Ready' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href={`/property/${p.slug}`} style={{ padding: '14px 32px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)' }}>
                    View property
                  </Link>
                  <Link href={`/property/${p.slug}/brochure`} target="_blank" style={{ padding: '14px 24px', border: '1px solid rgba(26,26,22,0.2)', color: 'var(--charcoal)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold-dark)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.2)'; el.style.color = 'var(--charcoal)' }}>
                    ↓ Brochure
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Locality immersion
const LOCALITIES_IMMERSIVE = [
  { name: 'Kokapet',       tag: 'The financial district',       img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1800&q=80', price: '₹7,500', trend: '+8.2%', desc: "Hyderabad's fastest rising corridor. Home to India's top IT firms and premium residences." },
  { name: 'Narsingi',      tag: 'Where luxury meets serenity',  img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1800&q=80', price: '₹6,800', trend: '+9.1%', desc: "Green, gated, and growing. Narsingi is the choice of Hyderabad's most discerning buyers." },
  { name: 'Banjara Hills', tag: "Hyderabad's finest address",   img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1800&q=80', price: '₹14,500', trend: '+4.2%', desc: 'The original luxury address of the city. Limited inventory, exceptional demand.' },
  { name: 'Jubilee Hills', tag: 'Old money, new heights',       img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=80', price: '₹16,800', trend: '+3.9%', desc: 'An address that speaks before you do. The most coveted postcode in Hyderabad.' },
]

function LocalityImmersion() {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const onScroll = () => {
      const el = containerRef.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      setActive(Math.min(LOCALITIES_IMMERSIVE.length - 1, Math.floor(progress * LOCALITIES_IMMERSIVE.length)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  const loc = LOCALITIES_IMMERSIVE[active]

  // Mobile — show as simple cards
  if (isMobile) {
    return (
      <div>
        {LOCALITIES_IMMERSIVE.map((l, i) => (
          <Link key={l.name} href={`/properties?locality=${l.name}`}
            style={{ display: 'block', position: 'relative', height: '240px', overflow: 'hidden', textDecoration: 'none' }}>
            <img src={l.img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.85) 0%, rgba(26,26,22,0.2) 60%)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
              <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>{l.tag}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#FAF8F3', marginBottom: '6px', fontWeight: 300 }}>{l.name}</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'rgba(250,248,243,0.65)', fontFamily: 'DM Sans, sans-serif' }}>{l.price}/sqft</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80', fontFamily: 'DM Sans, sans-serif', background: 'rgba(74,222,128,0.12)', padding: '2px 8px', borderRadius: '2px' }}>▲ {l.trend}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  // Desktop — full scroll immersion
  return (
    <section ref={containerRef} style={{ height: `${LOCALITIES_IMMERSIVE.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {LOCALITIES_IMMERSIVE.map((l, i) => (
          <div key={l.name} style={{ position: 'absolute', inset: 0, opacity: i === active ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)' }}>
            <img src={l.img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: i === active ? 'scale(1)' : 'scale(1.04)', transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,22,0.75) 0%, rgba(26,26,22,0.3) 60%, rgba(26,26,22,0.2) 100%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, overflow: 'hidden', userSelect: 'none', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '4rem', animation: 'marquee 20s linear infinite', opacity: 0.06 }}>
            {[...LOCALITIES_IMMERSIVE, ...LOCALITIES_IMMERSIVE].map((l, i) => (
              <span key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '10rem', fontWeight: 300, color: '#FAF8F3', whiteSpace: 'nowrap', lineHeight: 1 }}>{l.name}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '4rem 8vw' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{loc.tag}</span>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 0.95, marginBottom: '1.5rem', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}>{loc.name}</h2>
            <p style={{ fontSize: '15px', color: 'rgba(250,248,243,0.6)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, maxWidth: '480px', lineHeight: 1.8, marginBottom: '2.5rem' }}>{loc.desc}</p>
            <Link href={`/properties?locality=${loc.name}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FAF8F3', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, borderBottom: '1px solid rgba(250,248,243,0.3)', paddingBottom: '4px' }}>
              Explore properties <span style={{ fontSize: '1.1rem' }}>→</span>
            </Link>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', color: '#FAF8F3', fontWeight: 300, lineHeight: 1, marginBottom: '4px' }}>{loc.price}</div>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.45)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', marginBottom: '6px' }}>per sq.ft</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', fontFamily: 'DM Sans, sans-serif', background: 'rgba(74,222,128,0.12)', padding: '4px 12px', borderRadius: '2px', display: 'inline-block' }}>▲ {loc.trend} YoY</div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {LOCALITIES_IMMERSIVE.map((_, i) => (
            <div key={i} style={{ width: '2px', height: i === active ? '40px' : '16px', background: i === active ? 'var(--gold)' : 'rgba(250,248,243,0.25)', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Word reveal
function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s` }}>
          {word}
        </span>
      ))}
    </div>
  )
}

// Loader
function Loader({ done }: { done: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0D0D0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'all', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 300, color: '#FAF8F3', letterSpacing: '0.3em', textTransform: 'uppercase', animation: 'loaderFadeIn 0.8s ease both', marginBottom: '2rem' }}>Aureve</div>
      <div style={{ width: '120px', height: '1px', background: 'rgba(201,168,76,0.2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(to right, #C9A84C, #F4DFA0)', animation: 'loaderLine 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both' }} />
      </div>
      <div style={{ marginTop: '1.5rem', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', fontFamily: 'DM Sans, sans-serif', animation: 'loaderFadeIn 0.8s ease 0.5s both' }}>Premium Real Estate</div>
    </div>
  )
}

// Custom cursor
function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos  = useRef({ x: 0, y: 0 })
  const rpos = useRef({ x: 0, y: 0 })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const move = (e: MouseEvent) => {
      setShow(true)
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) { dot.current.style.left = `${e.clientX}px`; dot.current.style.top = `${e.clientY}px` }
    }
    const animate = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.1
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.1
      if (ring.current) { ring.current.style.left = `${rpos.current.x}px`; ring.current.style.top = `${rpos.current.y}px` }
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', move, { passive: true })
    requestAnimationFrame(animate)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  if (!show) return null
  return (
    <>
      <div ref={dot} style={{ position: 'fixed', width: '6px', height: '6px', background: '#C9A84C', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9998 }} />
      <div ref={ring} style={{ position: 'fixed', width: '32px', height: '32px', border: '1px solid rgba(201,168,76,0.6)', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9997, transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }} />
    </>
  )
}

const HERO_BG = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80',
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1800&q=80',
]

export function HomeClient({ totalProperties, totalUsers, featured, localities, recentProperties }: {
  totalProperties: number; totalUsers: number; featured: any[]; localities: any[]; recentProperties: any[]
}) {
  const [loaderDone, setLoaderDone] = useState(false)
  const [heroReady,  setHeroReady]  = useState(false)
  const [heroSlide,  setHeroSlide]  = useState(0)
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 })

  useScrollReveal()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setLoaderDone(true), 1800)
    const t2 = setTimeout(() => { setHeroReady(true); document.body.style.overflow = '' }, 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setHeroSlide(s => (s + 1) % HERO_BG.length), 6000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (window.innerWidth < 768) return
    const fn = (e: MouseEvent) => setMouse({ x: (e.clientX / window.innerWidth - 0.5), y: (e.clientY / window.innerHeight - 0.5) })
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const top3 = featured.slice(0, 3)

  return (
    <>
      <Loader done={loaderDone} />
      <CustomCursor />

      <div style={{ background: 'var(--cream)', cursor: 'none', overflowX: 'hidden' }}>

        {/* ─── HERO ─── */}
        <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
          {HERO_BG.map((img, i) => (
            <div key={i} style={{ position: 'absolute', inset: '-8%', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === heroSlide ? 1 : 0, transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px) scale(1.1)`, transition: i === heroSlide ? 'opacity 2s ease, transform 0.12s linear' : 'opacity 2s ease' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(13,13,11,0.92) 0%, rgba(13,13,11,0.55) 50%, rgba(13,13,11,0.18) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

          {/* Slide indicators */}
          <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
            {HERO_BG.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} style={{ width: '2px', height: i === heroSlide ? '44px' : '14px', background: i === heroSlide ? 'var(--gold)' : 'rgba(250,248,243,0.2)', border: 'none', cursor: 'pointer', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', padding: 0 }} />
            ))}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 'max(5vw, 1.25rem)', paddingRight: 'max(5vw, 1.25rem)' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Premium real estate · Hyderabad</span>
              </div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 8vw, 7rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '2rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
                Where your<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.55)' }}>next chapter</em><br />
                begins.
              </h1>
              <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: 'rgba(250,248,243,0.5)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.85, maxWidth: '440px', marginBottom: '3rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.7s' }}>
                Curated apartments, villas and plots across Hyderabad's most prestigious addresses. RERA certified. Zero brokerage.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.9s' }}>
                <Link href="/properties" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 8px 40px rgba(201,168,76,0.25)' }}>
                  Explore properties
                </Link>
                <Link href="/auth/signup" style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(250,248,243,0.2)', color: 'rgba(250,248,243,0.75)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Create account
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{ position: 'absolute', bottom: '3rem', left: 'max(5vw, 1.25rem)', display: 'flex', alignItems: 'center', gap: '12px', opacity: heroReady ? 1 : 0, transition: 'opacity 1.5s ease 1.8s' }}>
            <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.7))', animation: 'float 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', fontFamily: 'DM Sans, sans-serif' }}>Scroll</span>
          </div>

          {/* Ticker */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'rgba(13,13,11,0.7)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', background: 'rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.15)', flexShrink: 0 }}>
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.3em', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>Live</span>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="ticker-track">
                {[...Array(3)].flatMap(() => ['Kokapet ▲ 8.2%  ·  ', 'Gachibowli ₹7,960/sqft  ·  ', 'Narsingi ▲ 9.1%  ·  ', 'Jubilee Hills ₹16,800/sqft  ·  ', 'Tellapur ▲ 11.4%  ·  ']).map((item, i) => (
                  <span key={i} style={{ fontSize: '11px', color: item.includes('▲') ? '#4ade80' : 'rgba(250,248,243,0.3)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', padding: '0 14px' }}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURED ─── */}
        <section style={{ background: 'var(--cream)', padding: '4rem 0 2rem' }}>
          <div className="container">
            <div className="sr" style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Curated for you</span>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
            </div>
            <h2 className="sr" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em', textAlign: 'center', marginBottom: '3rem' }}>
              Featured residences
            </h2>
          </div>
          {top3.length > 0 && <PinnedShowcase properties={top3} />}
        </section>

        {/* ─── LOCALITIES ─── */}
        <div style={{ background: '#000' }}>
          <div style={{ background: 'var(--charcoal)', padding: '4rem 0 3rem', textAlign: 'center' }}>
            <div className="container">
              <div className="sr" style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Prime localities</span>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h2 className="sr" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 300, color: '#FAF8F3', letterSpacing: '-0.01em' }}>
                Where would you like to live?
              </h2>
            </div>
          </div>
          <LocalityImmersion />
        </div>

        {/* ─── MANIFESTO ─── */}
        <section style={{ padding: 'clamp(4rem, 8vw, 9rem) 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
          <div className="container" style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div className="sr" style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '3rem' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Our philosophy</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />
            </div>
            <WordReveal text="Not just a listing. A curated life." className="manifesto-headline" />
            <div style={{ marginTop: '2.5rem' }}>
              <WordReveal text="Every property on Aureve is handpicked, RERA verified, and presented with complete transparency. We obsess over quality so you can make the most important decision of your life with confidence." className="manifesto-body" />
            </div>
            <div className="sr" style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {[{ icon: '✓', label: 'RERA verified' }, { icon: '◎', label: 'Zero brokerage' }, { icon: '⚡', label: 'Direct connect' }, { icon: '◈', label: 'Market data' }].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>{f.icon}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(250,248,243,0.35)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section style={{ background: 'var(--charcoal)', padding: '4rem 0', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {[
                { target: totalProperties, label: 'Verified listings', suffix: '+' },
                { target: 14,              label: 'Prime localities'              },
                { target: totalUsers,      label: 'Homes found',      suffix: '+' },
                { target: 98,              label: 'RERA certified',   suffix: '%' },
              ].map((s, i) => (
                <div key={s.label} className="sr" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--gold)', fontWeight: 300, lineHeight: 1, marginBottom: '8px' }}>
                    <AnimatedCounter target={s.target} suffix={s.suffix || ''} />
                  </div>
                  <div style={{ width: '24px', height: '1px', background: 'rgba(201,168,76,0.3)', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.35)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section style={{ position: 'relative', height: '90vh', minHeight: '500px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,11,0.78)' }} />
          </div>
          <div className="sr" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Begin your search</span>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              Your perfect home<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.45)' }}>is one search away</em>
            </h2>
            <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, marginBottom: '3rem' }}>
              {totalProperties}+ properties · 14 localities · Zero brokerage
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/properties" style={{ padding: '15px 36px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase', boxShadow: '0 8px 40px rgba(201,168,76,0.3)' }}>
                Browse all properties
              </Link>
              <Link href="/auth/signup" style={{ padding: '15px 32px', background: 'transparent', border: '1px solid rgba(250,248,243,0.18)', color: 'rgba(250,248,243,0.65)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Create free account
              </Link>
            </div>
          </div>
        </section>

        {/* ─── STRUCTA STRIP ─── */}
        <div style={{ background: '#0A1018', padding: '1.75rem 0', borderTop: '1px solid rgba(224,123,57,0.08)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 300, color: '#fff', letterSpacing: '0.05em' }}>Structa</span>
              <div style={{ width: '1px', height: '14px', background: 'rgba(224,123,57,0.3)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(247,247,246,0.3)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>Live material prices · Cost calculator</span>
            </div>
            <a href="https://structa-hyderabad.vercel.app" target="_blank" style={{ fontSize: '11px', fontWeight: 600, color: '#E07B39', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(224,123,57,0.25)', padding: '8px 16px', borderRadius: '2px' }}>
              Explore →
            </a>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: 'var(--charcoal)', padding: 'clamp(3rem, 6vw, 5rem) 0 2.5rem', borderTop: '1px solid rgba(250,248,243,0.04)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#FAF8F3', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Aureve</div>
                <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.28)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.9, maxWidth: '240px', marginBottom: '1.75rem', fontWeight: 300 }}>
                  Hyderabad's most trusted premium real estate platform.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['IG', 'LI', 'YT'].map(s => (
                    <a key={s} href="#" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(250,248,243,0.07)', borderRadius: '50%', color: 'rgba(250,248,243,0.28)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '10px' }}>{s}</a>
                  ))}
                </div>
              </div>
              {[
                { title: 'Explore',    links: ['Buy a home', 'Rent', 'New launches', 'Premium', 'Plots'] },
                { title: 'Localities', links: ['Kokapet', 'Narsingi', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills'] },
                { title: 'Company',    links: ['About', 'For builders', 'Blog', 'Contact', 'Careers'] },
              ].map(col => (
                <div key={col.title}>
                  <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>{col.title}</h5>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(250,248,243,0.25)', marginBottom: '10px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>{link}</a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(250,248,243,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ fontSize: '11px', color: 'rgba(250,248,243,0.12)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>© {new Date().getFullYear()} Aureve Realty Pvt. Ltd.</p>
              <div style={{ display: 'flex', gap: '24px' }}>
                {['Privacy', 'Terms', 'RERA'].map(l => (
                  <a key={l} href="#" style={{ fontSize: '11px', color: 'rgba(250,248,243,0.12)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
