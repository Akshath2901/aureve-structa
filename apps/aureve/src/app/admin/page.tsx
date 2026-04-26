'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }: { target: number, prefix?: string, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, started])

  return <div ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</div>
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ users: 0, properties: 0, enquiries: 0, localities: 0 })
  const [roleBreakdown, setRoleBreakdown] = useState<Record<string, number>>({})
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState('')

  const revenueData = [0,0,0,0,0,0,0,0,0,0,0,0]

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const [
        { count: userCount },
        { count: propCount },
        { count: enqCount },
        { count: locCount },
        { data: profiles },
        { data: recentU },
        { data: recentE },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('property_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('locality_insights').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('role'),
        supabase.from('profiles').select('full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('property_enquiries').select('name, phone, created_at, properties(title, locality)').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ users: userCount || 0, properties: propCount || 0, enquiries: enqCount || 0, localities: locCount || 0 })
      const breakdown: Record<string, number> = {}
      profiles?.forEach((p: any) => { breakdown[p.role] = (breakdown[p.role] || 0) + 1 })
      setRoleBreakdown(breakdown)
      setRecentUsers(recentU || [])
      setRecentEnquiries(recentE || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const KPIS = [
    { label: 'Total users',     value: stats.users,      color: '#C9A84C', change: 'All time' },
    { label: 'Active listings', value: stats.properties, color: '#1A1A16', change: 'Live now' },
    { label: 'Enquiries',       value: stats.enquiries,  color: '#C9A84C', change: 'All time' },
    { label: 'MRR',             value: 0,                color: '#1A1A16', change: 'Pre-launch', prefix: '₹' },
  ]

  const ROLE_COLORS: Record<string, string> = {
    buyer: '#C9A84C', seller: '#8B7355', agent: '#866820', builder: '#5C4A1E', admin: '#1A1A16',
  }

  return (
    <div style={{ padding: '2.5rem', background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1D9E75', fontFamily: 'DM Sans, sans-serif' }}>
              Live · All systems operational
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px', lineHeight: 1 }}>
            Super Admin
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Aureve + Structa · Hyderabad</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--gold)', letterSpacing: '0.05em', lineHeight: 1 }}>{time}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'DM Sans, sans-serif' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {KPIS.map((kpi, i) => (
          <div key={kpi.label} style={{
            background: i % 2 === 0 ? '#fff' : 'var(--charcoal)',
            border: '1px solid',
            borderColor: i % 2 === 0 ? 'rgba(26,26,22,0.08)' : 'transparent',
            borderRadius: '16px', padding: '1.75rem',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(26,26,22,0.06)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, var(--gold), transparent)` }} />
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: i % 2 === 0 ? 'var(--text-muted)' : 'rgba(250,248,243,0.5)', fontFamily: 'DM Sans, sans-serif', marginBottom: '12px' }}>
              {kpi.label}
            </p>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 400, color: 'var(--gold)', lineHeight: 1, marginBottom: '8px' }}>
              {loading ? '—' : <AnimatedCounter target={kpi.value} prefix={kpi.prefix || ''} />}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', background: 'rgba(201,168,76,0.12)', color: 'var(--gold-dark)', padding: '2px 8px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif' }}>
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Platform split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Aureve card */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,26,22,0.06)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Aureve</p>
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--charcoal)' }}>Real Estate Platform</h3>
            </div>
            <Link href="/admin/aureve" style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', borderRadius: '4px' }}>
              VIEW →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
            {[
              { label: 'Users',      value: stats.users },
              { label: 'Listings',   value: stats.properties },
              { label: 'Enquiries',  value: stats.enquiries },
              { label: 'Localities', value: stats.localities },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--cream)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(26,26,22,0.05)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--charcoal)', lineHeight: 1, marginBottom: '3px' }}>
                  {loading ? '—' : <AnimatedCounter target={s.value} />}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Role breakdown */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>User breakdown</p>
            {Object.entries(roleBreakdown).map(([role, count]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '60px', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>{role}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(26,26,22,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--gold)', borderRadius: '2px', width: `${(count / stats.users) * 100}%`, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, width: '20px', textAlign: 'right', fontFamily: 'DM Sans, sans-serif' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Structa card */}
        <div style={{ background: 'var(--charcoal)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,26,22,0.12)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Structa</p>
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#FAF8F3' }}>Construction Intelligence</h3>
            </div>
            <Link href="/admin/structa" style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em', border: '1px solid rgba(201,168,76,0.3)', padding: '4px 10px', borderRadius: '4px' }}>
              VIEW →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
            {[
              { label: 'Materials tracked', value: 10 },
              { label: 'Suppliers',         value: 4  },
              { label: 'Calculator uses',   value: 0  },
              { label: 'Quote requests',    value: 0  },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(250,248,243,0.06)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--gold-light)', lineHeight: 1, marginBottom: '3px' }}>
                  <AnimatedCounter target={s.value} />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live prices */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Live prices</p>
            {[
              { name: 'Cement 53G',  price: '₹370/bag', up: false, change: '-2.1%' },
              { name: 'TMT Steel',   price: '₹67/kg',   up: true,  change: '+1.8%' },
              { name: 'M-Sand',      price: '₹52/cft',  up: true,  change: '+3.2%' },
              { name: 'Aggregate',   price: '₹44/cft',  up: false, change: '-0.5%' },
            ].map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(250,248,243,0.06)' }}>
                <span style={{ fontSize: '12px', color: 'rgba(250,248,243,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{m.name}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#FAF8F3', fontFamily: 'DM Sans, sans-serif' }}>{m.price}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: m.up ? '#1D9E75' : '#C9A84C', fontFamily: 'DM Sans, sans-serif' }}>
                    {m.up ? '▲' : '▼'} {m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(26,26,22,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Revenue trajectory</p>
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--charcoal)' }}>Monthly Recurring Revenue — 2026</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--charcoal)' }}>₹0</div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Pre-revenue · Launch ready</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
          {revenueData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                background: i === new Date().getMonth()
                  ? 'linear-gradient(to top, var(--gold-dark), var(--gold))'
                  : 'rgba(201,168,76,0.15)',
                height: '8px',
                transition: 'height 1s cubic-bezier(0.16,1,0.3,1)',
              }} />
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                {MONTHS[i]}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(201,168,76,0.05)', borderRadius: '10px', border: '1px solid rgba(201,168,76,0.15)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
            💡 With 10 builders on Basic plan: <strong style={{ color: 'var(--gold-dark)' }}>₹29,990 MRR</strong> · 10 on Pro: <strong style={{ color: 'var(--gold-dark)' }}>₹79,990 MRR</strong> · Target Year 1: <strong style={{ color: 'var(--charcoal)' }}>₹5L+ MRR</strong>
          </p>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Recent users */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,26,22,0.06)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>Recent users</h3>
            </div>
            <Link href="/admin/users" style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>VIEW ALL →</Link>
          </div>
          <div style={{ padding: '0.75rem' }}>
            {recentUsers.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: i % 2 === 0 ? 'var(--cream)' : '#fff', borderRadius: '8px', marginBottom: '4px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--gold-dark)', flexShrink: 0 }}>
                  {u.full_name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '1px' }}>{u.full_name}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                    {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-dark)', padding: '2px 6px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif' }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent enquiries */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,26,22,0.06)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>Recent enquiries</h3>
            </div>
            <Link href="/admin/enquiries" style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>VIEW ALL →</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(26,26,22,0.2)', marginBottom: '6px' }}>No enquiries yet</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Enquiries will appear here in real time</p>
            </div>
          ) : (
            <div style={{ padding: '0.75rem' }}>
              {recentEnquiries.map((e: any, i) => (
                <div key={i} style={{ padding: '10px', background: i % 2 === 0 ? 'var(--cream)' : '#fff', borderRadius: '8px', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif' }}>{e.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                      {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                    {e.properties?.title} · {e.properties?.locality}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {[
          { icon: '◎', label: 'All users',       href: '/admin/users',    desc: 'View & manage' },
          { icon: '⊞', label: 'Listings',         href: '/admin/listings', desc: 'Approve & feature' },
          { icon: '💰', label: 'Revenue',          href: '/admin/revenue',  desc: 'Billing overview' },
          { icon: '📢', label: 'Broadcast',        href: '/admin/comms',    desc: 'WhatsApp & email' },
          { icon: '📋', label: 'Audit log',        href: '/admin/audit',    desc: 'All admin actions' },
        ].map(a => (
          <Link key={a.label} href={a.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            background: '#fff', border: '1px solid rgba(26,26,22,0.08)',
            borderRadius: '12px', padding: '1.25rem',
            textDecoration: 'none', textAlign: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(26,26,22,0.04)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,22,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'var(--gold)' }}>
              {a.icon}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{a.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
