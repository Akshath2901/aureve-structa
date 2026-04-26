'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const MRR_DATA = MONTHS.map((month, i) => ({
  month,
  aureve:  [0,0,0,0,0,0,0,0,0,0,0,0][i],
  structa: [0,0,0,0,0,0,0,0,0,0,0,0][i],
  target:  [50000,60000,75000,90000,110000,130000,160000,200000,250000,300000,380000,500000][i],
}))

const PLANS = [
  { name: 'Basic',      price: 2999,  subs: 0, color: '#C9A84C' },
  { name: 'Pro',        price: 7999,  subs: 0, color: '#8B7355' },
  { name: 'Enterprise', price: 19999, subs: 0, color: '#1A1A16' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.1)', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(26,26,22,0.1)' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif' }}>
            ₹{Number(p.value).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState({ users: 0, builders: 0, enquiries: 0 })
  const [roleData, setRoleData] = useState<any[]>([])
  const [enquiryData, setEnquiryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'revenue'|'users'|'enquiries'|'plans'>('revenue')

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const [
        { count: userCount },
        { count: builderCount },
        { count: enqCount },
        { data: profiles },
        { data: enquiries },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'builder'),
        supabase.from('property_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('role'),
        supabase.from('property_enquiries').select('created_at').order('created_at'),
      ])

      setStats({ users: userCount || 0, builders: builderCount || 0, enquiries: enqCount || 0 })

      // Role breakdown for pie chart
      const roleCount: Record<string, number> = {}
      profiles?.forEach((p: any) => { roleCount[p.role] = (roleCount[p.role] || 0) + 1 })
      setRoleData(Object.entries(roleCount).map(([name, value]) => ({ name, value })))

      // Enquiries by month
      const byMonth: Record<string, number> = {}
      enquiries?.forEach((e: any) => {
        const month = new Date(e.created_at).toLocaleString('en-IN', { month: 'short' })
        byMonth[month] = (byMonth[month] || 0) + 1
      })
      setEnquiryData(MONTHS.map(m => ({ month: m, enquiries: byMonth[m] || 0 })))

      setLoading(false)
    }
    fetchData()
  }, [])

  const ROLE_COLORS: Record<string, string> = {
    buyer: '#C9A84C', seller: '#8B7355', agent: '#866820', builder: '#5C4A1E', admin: '#1A1A16',
  }

  const totalMRR = PLANS.reduce((a, p) => a + p.price * p.subs, 0)

  return (
    <div style={{ padding: '2.5rem', background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>
          Business intelligence
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
          Analytics & Revenue
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            Platform growth · Aureve + Structa
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total MRR',       value: `₹${totalMRR.toLocaleString('en-IN')}`, sub: 'Monthly recurring',  dark: true  },
          { label: 'Total users',     value: stats.users,      sub: 'Across Aureve',    dark: false },
          { label: 'Active builders', value: stats.builders,   sub: 'On platform',      dark: false },
          { label: 'Total enquiries', value: stats.enquiries,  sub: 'All time',         dark: false },
        ].map((k, i) => (
          <div key={k.label} style={{
            background: k.dark ? 'var(--charcoal)' : '#fff',
            border: '1px solid',
            borderColor: k.dark ? 'rgba(201,168,76,0.2)' : 'rgba(26,26,22,0.08)',
            borderRadius: '16px', padding: '1.75rem',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(26,26,22,0.06)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: k.dark ? 'rgba(250,248,243,0.4)' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', marginBottom: '10px' }}>
              {k.label}
            </p>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--gold)', lineHeight: 1, marginBottom: '4px' }}>
              {k.value}
            </div>
            <p style={{ fontSize: '11px', color: k.dark ? 'rgba(250,248,243,0.3)' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
        {([
          { v: 'revenue',   l: 'Revenue growth' },
          { v: 'users',     l: 'User analytics' },
          { v: 'enquiries', l: 'Enquiry trends' },
          { v: 'plans',     l: 'Pricing plans'  },
        ] as const).map(tab => (
          <button key={tab.v} onClick={() => setActiveTab(tab.v)} style={{
            padding: '8px 18px', borderRadius: '6px', border: '1px solid', cursor: 'pointer',
            fontSize: '12px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
            borderColor: activeTab === tab.v ? 'var(--gold)' : 'rgba(26,26,22,0.1)',
            background: activeTab === tab.v ? 'rgba(201,168,76,0.08)' : '#fff',
            color: activeTab === tab.v ? 'var(--gold-dark)' : 'var(--text-secondary)',
          }}>{tab.l}</button>
        ))}
      </div>

      {/* Revenue tab */}
      {activeTab === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* MRR area chart */}
          <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>MRR trajectory</p>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)' }}>Revenue growth — 2026</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'var(--charcoal)' }}>₹0</div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Current MRR · Pre-launch</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MRR_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1A1A16" stopOpacity={0.06} />
                    <stop offset="95%" stopColor="#1A1A16" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,22,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? '₹0' : `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }} />
                <Area type="monotone" dataKey="target" stroke="#1A1A16" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#targetGrad)" name="Target" />
                <Area type="monotone" dataKey="aureve"  stroke="#C9A84C" strokeWidth={2} fill="url(#goldGrad)" name="Aureve MRR" />
                <Area type="monotone" dataKey="structa" stroke="#8B7355" strokeWidth={2} fill="url(#goldGrad)" name="Structa MRR" />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(201,168,76,0.05)', borderRadius: '10px', border: '1px solid rgba(201,168,76,0.15)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, margin: 0 }}>
                💡 Target: 10 builders on Basic = <strong style={{ color: 'var(--gold-dark)' }}>₹29,990 MRR</strong> ·
                10 on Pro = <strong style={{ color: 'var(--gold-dark)' }}>₹79,990 MRR</strong> ·
                Year 1 goal: <strong style={{ color: 'var(--charcoal)' }}>₹5L+ MRR</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Role pie chart */}
          <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Users by role</h3>
            </div>
            {loading ? (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={ROLE_COLORS[entry.name] || '#C9A84C'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [value, name]} contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.1)' }} />
                  <Legend formatter={(value) => <span style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* User growth bar */}
          <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>User growth — 2026</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHS.map((month, i) => ({
                month,
                users: i === new Date().getMonth() ? stats.users : i < new Date().getMonth() ? Math.max(0, stats.users - (new Date().getMonth() - i)) : 0,
              }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,22,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.1)' }} />
                <Bar dataKey="users" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Total users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Enquiries tab */}
      {activeTab === 'enquiries' && (
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--charcoal)' }}>Enquiry volume — 2026</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={enquiryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="enqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,22,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: '#8C8C86' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.1)' }} />
              <Area type="monotone" dataKey="enquiries" stroke="#C9A84C" strokeWidth={2} fill="url(#enqGrad)" name="Enquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${plan.color}, transparent)` }} />
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>
                {plan.name} plan
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: 'var(--charcoal)', lineHeight: 1, marginBottom: '4px' }}>
                ₹{plan.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>/month per builder</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--cream)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Active subscribers</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif' }}>{plan.subs}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--cream)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Monthly revenue</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold-dark)', fontFamily: 'Cormorant Garamond, serif' }}>₹{(plan.price * plan.subs).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--cream)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>To reach ₹1L MRR</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif' }}>{Math.ceil(100000 / plan.price)} builders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
