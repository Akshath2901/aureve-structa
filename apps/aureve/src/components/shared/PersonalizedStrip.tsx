'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const ROLE_CONFIG = {
  buyer: {
    color:   '#866820',
    accent:  '#C9A84C',
    bg:      'linear-gradient(135deg, #FAF3E0 0%, #FDF8EC 100%)',
    border:  'rgba(201,168,76,0.25)',
    label:   'Buyer',
    icon:    '🏠',
    headline: (name: string) => `Welcome back, ${name}`,
    sub: 'Your saved properties and enquiries are waiting for you.',
    actions: [
      { icon: '❤', label: 'Saved properties', href: '/dashboard/saved',     primary: false },
      { icon: '✉', label: 'My enquiries',      href: '/dashboard/enquiries', primary: false },
      { icon: '◎', label: 'Price alerts',      href: '/dashboard/alerts',    primary: false },
      { icon: '⊞', label: 'Go to dashboard',   href: '/dashboard',           primary: true  },
    ],
  },
  seller: {
    color:   '#085041',
    accent:  '#1D9E75',
    bg:      'linear-gradient(135deg, #E8F7F2 0%, #F0FAF6 100%)',
    border:  'rgba(29,158,117,0.2)',
    label:   'Seller',
    icon:    '📋',
    headline: (name: string) => `Welcome back, ${name}`,
    sub: 'Check your listing views and respond to new buyer enquiries.',
    actions: [
      { icon: '⊞', label: 'My listings',    href: '/dashboard/listings',     primary: false },
      { icon: '✉', label: 'Enquiries',      href: '/dashboard/enquiries',    primary: false },
      { icon: '✦', label: 'Add listing',    href: '/dashboard/listings/new', primary: false },
      { icon: '◈', label: 'Go to dashboard',href: '/dashboard',              primary: true  },
    ],
  },
  agent: {
    color:   '#866820',
    accent:  '#C9A84C',
    bg:      'linear-gradient(135deg, #FAF3E0 0%, #FDF8EC 100%)',
    border:  'rgba(201,168,76,0.25)',
    label:   'Agent',
    icon:    '🤝',
    headline: (name: string) => `Welcome back, ${name}`,
    sub: 'You have active leads in your pipeline. Follow up today.',
    actions: [
      { icon: '◎', label: 'My clients',     href: '/dashboard/clients',    primary: false },
      { icon: '✉', label: 'Lead pipeline',  href: '/dashboard/enquiries',  primary: false },
      { icon: '▲', label: 'Analytics',      href: '/dashboard/analytics',  primary: false },
      { icon: '⊞', label: 'Go to dashboard',href: '/dashboard',            primary: true  },
    ],
  },
  builder: {
    color:   '#7A3010',
    accent:  '#E07B39',
    bg:      'linear-gradient(135deg, #FEF0E7 0%, #FFF5EE 100%)',
    border:  'rgba(224,123,57,0.2)',
    label:   'Builder',
    icon:    '🏗️',
    headline: (name: string) => `Welcome back, ${name}`,
    sub: 'Your projects are live. Review new enquiries and update status.',
    actions: [
      { icon: '⊞', label: 'My projects',    href: '/dashboard/projects',     primary: false },
      { icon: '✉', label: 'All enquiries',  href: '/dashboard/enquiries',    primary: false },
      { icon: '✦', label: 'Add project',    href: '/dashboard/projects/new', primary: false },
      { icon: '◈', label: 'Go to dashboard',href: '/dashboard',              primary: true  },
    ],
  },
}

export function PersonalizedStrip() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('profiles').select('full_name, role').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
      setTimeout(() => setVisible(true), 80)
    })
  }, [])

  if (loading || !profile) return null

  const config = ROLE_CONFIG[profile.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.buyer
  const firstName = profile.full_name?.split(' ')[0] || 'there'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.75s cubic-bezier(0.16,1,0.3,1)',
      margin: '2rem auto 0',
      maxWidth: '1280px',
      padding: '0 1.5rem',
    }}>
      <div style={{
        background: config.bg,
        borderRadius: '20px',
        border: `1px solid ${config.border}`,
        padding: '2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 24px ${config.border}`,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, ${config.accent}, transparent)`, borderRadius: '20px 20px 0 0' }} />
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: `radial-gradient(circle, ${config.accent}15 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0, background: `${config.accent}18`, border: `2px solid ${config.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 500, color: config.color }}>
              {profile.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#1A1A16', lineHeight: 1, margin: 0 }}>
                  {config.headline(firstName)}
                </h3>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', background: `${config.accent}25`, color: config.color, padding: '3px 10px', borderRadius: '3px', fontFamily: 'DM Sans, sans-serif', border: `1px solid ${config.accent}30` }}>
                  {config.icon} {config.label}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#8C8C86', margin: 0, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>
                {config.sub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {config.actions.map((action) => (
              <Link key={action.href} href={action.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 600,
                padding: action.primary ? '10px 20px' : '9px 16px',
                borderRadius: '8px',
                background: action.primary ? config.accent : '#fff',
                border: `1px solid ${action.primary ? 'transparent' : config.border}`,
                color: action.primary ? '#fff' : config.color,
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: action.primary ? '0.04em' : '0',
                boxShadow: action.primary ? `0 4px 14px ${config.accent}35` : '0 1px 3px rgba(26,26,22,0.06)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '11px' }}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
