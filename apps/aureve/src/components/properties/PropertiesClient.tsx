'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── Helpers ────────────────────────────────────────────────────
function formatPrice(paise: number, listingType?: string): string {
  const r = paise / 100
  if (listingType === 'rent') return `₹${Math.round(r / 1000).toLocaleString('en-IN')}k/mo`
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(2)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

// ─── Custom Cursor ───────────────────────────────────────────────
function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos  = useRef({ x: -100, y: -100 })
  const rpos = useRef({ x: -100, y: -100 })
  const [label, setLabel] = useState('')

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.left = `${e.clientX}px`
        dot.current.style.top  = `${e.clientY}px`
      }
    }
    const raf = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.09
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.09
      if (ring.current) {
        ring.current.style.left = `${rpos.current.x}px`
        ring.current.style.top  = `${rpos.current.y}px`
      }
      requestAnimationFrame(raf)
    }
    window.addEventListener('mousemove', move, { passive: true })
    const id = requestAnimationFrame(raf)

    // Grow on cards
    const grow = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const isCard = target.dataset.card === 'true'
      if (ring.current) {
        ring.current.style.transform = `translate(-50%,-50%) scale(${isCard ? 3 : 1.6})`
        ring.current.style.opacity = isCard ? '0.6' : '1'
        ring.current.style.mixBlendMode = isCard ? 'difference' : 'normal'
      }
      if (isCard) setLabel('View')
    }
    const shrink = () => {
      if (ring.current) {
        ring.current.style.transform = 'translate(-50%,-50%) scale(1)'
        ring.current.style.opacity = '1'
        ring.current.style.mixBlendMode = 'normal'
      }
      setLabel('')
    }

    document.querySelectorAll('[data-card],[data-link]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(id) }
  }, [])

  return (
    <>
      <div ref={dot} style={{ position: 'fixed', width: '5px', height: '5px', background: '#C9A84C', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9999, transition: 'opacity 0.3s' }} />
      <div ref={ring} style={{ position: 'fixed', width: '36px', height: '36px', border: '1px solid rgba(201,168,76,0.7)', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9998, transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {label && <span style={{ fontSize: '7px', fontWeight: 700, color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>}
      </div>
    </>
  )
}

// ─── Scroll reveal ───────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    const io  = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = Number((e.target as HTMLElement).dataset.delay || 0)
          setTimeout(() => e.target.classList.add('rv-done'), delay)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

// ─── Property Card ───────────────────────────────────────────────
function PropertyCard({ p, index, view }: { p: any; index: number; view: 'grid' | 'list' }) {
  const [hovered, setHovered] = useState(false)

  if (view === 'list') {
    return (
      <Link href={`/property/${p.slug}`} data-card="true"
        className="rv" data-delay={index * 60}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0,
          background: '#fff', borderRadius: '4px', overflow: 'hidden',
          border: '1px solid rgba(26,26,22,0.07)', textDecoration: 'none',
          boxShadow: hovered ? '0 20px 60px rgba(26,26,22,0.14)' : '0 2px 12px rgba(26,26,22,0.05)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
          <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'}
            alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(26,26,22,0.06))' }} />
          {p.rera_number && <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '3px 8px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>RERA ✓</div>}
          {p.is_premium && <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '3px 8px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>✦ PREMIUM</div>}
        </div>
        <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
                {p.locality} · Hyderabad
              </span>
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '10px', letterSpacing: '-0.01em' }}>
              {p.title}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, marginBottom: '1.25rem', fontWeight: 300 }}>
              {p.description?.slice(0, 120)}...
            </p>
          </div>
          <div>
            <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--charcoal)', fontWeight: 300, lineHeight: 1 }}>
                  {formatPrice(p.price, p.listing_type)}
                </div>
                {p.price_per_sqft && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>₹{p.price_per_sqft.toLocaleString('en-IN')}/sqft</div>}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                {p.bedrooms    && <div><div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>Beds</div>{p.bedrooms} BHK</div>}
                {p.carpet_area && <div><div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>Area</div>{p.carpet_area.toLocaleString('en-IN')} sqft</div>}
                {p.bathrooms   && <div><div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>Bath</div>{p.bathrooms}</div>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid card
  return (
    <Link href={`/property/${p.slug}`} data-card="true"
      className="rv" data-delay={index * 60}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none', borderRadius: '4px', overflow: 'hidden',
        background: '#fff', border: '1px solid rgba(26,26,22,0.07)',
        boxShadow: hovered ? '0 24px 80px rgba(26,26,22,0.16)' : '0 2px 12px rgba(26,26,22,0.05)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>

      {/* Image */}
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
        <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'}
          alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />

        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.8) 0%, rgba(26,26,22,0.1) 45%, transparent 100%)' }} />

        {/* Hover overlay — slides up */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,22,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <div style={{ transform: hovered ? 'translateY(0)' : 'translateY(10px)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid rgba(201,168,76,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#C9A84C', fontSize: '1.2rem' }}>→</div>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.8)', fontFamily: 'DM Sans, sans-serif' }}>View property</div>
          </div>
        </div>

        {/* Price */}
        <div style={{ position: 'absolute', bottom: '14px', left: '16px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: '#FAF8F3', lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            {formatPrice(p.price, p.listing_type)}
          </div>
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '5px', flexDirection: 'column' }}>
          {p.is_premium && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(26,26,22,0.88)', color: '#F4DFA0', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', backdropFilter: 'blur(8px)' }}>✦ PREMIUM</span>}
          {p.is_featured && !p.is_premium && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(201,168,76,0.9)', color: '#fff', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif' }}>FEATURED</span>}
          {p.status === 'under_construction' && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(83,74,183,0.9)', color: '#fff', padding: '3px 8px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>UC</span>}
        </div>
        {p.rera_number && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '3px 8px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', backdropFilter: 'blur(8px)', letterSpacing: '0.08em' }}>RERA ✓</div>}

        {/* Views */}
        {p.views_count > 100 && <div style={{ position: 'absolute', bottom: '14px', right: '14px', fontSize: '10px', color: 'rgba(250,248,243,0.5)', fontFamily: 'DM Sans, sans-serif' }}>👁 {p.views_count}</div>}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)', flexShrink: 0, transition: 'width 0.3s ease' }} />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.locality}
          </span>
        </div>

        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.01em' }}>
          {p.title}
        </h4>

        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '12px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
            {p.bedrooms    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--gold)', fontSize: '8px' }}>●</span>{p.bedrooms} BHK</span>}
            {p.carpet_area && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--gold)', fontSize: '8px' }}>●</span>{p.carpet_area.toLocaleString('en-IN')} sqft</span>}
          </div>
          {p.price_per_sqft && <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>₹{p.price_per_sqft.toLocaleString('en-IN')}/sqft</span>}
        </div>

        {p.status === 'under_construction' && p.possession_date && (
          <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--gold-dark)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
            ⏱ Possession: {new Date(p.possession_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </div>
        )}
      </div>
    </Link>
  )
}

// ─── Filter Pill ─────────────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '8px 18px', borderRadius: '2px',
        border: `1px solid ${active ? 'var(--charcoal)' : hov ? 'rgba(26,26,22,0.25)' : 'rgba(26,26,22,0.12)'}`,
        background: active ? 'var(--charcoal)' : hov ? 'rgba(26,26,22,0.04)' : 'transparent',
        color: active ? '#FAF8F3' : hov ? 'var(--charcoal)' : 'var(--text-secondary)',
        fontSize: '11px', fontWeight: active ? 600 : 400,
        fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em',
        cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace: 'nowrap',
      }}>
      {label}
    </button>
  )
}

// ─── Main Shell ──────────────────────────────────────────────────
const LOCALITIES = ['Kokapet','Narsingi','Gachibowli','Kondapur','Madhapur','Banjara Hills','Jubilee Hills','Manikonda','Tellapur','Hitech City','Miyapur','Kompally','Uppal','Pocharam']

export function PropertiesShell({ properties, total, params }: {
  properties: any[]
  total: number
  params: Record<string, string | undefined>
}) {
  const router     = useRouter()
  const spRef      = useSearchParams()
  const [view, setView]       = useState<'grid'|'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchVal, setSearchVal]     = useState(params.q || '')
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useReveal()

  useEffect(() => {
    setHeroVisible(true)
  }, [])

  const updateParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(spRef.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/properties?${p.toString()}`)
  }, [router, spRef])

  const toggleParam = useCallback((key: string, value: string) => {
    const current = spRef.get(key)
    updateParam(key, current === value ? null : value)
  }, [spRef, updateParam])

  const clearAll = useCallback(() => {
    router.push('/properties')
    setSearchVal('')
  }, [router])

  const activeFilters = ['type','category','locality','beds','sort'].filter(k => spRef.get(k))

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', cursor: 'none' }}>
      <Cursor />

      {/* ─── HERO ─── */}
      <div ref={heroRef} style={{ background: 'var(--charcoal)', paddingTop: '72px', position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', alignItems: 'flex-end' }}>

        {/* Subtle background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--charcoal) 0%, rgba(26,26,22,0.95) 100%)' }} />

        {/* Animated grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: heroVisible ? 1 : 0, transition: 'opacity 1.5s ease' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '3.5rem', width: '100%' }}>
          <div style={{ maxWidth: '700px' }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateX(0)' : 'translateX(-20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
                {params.locality ? `${params.locality} · ` : 'Hyderabad · '}
                {params.type === 'rent' ? 'Rentals' : 'Properties for sale'}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.05, letterSpacing: '-0.02em', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1rem', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(25px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.35s' }}>
              {params.type === 'rent'     ? 'Homes for rent'
               : params.locality          ? `${params.locality}`
               : params.category          ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1)}s`
               : 'All properties'}
            </h1>

            <p style={{ fontSize: '14px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, opacity: heroVisible ? 1 : 0, transition: 'opacity 1.2s ease 0.5s' }}>
              {properties.length} listings shown
              <span style={{ margin: '0 10px', color: 'rgba(250,248,243,0.15)' }}>·</span>
              {total.toLocaleString('en-IN')} total on Aureve
              {activeFilters.length > 0 && (
                <span>
                  <span style={{ margin: '0 10px', color: 'rgba(250,248,243,0.15)' }}>·</span>
                  <button onClick={clearAll} style={{ color: 'rgba(201,168,76,0.7)', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, textDecoration: 'underline' }}>
                    Clear {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''}
                  </button>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Gold bottom border */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />
      </div>

      {/* ─── STICKY FILTER BAR ─── */}
      <div style={{ position: 'sticky', top: '72px', zIndex: 40, background: 'rgba(250,248,243,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(26,26,22,0.07)', boxShadow: '0 4px 24px rgba(26,26,22,0.06)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>

            {/* Search */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateParam('q', searchVal || null)}
                placeholder="Search properties..."
                style={{ padding: '9px 16px 9px 36px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: 'var(--charcoal)', width: '200px', transition: 'all 0.25s' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.12)'} />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '12px' }}>⌕</span>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            {/* Buy / Rent */}
            {[{v:'sale',l:'Buy'},{v:'rent',l:'Rent'}].map(({v,l}) => (
              <FilterPill key={v} label={l} active={params.type === v} onClick={() => toggleParam('type', v)} />
            ))}

            <div style={{ width: '1px', height: '24px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            {/* Property type */}
            {['Apartment','Villa','Plot','Commercial'].map(t => (
              <FilterPill key={t} label={t} active={params.category === t.toLowerCase()} onClick={() => toggleParam('category', t.toLowerCase())} />
            ))}

            <div style={{ width: '1px', height: '24px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            {/* BHK */}
            {[1,2,3,4].map(n => (
              <FilterPill key={n} label={`${n} BHK`} active={params.beds === String(n)} onClick={() => toggleParam('beds', String(n))} />
            ))}

            <div style={{ width: '1px', height: '24px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            {/* Locality dropdown */}
            <select value={params.locality || ''} onChange={e => updateParam('locality', e.target.value || null)}
              style={{ padding: '9px 14px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: params.locality ? 'var(--charcoal)' : '#fff', color: params.locality ? '#FAF8F3' : 'var(--text-secondary)', cursor: 'pointer', letterSpacing: '0.04em', flexShrink: 0 }}>
              <option value="">All localities</option>
              {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* Sort */}
            <select value={params.sort || ''} onChange={e => updateParam('sort', e.target.value || null)}
              style={{ padding: '9px 14px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 'auto', flexShrink: 0 }}>
              <option value="">Recommended</option>
              <option value="popular">Most viewed</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
            </select>

            <div style={{ width: '1px', height: '24px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            {/* View toggle */}
            <div style={{ display: 'flex', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
              {[{v:'grid',icon:'⊞'},{v:'list',icon:'≡'}].map(({v,icon}) => (
                <button key={v} onClick={() => setView(v as any)}
                  style={{ padding: '8px 12px', border: 'none', background: view === v ? 'var(--charcoal)' : 'transparent', color: view === v ? '#FAF8F3' : 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', paddingBottom: '10px', flexWrap: 'wrap' }}>
              {[
                params.type     && { key: 'type',     label: `For ${params.type}` },
                params.category && { key: 'category', label: params.category },
                params.locality && { key: 'locality', label: `📍 ${params.locality}` },
                params.beds     && { key: 'beds',     label: `${params.beds}+ BHK` },
                params.q        && { key: 'q',        label: `"${params.q}"` },
                params.sort     && { key: 'sort',     label: params.sort.replace('_',' ') },
              ].filter(Boolean).map((f: any) => (
                <button key={f.key} onClick={() => updateParam(f.key, null)}
                  style={{ fontSize: '10px', padding: '3px 10px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}>
                  {f.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── PROPERTIES GRID ─── */}
      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '6rem' }}>

        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5rem', color: 'rgba(26,26,22,0.08)', marginBottom: '1.5rem' }}>◎</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '10px' }}>No properties found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem', fontWeight: 300 }}>
              Try removing some filters or exploring a different locality
            </p>
            <button onClick={clearAll}
              style={{ padding: '13px 36px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Clear all filters
            </button>
          </div>
        ) : view === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {properties.map((p, i) => <PropertyCard key={p.id} p={p} index={i} view="list" />)}
          </div>
        ) : (
          <>
            {/* Featured hero card — full width */}
            {properties[0]?.is_premium && (
              <div className="rv" style={{ marginBottom: '1.5rem' }}>
                <Link href={`/property/${properties[0].slug}`} data-card="true"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '4px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', textDecoration: 'none', boxShadow: '0 4px 24px rgba(26,26,22,0.08)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 20px 60px rgba(26,26,22,0.15)'; el.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 24px rgba(26,26,22,0.08)'; el.style.transform = 'translateY(0)' }}>
                  <div style={{ position: 'relative', height: '460px', overflow: 'hidden' }}>
                    <img src={properties[0].thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'}
                      alt={properties[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(26,26,22,0.1))' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.6) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '4px 10px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px', backdropFilter: 'blur(8px)' }}>✦ PREMIUM LISTING</div>
                    {properties[0].rera_number && <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '4px 10px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>RERA ✓</div>}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: '#FAF8F3' }}>
                      {formatPrice(properties[0].price, properties[0].listing_type)}
                    </div>
                  </div>
                  <div style={{ padding: '3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                      <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
                      <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
                        {properties[0].locality} · Featured residence
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
                      {properties[0].title}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 300 }}>
                      {properties[0].description?.slice(0, 160)}...
                    </p>
                    <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2rem' }}>
                      {[
                        { l: 'Configuration', v: properties[0].bedrooms ? `${properties[0].bedrooms} BHK` : '—' },
                        { l: 'Carpet area',   v: properties[0].carpet_area ? `${properties[0].carpet_area.toLocaleString('en-IN')} sqft` : '—' },
                        { l: 'Price/sqft',    v: properties[0].price_per_sqft ? `₹${properties[0].price_per_sqft.toLocaleString('en-IN')}` : '—' },
                      ].map(s => (
                        <div key={s.l}>
                          <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>{s.l}</div>
                          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', fontWeight: 400 }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(26,26,22,0.2)', paddingBottom: '3px', width: 'fit-content', transition: 'all 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C9A84C'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--charcoal)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,26,22,0.2)' }}>
                      View full details <span>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {properties.slice(properties[0]?.is_premium ? 1 : 0).map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i + 1} view="grid" />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="rv" style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '4rem', borderTop: '1px solid rgba(26,26,22,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Looking for something specific?</span>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                Let us find it for you
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem', fontWeight: 300 }}>
                Share your requirements and our team will curate a personal selection.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/auth/signup"
                  style={{ padding: '14px 36px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.3s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)' }}>
                  Get personal curation
                </Link>
                <Link href={`https://wa.me/919876543210?text=Hi, I'm looking for a property on Aureve. Can you help?`} target="_blank"
                  style={{ padding: '14px 28px', border: '1px solid rgba(26,26,22,0.15)', color: 'var(--text-secondary)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.3s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold-dark)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.15)'; el.style.color = 'var(--text-secondary)' }}>
                  💬 WhatsApp us
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Global styles */}
      <style>{`
        .rv { opacity:0; transform:translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .rv.rv-done { opacity:1; transform:translateY(0); }
        ::-webkit-scrollbar { display: none; }
        select { -webkit-appearance: none; }
        input::placeholder { color: rgba(26,26,22,0.3); }
      `}</style>
    </div>
  )
}
