'use client'

import Link from 'next/link'

export function SellerDashboard({ profile }: { profile: any }) {
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
          Seller portal
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
          {firstName}'s Listings
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#1D9E75' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Manage your properties and track buyer interest</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '⊞', label: 'Active listings',    value: '0', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)' },
          { icon: '▲', label: 'Total views',         value: '0', color: '#534AB7', bg: 'rgba(83,74,183,0.08)' },
          { icon: '✉', label: 'Enquiries received',  value: '0', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)' },
          { icon: '◎', label: 'Calls this week',     value: '0', color: '#E07B39', bg: 'rgba(224,123,57,0.08)' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: s.bg, borderRadius: '0 16px 0 60px' }} />
            <div style={{ fontSize: '1.1rem', marginBottom: '12px', color: s.color }}>{s.icon}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add listing CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A16 0%, #2C2C28 100%)',
        borderRadius: '16px', padding: '1.75rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
        border: '1px solid rgba(29,158,117,0.2)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, #1D9E75, transparent)' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '1px', background: '#1D9E75' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1D9E75', fontFamily: 'DM Sans, sans-serif' }}>Get started</span>
          </div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#FAF8F3', marginBottom: '4px' }}>
            List your property on Aureve
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(250,248,243,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            Reach thousands of verified buyers across Hyderabad
          </p>
        </div>
        <Link href="/dashboard/listings/new" style={{
          background: '#1D9E75', color: '#fff', padding: '11px 22px', borderRadius: '6px',
          fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
          letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          ✦ Add listing
        </Link>
      </div>

      {/* Tips */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(26,26,22,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>How to sell faster</h3>
        </div>
        {[
          { num: '01', tip: 'Add 5+ high quality photos', desc: 'Listings with multiple photos get 3× more enquiries from serious buyers' },
          { num: '02', tip: 'Set a competitive price',    desc: 'Check similar listings in your locality before setting your price' },
          { num: '03', tip: 'Add your RERA number',      desc: 'RERA-verified listings get 40% more views from qualified buyers' },
          { num: '04', tip: 'Respond within 1 hour',     desc: 'Fast response rate increases your closing probability by 60%' },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(26,26,22,0.05)' : 'none', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, color: 'rgba(201,168,76,0.3)', lineHeight: 1, flexShrink: 0, width: '32px' }}>
              {t.num}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif', marginBottom: '3px' }}>{t.tip}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
