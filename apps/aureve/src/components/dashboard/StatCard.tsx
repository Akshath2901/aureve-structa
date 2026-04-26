'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

function AnimCounter({ target, prefix='', suffix='' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true)
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 1600, 1)
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.2 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target, started])
  return <div ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</div>
}

export function StatCard({ icon, label, value, prefix='', suffix='', color, bg, href, delay=0, sub }: {
  icon: string; label: string; value: number; prefix?: string; suffix?: string
  color: string; bg: string; href?: string; delay?: number; sub?: string
}) {
  const [hov, setHov] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setVisible(true), delay)
    }, { threshold: 0.1 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [delay])

  const inner = (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#fff' : '#fff',
        border: `1px solid ${hov ? color + '30' : 'rgba(26,26,22,0.07)'}`,
        borderRadius: '4px', padding: '1.5rem',
        position: 'relative', overflow: 'hidden',
        boxShadow: hov ? `0 12px 40px ${color}15` : '0 2px 8px rgba(26,26,22,0.04)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        cursor: href ? 'pointer' : 'default',
      }}>
      {/* Top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${color}, transparent)`, opacity: hov ? 1 : 0.4, transition: 'opacity 0.3s' }} />

      {/* Bg circle */}
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: bg, transition: 'all 0.4s', transform: hov ? 'scale(1.3)' : 'scale(1)' }} />

      <div style={{ fontSize: '1.1rem', marginBottom: '10px', position: 'relative', zIndex: 1 }}>{icon}</div>

      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: color, lineHeight: 1, marginBottom: '6px', position: 'relative', zIndex: 1 }}>
        <AnimCounter target={value} prefix={prefix} suffix={suffix} />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: sub ? '4px' : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: color, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, opacity: 0.7 }}>{sub}</div>}

      {href && (
        <div style={{ marginTop: '12px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color, fontFamily: 'DM Sans, sans-serif', opacity: hov ? 1 : 0, transition: 'opacity 0.25s' }}>
          View →
        </div>
      )}
    </div>
  )

  return href ? <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link> : inner
}
