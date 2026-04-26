'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatCard } from './StatCard'

function formatPrice(paise: number): string {
  const r = paise / 100
  if (r >= 10000000) return `₹${(r / 10000000).toFixed(1)} Cr`
  if (r >= 100000)   return `₹${(r / 100000).toFixed(0)} Lac`
  return `₹${r.toLocaleString('en-IN')}`
}

export function BuyerDashboard({ profile, saved, enquiries }: { profile: any; saved: any[]; enquiries: any[] }) {
  const color = '#C9A84C'
  const MARKET = [
    { locality: 'Kokapet',      price: 7500, trend: '+8.2%', up: true  },
    { locality: 'Narsingi',     price: 6800, trend: '+9.1%', up: true  },
    { locality: 'Gachibowli',   price: 7960, trend: '+6.5%', up: true  },
    { locality: 'Banjara Hills',price: 14500,trend: '+4.2%', up: true  },
    { locality: 'Kondapur',     price: 8200, trend: '+7.3%', up: true  },
  ]

  const QUICK = [
    { icon: '🔍', label: 'Browse properties',    href: '/properties',          desc: 'Explore all listings' },
    { icon: '♡', label:  'Saved homes',          href: '/dashboard/saved',     desc: `${saved.length} saved` },
    { icon: '🧮', label: 'EMI calculator',        href: '/dashboard/emi',       desc: 'Plan your finances' },
    { icon: '🔔', label: 'Price alerts',          href: '/dashboard/alerts',    desc: 'Get notified on drops' },
  ]

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard icon="♡" label="Saved properties" value={saved.length} color={color} bg="rgba(201,168,76,0.08)" href="/dashboard/saved" delay={0} />
        <StatCard icon="✉" label="Enquiries sent" value={enquiries.length} color="var(--charcoal)" bg="rgba(26,26,22,0.05)" href="/dashboard/enquiries" delay={100} />
        <StatCard icon="🔔" label="Price alerts" value={0} color="#1D9E75" bg="rgba(29,158,117,0.08)" href="/dashboard/alerts" delay={200} />
        <StatCard icon="📈" label="Localities tracked" value={MARKET.length} color="#534AB7" bg="rgba(83,74,183,0.08)" delay={300} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Market pulse */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', animation: 'dashPulse 2s infinite' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>Hyderabad market pulse</h3>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1D9E75', fontFamily: 'DM Sans, sans-serif' }}>Live</span>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {MARKET.map((m, i) => (
              <Link key={m.locality} href={`/properties?locality=${m.locality}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '4px', marginBottom: '2px', textDecoration: 'none', background: 'transparent', transition: 'all 0.2s', animationDelay: `${i * 0.1}s` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '3px', height: '20px', background: color, borderRadius: '2px', opacity: 0.4 + (i * 0.12) }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif' }}>{m.locality}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Hyderabad</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)', fontWeight: 400 }}>₹{m.price.toLocaleString('en-IN')}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>/sqft</span></div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D9E75', fontFamily: 'DM Sans, sans-serif' }}>▲ {m.trend}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {QUICK.map((q, i) => (
            <Link key={q.label} href={q.href}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color + '40'; el.style.transform = 'translateX(4px)'; el.style.boxShadow = `0 8px 24px ${color}12` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(26,26,22,0.07)'; el.style.transform = 'translateX(0)'; el.style.boxShadow = '0 2px 8px rgba(26,26,22,0.04)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '4px', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                {q.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{q.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{q.desc}</div>
              </div>
              <span style={{ color: color, fontSize: '14px' }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Saved properties preview */}
      {saved.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.07)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '16px', height: '1px', background: color }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>Saved properties</h3>
            </div>
            <Link href="/dashboard/saved" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'rgba(26,26,22,0.04)' }}>
            {saved.slice(0, 4).map((s: any) => (
              <Link key={s.id} href={`/property/${s.properties?.slug}`}
                style={{ display: 'block', background: '#fff', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--cream)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
                <div style={{ height: '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px', background: 'var(--cream)' }}>
                  {s.properties?.thumbnail_url && <img src={s.properties.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--charcoal)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.properties?.title}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: color }}>{s.properties?.price ? formatPrice(s.properties.price) : '—'}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {saved.length === 0 && (
        <div style={{ background: 'var(--charcoal)', borderRadius: '4px', padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-3rem', right: '-2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '10rem', fontWeight: 300, color: 'rgba(201,168,76,0.05)', lineHeight: 1, userSelect: 'none' }}>A</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '30px', height: '1px', background: color }} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: color, fontFamily: 'DM Sans, sans-serif' }}>Start exploring</span>
              <div style={{ width: '30px', height: '1px', background: color }} />
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#FAF8F3', marginBottom: '8px' }}>Your dream home awaits</h3>
            <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif', fontWeight: 300, marginBottom: '2rem' }}>Browse Aureve's curated collection and save the ones that speak to you.</p>
            <Link href="/properties"
              style={{ display: 'inline-block', padding: '13px 32px', background: 'linear-gradient(135deg, #C9A84C, #866820)', color: '#fff', borderRadius: '2px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(201,168,76,0.25)' }}>
              Browse properties →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
