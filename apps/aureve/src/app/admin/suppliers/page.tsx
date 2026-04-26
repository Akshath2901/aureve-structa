'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const MOCK_SUPPLIERS = [
  { id: '1', company_name: 'Aparna RMC',            specialty: 'Ready Mix Concrete', city: 'Hyderabad', rating: 4.8, reviews: 142, status: 'verified',  phone: '+91 98765 11111', fleet: '350+ mixers',  since: '1994' },
  { id: '2', company_name: 'Sri Sai Steel Traders', specialty: 'TMT Steel',          city: 'Hyderabad', rating: 4.7, reviews: 98,  status: 'verified',  phone: '+91 87654 22222', fleet: 'Direct mill',  since: '2006' },
  { id: '3', company_name: 'Lakshmi Sand & Agg',    specialty: 'Sand & Aggregates',  city: 'Hyderabad', rating: 4.5, reviews: 67,  status: 'pending',   phone: '+91 76543 33333', fleet: '40+ tippers', since: '2012' },
  { id: '4', company_name: 'Hyderabad Cement Hub',  specialty: 'All grades cement',  city: 'Hyderabad', rating: 4.6, reviews: 211, status: 'verified',  phone: '+91 65432 44444', fleet: '80+ vehicles', since: '2002' },
  { id: '5', company_name: 'New Bricks Co.',         specialty: 'Red & Fly Ash Bricks',city: 'Hyderabad',rating: 4.2, reviews: 31, status: 'pending',   phone: '+91 54321 55555', fleet: '10 tippers',  since: '2020' },
]

const STATUS_META: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: 'rgba(29,158,117,0.1)',  color: '#085041', label: 'Verified'  },
  pending:  { bg: 'rgba(201,168,76,0.1)',  color: '#866820', label: 'Pending'   },
  rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', label: 'Rejected'  },
}

export default function AdminSuppliersPage() {
  const [suppliers,  setSuppliers]  = useState(MOCK_SUPPLIERS)
  const [selected,   setSelected]   = useState<typeof MOCK_SUPPLIERS[0] | null>(null)
  const [filter,     setFilter]     = useState('all')
  const [actionDone, setActionDone] = useState<string | null>(null)

  const filtered = filter === 'all' ? suppliers : suppliers.filter(s => s.status === filter)

  const handleAction = (id: string, action: 'verified' | 'rejected') => {
    setSuppliers(s => s.map(sup => sup.id === id ? { ...sup, status: action } : sup))
    setActionDone(id + action)
    setTimeout(() => setActionDone(null), 2000)
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: action } : null)
  }

  const stats = {
    total:    suppliers.length,
    verified: suppliers.filter(s => s.status === 'verified').length,
    pending:  suppliers.filter(s => s.status === 'pending').length,
    rejected: suppliers.filter(s => s.status === 'rejected').length,
  }

  return (
    <div style={{ padding: '2.5rem', background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>
          Structa admin
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
          Supplier Management
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            Verify, approve and manage Structa suppliers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total suppliers', value: stats.total,    color: 'var(--charcoal)', bg: 'rgba(26,26,22,0.06)' },
          { label: 'Verified',        value: stats.verified, color: '#085041',          bg: 'rgba(29,158,117,0.08)' },
          { label: 'Pending review',  value: stats.pending,  color: '#866820',          bg: 'rgba(201,168,76,0.08)' },
          { label: 'Rejected',        value: stats.rejected, color: '#dc2626',          bg: 'rgba(239,68,68,0.08)' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 14px 0 50px' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {['all', 'verified', 'pending', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '6px', border: '1px solid', cursor: 'pointer',
            fontSize: '12px', fontWeight: 500, textTransform: 'capitalize',
            fontFamily: 'DM Sans, sans-serif',
            borderColor: filter === f ? 'var(--gold)' : 'rgba(26,26,22,0.1)',
            background: filter === f ? 'rgba(201,168,76,0.08)' : 'transparent',
            color: filter === f ? 'var(--gold-dark)' : 'var(--text-secondary)',
          }}>{f} {f === 'all' ? `(${stats.total})` : f === 'verified' ? `(${stats.verified})` : f === 'pending' ? `(${stats.pending})` : `(${stats.rejected})`}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '1.5rem' }}>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
              <tr>
                {['Supplier', 'Specialty', 'Rating', 'Fleet', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const sm = STATUS_META[s.status]
                const isSelected = selected?.id === s.id
                return (
                  <tr key={s.id}
                    onClick={() => setSelected(isSelected ? null : s)}
                    style={{ borderTop: '1px solid rgba(26,26,22,0.04)', cursor: 'pointer', background: isSelected ? 'rgba(201,168,76,0.04)' : 'transparent', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{s.company_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {s.city} · Since {s.since}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>{s.specialty}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '12px' }}>★</span>
                        <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{s.rating}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({s.reviews})</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{s.fleet}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: sm.bg, color: sm.color, padding: '3px 8px', borderRadius: '4px' }}>
                        {sm.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {s.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleAction(s.id, 'verified')}
                            style={{ padding: '5px 12px', borderRadius: '5px', border: 'none', background: 'rgba(29,158,117,0.1)', color: '#085041', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                            {actionDone === s.id + 'verified' ? '✓ Done' : 'Verify'}
                          </button>
                          <button onClick={() => handleAction(s.id, 'rejected')}
                            style={{ padding: '5px 12px', borderRadius: '5px', border: 'none', background: 'rgba(239,68,68,0.08)', color: '#dc2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                            Reject
                          </button>
                        </div>
                      )}
                      {s.status === 'verified' && (
                        <button onClick={e => { e.stopPropagation(); handleAction(s.id, 'rejected') }}
                          style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#dc2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                          Suspend
                        </button>
                      )}
                      {s.status === 'rejected' && (
                        <button onClick={e => { e.stopPropagation(); handleAction(s.id, 'verified') }}
                          style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid rgba(29,158,117,0.2)', background: 'transparent', color: '#085041', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                          Reinstate
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(201,168,76,0.2)', padding: '1.75rem', height: 'fit-content', position: 'sticky', top: "1rem", boxShadow: "0 4px 20px rgba(201,168,76,0.08)", overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--gold-dark)', margin: '0 auto 10px' }}>
                {selected.company_name[0]}
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '6px' }}>{selected.company_name}</h3>
              <span style={{ fontSize: '10px', fontWeight: 700, background: STATUS_META[selected.status].bg, color: STATUS_META[selected.status].color, padding: '3px 10px', borderRadius: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                {STATUS_META[selected.status].label}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {[
                { label: 'Specialty',  value: selected.specialty   },
                { label: 'City',       value: selected.city         },
                { label: 'Phone',      value: selected.phone        },
                { label: 'Fleet',      value: selected.fleet        },
                { label: 'Since',      value: selected.since        },
                { label: 'Rating',     value: `★ ${selected.rating} (${selected.reviews} reviews)` },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--cream)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{f.label}</span>
                  <span style={{ fontSize: '13px', color: 'var(--charcoal)', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>{f.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <a href={`tel:${selected.phone}`} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'var(--charcoal)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
                📞 Call
              </a>
              <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'rgba(29,158,117,0.1)', color: '#085041', fontSize: '12px', fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', border: '1px solid rgba(29,158,117,0.2)' }}>
                💬 WhatsApp
              </a>
            </div>

            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAction(selected.id, 'verified')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  ✓ Verify supplier
                </button>
                <button onClick={() => handleAction(selected.id, 'rejected')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  ✗ Reject
                </button>
              </div>
            )}

            <button onClick={() => setSelected(null)} style={{ width: '100%', marginTop: '8px', padding: '8px', background: 'transparent', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
