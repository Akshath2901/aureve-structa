'use client'

import { useState } from 'react'

const CLIENTS = [
  { name: 'Ramesh Kumar',  phone: '+91 98765 43210', email: 'ramesh@example.com', budget: '₹1–1.5 Cr', looking: 'Buy',  locality: 'Kokapet',    bhk: '3 BHK', stage: 'Site visit',  added: '2026-04-10', avatar: 'R' },
  { name: 'Priya Sharma',  phone: '+91 87654 32109', email: 'priya@example.com',  budget: '₹80–1 Cr',  looking: 'Buy',  locality: 'Gachibowli', bhk: '2 BHK', stage: 'Negotiating', added: '2026-04-05', avatar: 'P' },
  { name: 'Suresh Reddy',  phone: '+91 76543 21098', email: 'suresh@example.com', budget: '₹70–80 Lac', looking: 'Buy', locality: 'Kokapet',    bhk: 'Plot',  stage: 'Enquired',   added: '2026-03-28', avatar: 'S' },
  { name: 'Anita Desai',   phone: '+91 65432 10987', email: 'anita@example.com',  budget: '₹2–2.5 Cr', looking: 'Buy',  locality: 'Narsingi',   bhk: '4 BHK', stage: 'Closed ✓',   added: '2026-03-15', avatar: 'A' },
  { name: 'Vijay Nair',    phone: '+91 54321 09876', email: 'vijay@example.com',  budget: '₹40k/mo',   looking: 'Rent', locality: 'Kondapur',   bhk: '3 BHK', stage: 'Enquired',   added: '2026-04-18', avatar: 'V' },
]

const STAGE_META: Record<string, { bg: string; color: string }> = {
  'Site visit':  { bg: 'rgba(201,168,76,0.1)',  color: '#866820' },
  'Negotiating': { bg: 'rgba(29,158,117,0.1)',  color: '#085041' },
  'Enquired':    { bg: 'rgba(83,74,183,0.1)',   color: '#3730a3' },
  'Closed ✓':   { bg: 'rgba(140,140,134,0.1)', color: '#4A4A45' },
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof CLIENTS[0] | null>(null)

  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.locality.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Agent portal</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>My Clients</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{CLIENTS.length} clients in your pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total clients',  value: '5', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)' },
          { label: 'Active buyers',  value: '4', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)' },
          { label: 'Site visits due','value': '2', color: '#534AB7', bg: 'rgba(83,74,183,0.08)' },
          { label: 'Closed this month', value: '1', color: '#8C8C86', bg: 'rgba(140,140,134,0.08)' },
        ].map((s: any) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 12px 0 50px' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '1.5rem' }}>
        {/* Client list */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(26,26,22,0.08)', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
            <input
              placeholder="Search by name or locality..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.1)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: 'var(--cream)' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead style={{ background: 'var(--cream)' }}>
              <tr>
                {['Client', 'Budget & requirement', 'Locality', 'Stage', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const sm = STAGE_META[c.stage] || STAGE_META['Enquired']
                return (
                  <tr key={i} style={{ borderTop: '1px solid rgba(26,26,22,0.04)', cursor: 'pointer', background: selected?.name === c.name ? 'rgba(201,168,76,0.04)' : 'transparent', transition: 'background 0.15s' }}
                    onClick={() => setSelected(selected?.name === c.name ? null : c)}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#866820', flexShrink: 0 }}>
                          {c.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{c.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', marginBottom: '2px' }}>{c.budget}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.looking} · {c.bhk}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{c.locality}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.05em', background: sm.bg, color: sm.color }}>
                        {c.stage}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '14px' }}>→</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Client detail panel */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(201,168,76,0.2)', padding: '1.75rem', height: 'fit-content', position: 'sticky', top: '1rem', boxShadow: '0 4px 20px rgba(201,168,76,0.08)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)', borderRadius: '16px 16px 0 0' }} />

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#866820', margin: '0 auto 10px' }}>
                {selected.avatar}
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '4px' }}>{selected.name}</h3>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', background: 'rgba(201,168,76,0.1)', color: '#866820', padding: '3px 10px', borderRadius: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                {selected.stage}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { label: 'Phone',    value: selected.phone    },
                { label: 'Email',    value: selected.email    },
                { label: 'Budget',   value: selected.budget   },
                { label: 'Looking',  value: `${selected.looking} · ${selected.bhk}` },
                { label: 'Locality', value: selected.locality  },
                { label: 'Added',    value: new Date(selected.added).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--cream)', borderRadius: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</span>
                  <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={`tel:${selected.phone}`} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'var(--gold)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
                📞 Call
              </a>
              <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'rgba(29,158,117,0.1)', color: '#085041', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(29,158,117,0.2)' }}>
                💬 WhatsApp
              </a>
            </div>

            <button onClick={() => setSelected(null)} style={{ width: '100%', marginTop: '10px', padding: '8px', background: 'transparent', border: '1px solid rgba(26,26,22,0.1)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
