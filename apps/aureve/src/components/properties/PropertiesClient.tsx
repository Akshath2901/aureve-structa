'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function formatPrice(paise: number, listingType?: string): string {
  const r = paise / 100
  if (listingType === 'rent') return `₹${Math.round(r / 1000).toLocaleString('en-IN')}k/mo`
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(2)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(1)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

function PropertyCard({ p, index, view }: { p: any; index: number; view: 'grid' | 'list' }) {
  const [hov, setHov] = useState(false)
  const delay = `${(index % 6) * 0.08}s`

  if (view === 'list') {
    return (
      <Link href={`/property/${p.slug}`}
        className="sr card-hover"
        style={{ transitionDelay: delay, display: 'grid', gridTemplateColumns: 'min(280px, 40%) 1fr', background: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.07)', textDecoration: 'none', boxShadow: '0 2px 12px rgba(26,26,22,0.05)' }}>
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
          <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'} alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '200px' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(26,26,22,0.05))' }} />
          {p.rera_number && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '3px 7px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>RERA ✓</div>}
          {p.is_premium && <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '3px 7px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>✦ PREMIUM</div>}
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>{p.locality} · Hyderabad</span>
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '8px', letterSpacing: '-0.01em' }}>{p.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, marginBottom: '1rem', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
          </div>
          <div>
            <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: 'var(--charcoal)', fontWeight: 300, lineHeight: 1 }}>{formatPrice(p.price, p.listing_type)}</div>
                {p.price_per_sqft && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginTop: '3px' }}>₹{p.price_per_sqft.toLocaleString('en-IN')}/sqft</div>}
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                {p.bedrooms    && <div><div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>Beds</div>{p.bedrooms} BHK</div>}
                {p.carpet_area && <div><div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>Area</div>{p.carpet_area.toLocaleString('en-IN')} sqft</div>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/property/${p.slug}`}
      className="sr card-hover"
      style={{ transitionDelay: delay, display: 'block', textDecoration: 'none', borderRadius: '4px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', boxShadow: '0 2px 12px rgba(26,26,22,0.05)' }}>
      <div style={{ position: 'relative', height: 'clamp(200px, 30vw, 280px)', overflow: 'hidden' }}>
        <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.78) 0%, rgba(26,26,22,0.08) 50%, transparent 100%)' }} />

        {/* Hover overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hov ? 1 : 0, transition: 'opacity 0.35s ease' }}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
          <div style={{ width: '48px', height: '48px', border: '1px solid rgba(201,168,76,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '1.2rem', transform: hov ? 'scale(1)' : 'scale(0.8)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}>→</div>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', left: '14px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1 }}>{formatPrice(p.price, p.listing_type)}</div>
        </div>
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {p.is_premium && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(26,26,22,0.88)', color: '#F4DFA0', padding: '3px 7px', borderRadius: '2px', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif' }}>✦ PREMIUM</span>}
          {p.is_featured && !p.is_premium && <span style={{ fontSize: '8px', fontWeight: 700, background: 'rgba(201,168,76,0.9)', color: '#fff', padding: '3px 7px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif' }}>FEATURED</span>}
        </div>
        {p.rera_number && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '3px 7px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.07em' }}>RERA ✓</div>}
      </div>

      <div style={{ padding: '1rem 1.25rem' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
          <div style={{ width: '16px', height: '1px', background: 'var(--gold)', flexShrink: 0 }} />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.locality}</span>
        </div>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.2, marginBottom: '10px' }}>{p.title}</h4>
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.25), transparent)', marginBottom: '10px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
            {p.bedrooms    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--gold)', fontSize: '7px' }}>●</span>{p.bedrooms} BHK</span>}
            {p.carpet_area && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--gold)', fontSize: '7px' }}>●</span>{p.carpet_area.toLocaleString('en-IN')} sqft</span>}
          </div>
          {p.price_per_sqft && <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>₹{p.price_per_sqft.toLocaleString('en-IN')}/sqft</span>}
        </div>
      </div>
    </Link>
  )
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '8px 16px', borderRadius: '2px', border: `1px solid ${active ? 'var(--charcoal)' : hov ? 'rgba(26,26,22,0.25)' : 'rgba(26,26,22,0.12)'}`, background: active ? 'var(--charcoal)' : hov ? 'rgba(26,26,22,0.04)' : 'transparent', color: active ? '#FAF8F3' : hov ? 'var(--charcoal)' : 'var(--text-secondary)', fontSize: '11px', fontWeight: active ? 600 : 400, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  )
}

const LOCALITIES = ['Kokapet','Narsingi','Gachibowli','Kondapur','Madhapur','Banjara Hills','Jubilee Hills','Manikonda','Tellapur','Hitech City','Miyapur','Kompally','Uppal','Pocharam']

export function PropertiesShell({ properties, total, params }: { properties: any[]; total: number; params: Record<string, string | undefined> }) {
  const router  = useRouter()
  const spRef   = useSearchParams()
  const [view,      setView]      = useState<'grid'|'list'>('grid')
  const [searchVal, setSearchVal] = useState(params.q || '')
  const [heroVis,   setHeroVis]   = useState(false)

  // Hero entrance
  useState(() => { setTimeout(() => setHeroVis(true), 80) })

  const updateParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(spRef.toString())
    if (value) p.set(key, value); else p.delete(key)
    router.push(`/properties?${p.toString()}`)
  }, [router, spRef])

  const toggleParam = useCallback((key: string, value: string) => {
    updateParam(key, spRef.get(key) === value ? null : value)
  }, [spRef, updateParam])

  const clearAll = useCallback(() => { router.push('/properties'); setSearchVal('') }, [router])
  const activeFilters = ['type','category','locality','beds','sort'].filter(k => spRef.get(k))

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <div style={{ background: 'var(--charcoal)', paddingTop: '72px', position: 'relative', overflow: 'hidden', minHeight: '260px', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=50)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '2.5rem', width: '100%' }}>
          <div style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateX(0)' : 'translateX(-20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)' }} />
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
              {params.locality ? `${params.locality} · ` : 'Hyderabad · '}
              {params.type === 'rent' ? 'Rentals' : 'Properties for sale'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.05, letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 6vw, 4rem)', marginBottom: '8px', opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.35s' }}>
            {params.type === 'rent' ? 'Homes for rent' : params.locality ? params.locality : params.category ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1)}s` : 'All properties'}
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, opacity: heroVis ? 1 : 0, transition: 'opacity 1.2s ease 0.5s' }}>
            {properties.length} shown · {total.toLocaleString('en-IN')} total
            {activeFilters.length > 0 && <button onClick={clearAll} style={{ marginLeft: '10px', color: 'rgba(201,168,76,0.7)', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline' }}>Clear {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''}</button>}
          </p>
        </div>
      </div>

      {/* ─── STICKY FILTERS ─── */}
      <div style={{ position: 'sticky', top: '72px', zIndex: 40, background: 'rgba(250,248,243,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(26,26,22,0.07)', boxShadow: '0 4px 20px rgba(26,26,22,0.06)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>

            {/* Search */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateParam('q', searchVal || null)}
                placeholder="Search..."
                style={{ padding: '8px 14px 8px 32px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: 'var(--charcoal)', width: 'clamp(120px, 20vw, 200px)', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'rgba(26,26,22,0.12)'} />
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '12px' }}>⌕</span>
            </div>

            <div style={{ width: '1px', height: '20px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />
            {[{v:'sale',l:'Buy'},{v:'rent',l:'Rent'}].map(({v,l}) => (
              <FilterPill key={v} label={l} active={params.type === v} onClick={() => toggleParam('type', v)} />
            ))}
            <div style={{ width: '1px', height: '20px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />
            {['Apartment','Villa','Plot'].map(t => (
              <FilterPill key={t} label={t} active={params.category === t.toLowerCase()} onClick={() => toggleParam('category', t.toLowerCase())} />
            ))}
            <div style={{ width: '1px', height: '20px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />
            {[2,3,4].map(n => (
              <FilterPill key={n} label={`${n}BHK`} active={params.beds === String(n)} onClick={() => toggleParam('beds', String(n))} />
            ))}
            <div style={{ width: '1px', height: '20px', background: 'rgba(26,26,22,0.1)', flexShrink: 0 }} />

            <select value={params.locality || ''} onChange={e => updateParam('locality', e.target.value || null)}
              style={{ padding: '8px 12px', border: `1px solid ${params.locality ? 'var(--charcoal)' : 'rgba(26,26,22,0.12)'}`, borderRadius: '2px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: params.locality ? 'var(--charcoal)' : '#fff', color: params.locality ? '#FAF8F3' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>
              <option value="">Locality</option>
              {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <select value={params.sort || ''} onChange={e => updateParam('sort', e.target.value || null)}
              style={{ padding: '8px 12px', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 'auto', flexShrink: 0 }}>
              <option value="">Recommended</option>
              <option value="popular">Most viewed</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
            </select>

            <div style={{ display: 'flex', border: '1px solid rgba(26,26,22,0.12)', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
              {[{v:'grid',icon:'⊞'},{v:'list',icon:'≡'}].map(({v,icon}) => (
                <button key={v} onClick={() => setView(v as any)}
                  style={{ padding: '8px 11px', border: 'none', background: view === v ? 'var(--charcoal)' : 'transparent', color: view === v ? '#FAF8F3' : 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
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
                params.beds     && { key: 'beds',     label: `${params.beds} BHK` },
                params.q        && { key: 'q',        label: `"${params.q}"` },
              ].filter(Boolean).map((f: any) => (
                <button key={f.key} onClick={() => updateParam(f.key, null)}
                  style={{ fontSize: '10px', padding: '3px 9px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {f.label} <span style={{ opacity: 0.5 }}>✕</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── GRID ─── */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>

        {properties.length === 0 ? (
          <div className="sr" style={{ textAlign: 'center', padding: 'clamp(4rem, 10vw, 8rem) 2rem' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: 'rgba(26,26,22,0.08)', marginBottom: '1.5rem' }}>◎</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '8px' }}>No properties found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem', fontWeight: 300 }}>Try removing some filters</p>
            <button onClick={clearAll} style={{ padding: '13px 32px', background: 'var(--charcoal)', color: '#FAF8F3', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Clear all filters</button>
          </div>
        ) : view === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map((p, i) => <PropertyCard key={p.id} p={p} index={i} view="list" />)}
          </div>
        ) : (
          <>
            {/* Featured hero card */}
            {properties[0]?.is_premium && (
              <Link href={`/property/${properties[0].slug}`} className="sr card-hover"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', borderRadius: '4px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,26,22,0.08)', marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative', minHeight: '300px', overflow: 'hidden' }}>
                  <img src={properties[0].thumbnail_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'} alt={properties[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,22,0.65), transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(26,26,22,0.85)', color: '#F4DFA0', padding: '4px 9px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px', backdropFilter: 'blur(8px)' }}>✦ PREMIUM LISTING</div>
                  {properties[0].rera_number && <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(21,128,61,0.9)', color: '#fff', padding: '4px 9px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px' }}>RERA ✓</div>}
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 300, color: '#FAF8F3' }}>
                    {formatPrice(properties[0].price, properties[0].listing_type)}
                  </div>
                </div>
                <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ width: '28px', height: '1px', background: 'var(--gold)' }} />
                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>{properties[0].locality} · Featured</span>
                  </div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.01em' }}>{properties[0].title}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.8, marginBottom: '1.5rem', fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{properties[0].description}</p>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { l: 'Configuration', v: properties[0].bedrooms ? `${properties[0].bedrooms} BHK` : '—' },
                      { l: 'Carpet area',   v: properties[0].carpet_area ? `${properties[0].carpet_area.toLocaleString('en-IN')} sqft` : '—' },
                    ].map(s => (
                      <div key={s.l}>
                        <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px', fontFamily: 'DM Sans, sans-serif' }}>{s.l}</div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(26,26,22,0.2)', paddingBottom: '2px', width: 'fit-content' }}>
                    View full details →
                  </span>
                </div>
              </Link>
            )}

            {/* Properties grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '1.25rem' }}>
              {properties.slice(properties[0]?.is_premium ? 1 : 0).map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} view="grid" />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="sr" style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '3.5rem', borderTop: '1px solid rgba(26,26,22,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Looking for something specific?</span>
                <div style={{ width: '36px', height: '1px', background: 'var(--gold)' }} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Let us find it for you</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem', fontWeight: 300 }}>Share your requirements and our team will curate a personal selection.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/signup" style={{ padding: '13px 32px', background: 'var(--charcoal)', color: '#FAF8F3', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'background 0.25s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#C9A84C'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--charcoal)'}>
                  Get personal curation
                </Link>
                <a href="https://wa.me/919876543210" target="_blank"
                  style={{ padding: '13px 24px', border: '1px solid rgba(26,26,22,0.15)', color: 'var(--text-secondary)', borderRadius: '2px', fontSize: '11px', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold)'; el.style.color = 'var(--gold-dark)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.15)'; el.style.color = 'var(--text-secondary)' }}>
                  💬 WhatsApp us
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
