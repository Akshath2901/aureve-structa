'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=90',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1400&q=90',
  'https://images.unsplash.com/photo-1600047508788-786f3865b880?w=1400&q=90',
  'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1400&q=90',
]

// Custom cursor
function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos  = useRef({ x: -100, y: -100 })
  const rpos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) { dot.current.style.left = `${e.clientX}px`; dot.current.style.top = `${e.clientY}px` }
    }
    const raf = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.09
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.09
      if (ring.current) { ring.current.style.left = `${rpos.current.x}px`; ring.current.style.top = `${rpos.current.y}px` }
      requestAnimationFrame(raf)
    }
    window.addEventListener('mousemove', move, { passive: true })
    requestAnimationFrame(raf)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div ref={dot} style={{ position: 'fixed', width: '5px', height: '5px', background: '#C9A84C', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9999 }} />
      <div ref={ring} style={{ position: 'fixed', width: '32px', height: '32px', border: '1px solid rgba(201,168,76,0.6)', borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9998, transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
    </>
  )
}

// Gallery
function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive]   = useState(0)
  const [lightbox, setLight]  = useState(false)
  const [loaded, setLoaded]   = useState(false)
  const [direction, setDir]   = useState<'left'|'right'>('right')

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const go = (dir: 'left'|'right') => {
    setDir(dir)
    setActive(a => dir === 'right' ? (a + 1) % images.length : (a - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main gallery */}
      <div style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>

        {/* Hero image */}
        <div style={{ position: 'relative', height: '560px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLight(true)}>
          {images.map((img, i) => (
            <img key={i} src={img} alt={title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === active ? 1 : 0, transform: i === active ? 'scale(1)' : 'scale(1.03)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
          ))}

          {/* Bottom gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(26,26,22,0.5), transparent)' }} />

          {/* Nav arrows */}
          {images.length > 1 && ['left','right'].map(dir => (
            <button key={dir} onClick={e => { e.stopPropagation(); go(dir as any) }}
              style={{ position: 'absolute', top: '50%', [dir === 'left' ? 'left' : 'right']: '20px', transform: 'translateY(-50%)', width: '48px', height: '48px', background: 'rgba(250,248,243,0.92)', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(26,26,22,0.2)', transition: 'all 0.25s', color: '#1A1A16', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(250,248,243,0.92)'; (e.currentTarget as HTMLElement).style.color = '#1A1A16' }}>
              {dir === 'left' ? '‹' : '›'}
            </button>
          ))}

          {/* Counter */}
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(26,26,22,0.7)', color: 'rgba(250,248,243,0.8)', padding: '6px 14px', borderRadius: '2px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', backdropFilter: 'blur(8px)' }}>
            {String(active + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')} · Click to expand
          </div>

          {/* Zoom indicator */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(250,248,243,0.6)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: '14px' }}>⊕</span> Tap to expand
          </div>
        </div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '6px', padding: '6px', background: 'rgba(26,26,22,0.04)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setActive(i)}
              style={{ width: '80px', height: '56px', flexShrink: 0, borderRadius: '2px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${active === i ? '#C9A84C' : 'transparent'}`, opacity: active === i ? 1 : 0.55, transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', transform: active === i ? 'scale(1.04)' : 'scale(1)' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLight(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,8,0.97)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <button onClick={() => setLight(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(250,248,243,0.08)', border: '1px solid rgba(250,248,243,0.1)', color: '#FAF8F3', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            ×
          </button>

          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); go('left') }}
                style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,248,243,0.06)', border: '1px solid rgba(250,248,243,0.1)', color: '#FAF8F3', width: '54px', height: '54px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={e => { e.stopPropagation(); go('right') }}
                style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,248,243,0.06)', border: '1px solid rgba(250,248,243,0.1)', color: '#FAF8F3', width: '54px', height: '54px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </>
          )}

          <img src={images[active]} alt="" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '2px' }} />

          {/* Dot nav */}
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {images.map((_,i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setActive(i) }}
                style={{ width: i === active ? '24px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? '#C9A84C' : 'rgba(250,248,243,0.2)', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)' }} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Enquiry form
function EnquiryForm({ propertyId, propertyTitle, price, listingType }: { propertyId: string; propertyTitle: string; price: number; listingType: string }) {
  const [step, setStep]       = useState<'form'|'success'>('form')
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [intent, setIntent]   = useState('visit')
  const [loading, setLoading] = useState(false)

  function formatPrice(paise: number, listingType?: string): string {
    const r = paise / 100
    if (listingType === 'rent') return `₹${Math.round(r / 1000).toLocaleString('en-IN')}k/mo`
    if (r >= 10000000) return `₹${(r / 10000000).toFixed(2)} Cr`
    if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
    return `₹${r.toLocaleString('en-IN')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000)) // Simulate API
    // In production: POST to /api/enquiry
    setStep('success')
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1px solid rgba(26,26,22,0.1)',
    borderRadius: '2px', fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    background: '#fff', color: 'var(--charcoal)',
    transition: 'border-color 0.2s',
  }

  if (step === 'success') return (
    <div style={{ padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', border: '1px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', color: 'var(--gold)' }}>✓</div>
      <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '8px' }}>Enquiry received</h4>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, marginBottom: '1.5rem', fontWeight: 300 }}>
        Our team will contact you within 2 hours with more details about this property.
      </p>
      <button onClick={() => setStep('form')} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textDecoration: 'underline' }}>
        Submit another enquiry
      </button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '1.75rem 1.75rem 0' }}>
        {/* Price */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
            {formatPrice(price, listingType)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
            Starting price · Negotiate directly
          </div>
        </div>

        {/* Intent selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
          {[
            { v: 'visit',    l: 'Site visit' },
            { v: 'call',     l: 'Call me'    },
            { v: 'brochure', l: 'Brochure'   },
          ].map(({v,l}) => (
            <button key={v} type="button" onClick={() => setIntent(v)}
              style={{ flex: 1, padding: '9px 6px', border: `1px solid ${intent === v ? 'var(--charcoal)' : 'rgba(26,26,22,0.1)'}`, borderRadius: '2px', background: intent === v ? 'var(--charcoal)' : 'transparent', color: intent === v ? '#FAF8F3' : 'var(--text-muted)', fontSize: '11px', fontWeight: intent === v ? 600 : 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em', transition: 'all 0.25s' }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
          <input type="text"    placeholder="Your full name *"    value={name}    onChange={e => setName(e.target.value)}    required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.1)'} />
          <input type="tel"     placeholder="+91 98765 43210 *"  value={phone}   onChange={e => setPhone(e.target.value)}   required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.1)'} />
          <input type="email"   placeholder="your@email.com"     value={email}   onChange={e => setEmail(e.target.value)}            style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.1)'} />
          {intent === 'visit' && (
            <textarea placeholder="Preferred date and time for site visit..." value={message} onChange={e => setMessage(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.1)'} />
          )}
        </div>

        <button type="submit" disabled={loading || !name || !phone}
          style={{ width: '100%', padding: '14px', background: loading || !name || !phone ? 'rgba(26,26,22,0.08)' : 'var(--charcoal)', color: loading || !name || !phone ? 'var(--text-muted)' : '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: !name || !phone ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px', transition: 'all 0.3s' }}
          onMouseEnter={e => { if (name && phone && !loading) (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
          onMouseLeave={e => { if (name && phone && !loading) (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)' }}>
          {loading ? 'Sending...' : intent === 'brochure' ? 'Download brochure' : intent === 'call' ? 'Request callback' : 'Schedule site visit'}
        </button>

        <a href={`https://wa.me/919876543210?text=Hi, I'm interested in ${encodeURIComponent(propertyTitle)}.`}
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '2px', fontSize: '12px', fontWeight: 500, color: '#15803d', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', marginBottom: '1.25rem' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.14)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.08)'}>
          💬 Connect on WhatsApp
        </a>
      </div>

      <div style={{ padding: '1rem 1.75rem', background: 'var(--cream)', borderTop: '1px solid rgba(26,26,22,0.05)' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', justifyContent: 'center' }}>
          <span>🔒 100% secure</span>
          <span>·</span>
          <span>Zero brokerage</span>
          <span>·</span>
          <span>Direct builder connect</span>
        </div>
      </div>
    </form>
  )
}

// Scroll reveal
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    const io  = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = Number((e.target as HTMLElement).dataset.delay || 0)
          setTimeout(() => e.target.classList.add('rv-done'), delay)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

// Main
export function PropertyDetailClient({ property, similar, insight }: {
  property: any
  similar: any[]
  insight: any
}) {
  const [ready, setReady] = useState(false)
  useReveal()

  useEffect(() => { setTimeout(() => setReady(true), 100) }, [])

  const images = property.property_images?.length > 0
    ? property.property_images.map((img: any) => img.url)
    : [property.thumbnail_url, ...FALLBACK_IMAGES.slice(0, 4)].filter(Boolean)

  function formatPrice(paise: number, listingType?: string): string {
    const r = paise / 100
    if (listingType === 'rent') return `₹${Math.round(r / 1000).toLocaleString('en-IN')}k/mo`
    if (r >= 10000000) return `₹${(r / 10000000).toFixed(2)} Cr`
    if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
    return `₹${r.toLocaleString('en-IN')}`
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: '72px', cursor: 'none' }}>
      <Cursor />

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(26,26,22,0.06)', padding: '0.875rem 0', opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)' }}>
          {[
            { label: 'Home',              href: '/' },
            { label: 'Properties',        href: '/properties' },
            { label: property.locality,   href: `/properties?locality=${property.locality}` },
            { label: property.title,      href: null },
          ].map((item, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <span style={{ color: 'rgba(26,26,22,0.2)' }}>›</span>}
              {item.href
                ? <Link href={item.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold-dark)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                    {item.label}
                  </Link>
                : <span style={{ color: 'var(--charcoal)', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              }
            </span>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'flex-start' }}>

          {/* ─── LEFT ─── */}
          <div>

            {/* Gallery */}
            <div className="rv">
              <Gallery images={images} title={property.title} />
            </div>

            {/* Header */}
            <div className="rv" style={{ marginTop: '2.5rem', marginBottom: '2rem' }} data-delay="100">
              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {property.is_premium  && <span style={{ fontSize: '9px', fontWeight: 700, background: 'var(--charcoal)', color: '#F4DFA0', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.12em', fontFamily: 'DM Sans, sans-serif' }}>✦ PREMIUM</span>}
                {property.is_featured && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(201,168,76,0.12)', color: 'var(--gold-dark)', padding: '4px 10px', borderRadius: '2px', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(201,168,76,0.25)' }}>FEATURED</span>}
                {property.rera_number && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(21,128,61,0.08)', color: '#15803d', padding: '4px 10px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(21,128,61,0.15)' }}>✓ RERA Registered</span>}
                {property.oc_received && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(29,158,117,0.08)', color: '#085041', padding: '4px 10px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(29,158,117,0.15)' }}>OC Received</span>}
                {property.status === 'under_construction' && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(83,74,183,0.08)', color: '#534AB7', padding: '4px 10px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>Under Construction</span>}
              </div>

              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
                  {property.locality} · {property.city}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.08, marginBottom: '1rem', letterSpacing: '-0.01em' }}>
                {property.title}
              </h1>

              {/* Address */}
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '8px' }}>●</span>
                {property.address}, {property.locality}, {property.city}
              </p>
            </div>

            {/* Price + CTA row */}
            <div className="rv" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '2rem', borderBottom: '1px solid rgba(26,26,22,0.07)', marginBottom: '2rem' }} data-delay="150">
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
                  {formatPrice(property.price, property.listing_type)}
                </div>
                {property.price_per_sqft && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                    ₹{property.price_per_sqft.toLocaleString('en-IN')}/sqft
                    {property.is_negotiable && <span style={{ marginLeft: '8px', color: 'var(--gold-dark)', fontWeight: 500 }}>· Negotiable</span>}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/property/${property.slug}/brochure`} target="_blank"
                  style={{ padding: '12px 20px', border: '1px solid rgba(26,26,22,0.15)', color: 'var(--charcoal)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '7px' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold-dark)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.15)'; el.style.color = 'var(--charcoal)' }}>
                  ↓ Brochure
                </Link>
                <button onClick={() => document.getElementById('enquiry-panel')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ padding: '12px 24px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.25s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#C9A84C'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)'}>
                  Enquire now →
                </button>
              </div>
            </div>

            {/* Key specs */}
            <div className="rv" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginBottom: '2.5rem', background: 'rgba(26,26,22,0.07)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.07)' }} data-delay="200">
              {[
                { icon: '🛏', label: 'Bedrooms',    value: property.bedrooms ? `${property.bedrooms} BHK` : '—' },
                { icon: '🚿', label: 'Bathrooms',   value: property.bathrooms ? `${property.bathrooms}` : '—' },
                { icon: '📐', label: 'Carpet area', value: property.carpet_area ? `${property.carpet_area.toLocaleString('en-IN')} sqft` : '—' },
                { icon: '🏢', label: 'Built-up',    value: property.built_up_area ? `${property.built_up_area.toLocaleString('en-IN')} sqft` : '—' },
              ].map((s, i) => (
                <div key={s.label} style={{ background: '#fff', padding: '1.5rem', textAlign: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div className="rv" style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem' }} data-delay="250">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>About this property</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.85, fontWeight: 300 }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Property details */}
            <div className="rv" style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem' }} data-delay="300">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>Property details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'Type',         value: property.property_type },
                  { label: 'Transaction',  value: property.listing_type === 'sale' ? 'For sale' : 'For rent' },
                  { label: 'Status',       value: property.status?.replace('_',' ') },
                  { label: 'Total floors', value: property.total_floors ? `${property.total_floors} floors` : '—' },
                  { label: 'Possession',   value: property.possession_date ? new Date(property.possession_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Ready to move' },
                  { label: 'RERA',         value: property.rera_number || 'Not applicable' },
                  { label: 'OC received',  value: property.oc_received ? 'Yes' : 'No' },
                  { label: 'Negotiable',   value: property.is_negotiable ? 'Yes' : 'No' },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: 'var(--cream)', borderRadius: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', width: '100px', flexShrink: 0 }}>{d.label}</span>
                    <span style={{ fontSize: '13px', color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', fontWeight: 400, textTransform: 'capitalize' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {property.property_amenities?.length > 0 && (
              <div className="rv" style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem' }} data-delay="350">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)' }}>Amenities</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {property.property_amenities.map((a: any) => (
                    <span key={a.id} style={{ fontSize: '12px', padding: '6px 14px', background: 'var(--cream)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(201,168,76,0.08)'; el.style.color = 'var(--gold-dark)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--cream)'; el.style.color = 'var(--text-secondary)' }}>
                      {a.amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Locality insight */}
            {insight && (
              <div className="rv" style={{ background: 'var(--charcoal)', borderRadius: '4px', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }} data-delay="400">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '8rem', fontWeight: 300, color: 'rgba(201,168,76,0.05)', lineHeight: 1, userSelect: 'none' }}>
                  {property.locality.split(' ')[0]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                  <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: '#FAF8F3' }}>{property.locality} — Market insight</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(250,248,243,0.06)', borderRadius: '2px', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                  {[
                    { label: 'Avg price/sqft',      value: `₹${insight.avg_price_per_sqft?.toLocaleString('en-IN')}` },
                    { label: 'Annual appreciation', value: `+${insight.price_trend_pct}%` },
                    { label: 'Growth score',        value: `${insight.growth_score}/100` },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', padding: '1.5rem 1rem', background: 'rgba(250,248,243,0.03)' }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--gold)', fontWeight: 300, marginBottom: '6px' }}>{s.value}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(250,248,243,0.35)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar properties */}
            {similar?.length > 0 && (
              <div className="rv" data-delay="450">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: 'var(--charcoal)' }}>Similar in {property.locality}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {similar.map((s: any) => (
                    <Link key={s.id} href={`/property/${s.slug}`}
                      style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.07)', textDecoration: 'none', display: 'block', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 36px rgba(26,26,22,0.12)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                      <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                        <img src={s.thumbnail_url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.55), transparent 50%)' }} />
                        <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#FAF8F3', fontWeight: 300 }}>
                          {formatPrice(s.price, s.listing_type)}
                        </div>
                      </div>
                      <div style={{ padding: '0.875rem 1rem' }}>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.bedrooms ? `${s.bedrooms} BHK · ` : ''}{s.locality}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT — Sticky enquiry ─── */}
          <div style={{ position: 'sticky', top: '5rem' }}>
            <div id="enquiry-panel" style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 48px rgba(26,26,22,0.1)', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), var(--gold-dark))' }} />
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>Request information</h4>
              </div>
              <EnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                price={property.price}
                listingType={property.listing_type}
              />
            </div>

            {/* Brochure card */}
            <Link href={`/property/${property.slug}/brochure`} target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '1rem', padding: '1.25rem 1.5rem', background: 'var(--charcoal)', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s', border: '1px solid rgba(201,168,76,0.15)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)' }}>
              <div style={{ width: '40px', height: '40px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0 }}>↓</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FAF8F3', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', marginBottom: '3px' }}>Download brochure</div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>Full specs · Floor plan · RERA details</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .rv { opacity:0; transform:translateY(24px); transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); }
        .rv.rv-done { opacity:1; transform:translateY(0); }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  )
}
