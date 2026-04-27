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
    const observe = () => {
      const els = document.querySelectorAll('.sr')
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('sr-done') })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => io.observe(el))
      return io
    }
    const io = observe()
    return () => io.disconnect()
  }, [])
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
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
  return <div ref={ref}>{count.toLocaleString('en-IN')}{suffix}</div>
}

// Word reveal
function WordReveal({ text, style: s = {} }: { text: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', ...s }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s` }}>
          {word}
        </span>
      ))}
    </div>
  )
}

// Property Card — works on all screen sizes
function PropertyCard({ p, delay = 0, large = false }: { p: any; delay?: number; large?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={`/property/${p.slug}`}
      className="sr"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', textDecoration: 'none', borderRadius: '4px', overflow: 'hidden',
        background: '#fff', border: '1px solid rgba(26,26,22,0.07)',
        boxShadow: hov ? '0 20px 60px rgba(26,26,22,0.15)' : '0 2px 12px rgba(26,26,22,0.05)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${delay}s`,
      }}>
      <div style={{ position: 'relative', height: large ? '320px' : '220px', overflow: 'hidden' }}>
        <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.75) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: large ? '1.75rem' : '1.4rem', fontWeight: 300, color: '#FAF8F3', lineHeight: 1 }}>
            {formatPrice(p.price, p.listing_type)}
          </div>
        </div>
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {p.is_premium && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '3px 7px', borderRadius: '2px', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif' }}>✦ PREMIUM</span>}
        </div>
        {p.rera_number && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '8px', fontWeight: 700, background: 'rgba(21,128,61,0.88)', color: '#fff', padding: '3px 7px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>RERA ✓</span>}
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '16px', height: '1px', background: 'var(--gold)', flexShrink: 0 }} />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.locality}</span>
        </div>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: large ? '1.3rem' : '1.1rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.2, marginBottom: '10px' }}>{p.title}</h4>
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '10px' }} />
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
          {p.bedrooms && <span>{p.bedrooms} BHK</span>}
          {p.carpet_area && <span>{p.carpet_area.toLocaleString('en-IN')} sqft</span>}
        </div>
      </div>
    </Link>
  )
}

// Locality cards — grid always visible, no scroll pinning
function LocalityGrid({ localities }: { localities: any[] }) {
  const LOCALITY_DATA = [
    { name: 'Kokapet',       img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', price: '₹7,500', trend: '+8.2%', tag: 'Investment hotspot' },
    { name: 'Narsingi',      img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80', price: '₹6,800', trend: '+9.1%', tag: 'Fastest growing' },
    { name: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', price: '₹14,500', trend: '+4.2%', tag: 'Ultra premium' },
    { name: 'Gachibowli',    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', price: '₹7,960', trend: '+6.5%', tag: 'IT corridor' },
    { name: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', price: '₹16,800', trend: '+3.9%', tag: 'Old money' },
    { name: 'Kondapur',      img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80', price: '₹8,200', trend: '+7.3%', tag: 'Tech hub' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
      {LOCALITY_DATA.map((loc, i) => (
        <Link key={loc.name} href={`/properties?locality=${loc.name}`}
          className="sr"
          style={{
            display: 'block', position: 'relative', height: '220px',
            borderRadius: '4px', overflow: 'hidden', textDecoration: 'none',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: `${i * 0.08}s`,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.02)'; const img = el.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1.08)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1)'; const img = el.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1)' }}>
          <img src={loc.img} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.85) 0%, rgba(26,26,22,0.1) 60%)' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            <div style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>{loc.tag}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#FAF8F3', marginBottom: '6px', fontWeight: 300 }}>{loc.name}</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'rgba(250,248,243,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{loc.price}/sqft</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80', fontFamily: 'DM Sans, sans-serif', background: 'rgba(74,222,128,0.12)', padding: '2px 8px', borderRadius: '2px' }}>▲ {loc.trend}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

// Loader
function Loader({ done }: { done: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0D0D0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'all', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 8vw, 5rem)', fontWeight: 300, color: '#FAF8F3', letterSpacing: '0.3em', textTransform: 'uppercase', animation: 'loaderFadeIn 0.8s ease both', marginBottom: '2rem' }}>Aureve</div>
      <div style={{ width: '100px', height: '1px', background: 'rgba(201,168,76,0.2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(to right, #C9A84C, #F4DFA0)', animation: 'loaderLine 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both' }} />
      </div>
      <div style={{ marginTop: '1.25rem', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', fontFamily: 'DM Sans, sans-serif', animation: 'loaderFadeIn 0.8s ease 0.5s both' }}>Premium Real Estate</div>
    </div>
  )
}

const HERO_BG = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80',
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1800&q=80',
]

const TICKER = ['Kokapet ▲ 8.2%', 'Gachibowli ₹7,960/sqft', 'Narsingi ▲ 9.1%', 'Jubilee Hills ₹16,800/sqft', 'Kondapur ▲ 7.3%', 'Tellapur ▲ 11.4%', 'New: Lumina Residences, Kokapet']

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
    const fn = (e: MouseEvent) => setMouse({ x: (e.clientX / window.innerWidth - 0.5), y: (e.clientY / window.innerHeight - 0.5) })
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const top3 = featured.slice(0, 3)

  return (
    <>
      <Loader done={loaderDone} />

      <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

        {/* ─── HERO ─── */}
        <section style={{ position: 'relative', height: '100vh', minHeight: '580px', overflow: 'hidden' }}>
          {HERO_BG.map((img, i) => (
            <div key={i} style={{
              position: 'absolute', inset: '-8%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === heroSlide ? 1 : 0,
              transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px) scale(1.1)`,
              transition: i === heroSlide ? 'opacity 2s ease, transform 0.12s linear' : 'opacity 2s ease',
            }} />
          ))}

          {/* Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(13,13,11,0.93) 0%, rgba(13,13,11,0.55) 55%, rgba(13,13,11,0.2) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

          {/* Slide dots */}
          <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10, opacity: heroReady ? 1 : 0, transition: 'opacity 1.5s ease 1.2s' }}>
            {HERO_BG.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} style={{ width: '2px', height: i === heroSlide ? '40px' : '14px', background: i === heroSlide ? 'var(--gold)' : 'rgba(250,248,243,0.2)', border: 'none', cursor: 'pointer', borderRadius: '1px', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', padding: 0 }} />
            ))}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', alignItems: 'center', padding: '0 clamp(1.25rem, 8vw, 8rem)' }}>
            <div style={{ maxWidth: '640px', width: '100%' }}>
              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Premium real estate · Hyderabad</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.75rem, 9vw, 7rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '1.75rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
                Where your<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.5)' }}>next chapter</em><br />
                begins.
              </h1>

              {/* Sub */}
              <p style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: 'rgba(250,248,243,0.5)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.85, maxWidth: '420px', marginBottom: '2.5rem', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(25px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.7s' }}>
                Curated apartments, villas and plots across Hyderabad's most prestigious addresses. RERA certified. Zero brokerage.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.4s cubic-bezier(0.16,1,0.3,1) 0.9s' }}>
                <Link href="/properties" style={{ padding: '13px 28px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
                  Explore properties
                </Link>
                <Link href="/auth/signup" style={{ padding: '13px 24px', background: 'transparent', border: '1px solid rgba(250,248,243,0.2)', color: 'rgba(250,248,243,0.75)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Create account
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: 'clamp(1.25rem, 8vw, 8rem)', display: 'flex', alignItems: 'center', gap: '10px', opacity: heroReady ? 1 : 0, transition: 'opacity 1.5s ease 1.8s' }}>
            <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.7))', animation: 'float 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', fontFamily: 'DM Sans, sans-serif' }}>Scroll</span>
          </div>

          {/* Ticker */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'rgba(13,13,11,0.75)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', background: 'rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.15)', flexShrink: 0 }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', animation: 'dashPulse 2s infinite', marginRight: '6px' }} />
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>Live</span>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 35s linear infinite' }}>
                {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
                  <span key={i} style={{ fontSize: '11px', color: item.includes('▲') ? '#4ade80' : 'rgba(250,248,243,0.3)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', padding: '0 20px' }}>
                    {item} <span style={{ color: 'rgba(201,168,76,0.2)' }}>·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURED PROPERTIES ─── */}
        <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', background: 'var(--cream)' }}>
          <div className="container">
            <div className="sr" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Curated for you</span>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em' }}>
                Featured residences
              </h2>
            </div>

            {/* Featured grid — responsive */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '1.25rem' }}>
              {top3.map((p, i) => <PropertyCard key={p.id} p={p} delay={i * 0.12} large={i === 0} />)}
            </div>

            <div className="sr" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-dark)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: '3px' }}>
                View all {totalProperties} properties →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── LOCALITIES ─── */}
        <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', background: '#fff' }}>
          <div className="container">
            <div className="sr" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Prime localities</span>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--charcoal)', letterSpacing: '-0.01em' }}>
                Where would you like to live?
              </h2>
            </div>
            <LocalityGrid localities={localities} />
            <div className="sr" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/properties" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(26,26,22,0.15)', paddingBottom: '3px' }}>
                Explore all 14 localities →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section style={{ background: 'var(--charcoal)', padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)' }} />
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { target: totalProperties, label: 'Verified listings', suffix: '+' },
                { target: 14,              label: 'Prime localities' },
                { target: totalUsers,      label: 'Homes found',      suffix: '+' },
                { target: 98,              label: 'RERA certified',   suffix: '%' },
              ].map((s, i) => (
                <div key={s.label} className="sr" style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--gold)', fontWeight: 300, lineHeight: 1, marginBottom: '8px' }}>
                    <AnimatedCounter target={s.target} suffix={s.suffix || ''} />
                  </div>
                  <div style={{ width: '20px', height: '1px', background: 'rgba(201,168,76,0.3)', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '9px', color: 'rgba(250,248,243,0.3)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MANIFESTO ─── */}
        <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div className="sr" style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Our philosophy</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)' }} />
            </div>

            <WordReveal text="Not just a listing. A curated life."
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.1, letterSpacing: '-0.01em', justifyContent: 'center', marginBottom: '2rem' }} />

            <WordReveal text="Every property on Aureve is handpicked, RERA verified, and presented with complete transparency. We obsess over quality so you can make the most important decision of your life with confidence."
              style={{ fontSize: 'clamp(13px, 2.5vw, 16px)', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 1.9, justifyContent: 'center', marginBottom: '2.5rem' }} />

            <div className="sr" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[{ icon: '✓', label: 'RERA verified' }, { icon: '◎', label: 'Zero brokerage' }, { icon: '⚡', label: 'Direct connect' }, { icon: '◈', label: 'Market data' }].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section style={{ position: 'relative', height: '85vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,11,0.8)' }} />
          </div>
          <div className="sr" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem 1.25rem', width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Begin your search</span>
              <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              Your perfect home<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(250,248,243,0.4)' }}>is one search away</em>
            </h2>
            <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: 'rgba(250,248,243,0.35)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, marginBottom: '2.5rem' }}>
              {totalProperties}+ properties · 14 localities · Zero brokerage
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/properties" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
                Browse all properties
              </Link>
              <Link href="/auth/signup" style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(250,248,243,0.18)', color: 'rgba(250,248,243,0.65)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Create account
              </Link>
            </div>
          </div>
        </section>

        {/* ─── STRUCTA STRIP ─── */}
        <div style={{ background: '#0A1018', padding: '1.5rem 0', borderTop: '1px solid rgba(224,123,57,0.08)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 300, color: '#fff', letterSpacing: '0.05em' }}>Structa</span>
              <div style={{ width: '1px', height: '14px', background: 'rgba(224,123,57,0.3)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(247,247,246,0.3)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>Live material prices · Cost calculator · Verified suppliers</span>
            </div>
            <a href="https://structa-hyderabad.vercel.app" target="_blank" style={{ fontSize: '11px', fontWeight: 600, color: '#E07B39', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(224,123,57,0.25)', padding: '8px 16px', borderRadius: '2px' }}>
              Explore →
            </a>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: 'var(--charcoal)', padding: 'clamp(3rem, 6vw, 5rem) 0 2.5rem', borderTop: '1px solid rgba(250,248,243,0.04)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#FAF8F3', letterSpacing: '0.05em', marginBottom: '1rem' }}>Aureve</div>
                <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.25)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.9, maxWidth: '240px', marginBottom: '1.5rem', fontWeight: 300 }}>
                  Hyderabad's most trusted premium real estate platform.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['IG', 'LI', 'YT'].map(s => (
                    <a key={s} href="#" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(250,248,243,0.07)', borderRadius: '50%', color: 'rgba(250,248,243,0.25)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '10px' }}>{s}</a>
                  ))}
                </div>
              </div>
              {[
                { title: 'Explore',    links: ['Buy a home', 'Rent', 'New launches', 'Premium', 'Plots'] },
                { title: 'Localities', links: ['Kokapet', 'Narsingi', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills'] },
                { title: 'Company',    links: ['About', 'For builders', 'Blog', 'Contact'] },
              ].map(col => (
                <div key={col.title}>
                  <h5 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem', fontFamily: 'DM Sans, sans-serif' }}>{col.title}</h5>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(250,248,243,0.22)', marginBottom: '9px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>{link}</a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(250,248,243,0.05)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ fontSize: '11px', color: 'rgba(250,248,243,0.12)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>© {new Date().getFullYear()} Aureve Realty Pvt. Ltd.</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                {['Privacy', 'Terms', 'RERA'].map(l => (
                  <a key={l} href="#" style={{ fontSize: '11px', color: 'rgba(250,248,243,0.12)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes loaderFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loaderLine   { from{width:0} to{width:100%} }
        @keyframes float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes dashPulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(26,26,22,0.15); border-radius: 2px; }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 420px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
