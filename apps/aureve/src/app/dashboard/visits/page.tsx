'use client'

import { useState } from 'react'

const VISITS = [
  { client: 'Ramesh Kumar',  property: 'Green Vista — 3BHK',    locality: 'Kokapet',    date: '2026-04-24', time: '11:00 AM', status: 'Confirmed', phone: '+91 98765 43210' },
  { client: 'Priya Sharma',  property: 'Aurum Towers — 2BHK',   locality: 'Gachibowli', date: '2026-04-25', time: '03:00 PM', status: 'Pending',   phone: '+91 87654 32109' },
  { client: 'Suresh Reddy',  property: 'Kokapet Plot 200yd',    locality: 'Kokapet',    date: '2026-04-26', time: '10:00 AM', status: 'Confirmed', phone: '+91 76543 21098' },
  { client: 'Anita Desai',   property: 'Elara Heights Villa',   locality: 'Narsingi',   date: '2026-04-20', time: '02:00 PM', status: 'Completed', phone: '+91 65432 10987' },
  { client: 'Vijay Nair',    property: 'Skyline One — 3BHK',    locality: 'Kondapur',   date: '2026-04-18', time: '12:00 PM', status: 'Completed', phone: '+91 54321 09876' },
]

const STATUS_META: Record<string, { bg: string; color: string }> = {
  Confirmed: { bg: 'rgba(29,158,117,0.1)',  color: '#085041' },
  Pending:   { bg: 'rgba(201,168,76,0.1)',  color: '#866820' },
  Completed: { bg: 'rgba(83,74,183,0.1)',   color: '#3730a3' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
}

export default function SiteVisitsPage() {
  const [showForm, setShowForm] = useState(false)
  const [newVisit, setNewVisit] = useState({ client: '', property: '', date: '', time: '', phone: '' })

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Agent portal</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>Site Visits</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{VISITS.filter(v => v.status !== 'Completed').length} upcoming visits</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: 'var(--gold)', color: '#fff', padding: '11px 22px', borderRadius: '6px',
          fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
          letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          ✦ Schedule visit
        </button>
      </div>

      {/* Schedule form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(201,168,76,0.2)', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(201,168,76,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Schedule new site visit</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Client name', key: 'client', placeholder: 'Ramesh Kumar', type: 'text' },
              { label: 'Property',    key: 'property',placeholder: 'Green Vista 3BHK', type: 'text' },
              { label: 'Phone',       key: 'phone',   placeholder: '+91 98765 43210', type: 'tel' },
              { label: 'Date',        key: 'date',    placeholder: '', type: 'date' },
              { label: 'Time',        key: 'time',    placeholder: '', type: 'time' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={(newVisit as any)[f.key]} onChange={e => setNewVisit(v => ({ ...v, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', background: 'transparent', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--gold)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              ✓ Save visit
            </button>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'This week',  value: '3', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)' },
          { label: 'Confirmed',  value: '2', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)' },
          { label: 'Pending',    value: '1', color: '#866820', bg: 'rgba(201,168,76,0.08)' },
          { label: 'Completed',  value: '2', color: '#534AB7', bg: 'rgba(83,74,183,0.08)'  },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 12px 0 50px' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Visits table */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.08)' }}>
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>All scheduled visits</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          <thead style={{ background: 'var(--cream)' }}>
            <tr>
              {['Client', 'Property', 'Date & time', 'Phone', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VISITS.map((v, i) => {
              const sm = STATUS_META[v.status]
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(26,26,22,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--charcoal)' }}>{v.client}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--charcoal)', marginBottom: '2px' }}>{v.property}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {v.locality}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                      {new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.time}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{v.phone}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.05em', background: sm.bg, color: sm.color }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                      Call
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
