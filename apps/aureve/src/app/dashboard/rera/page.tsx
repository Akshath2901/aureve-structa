'use client'

import { useState } from 'react'

const RERA_DOCS = [
  { project: 'Green Vista',   rera: 'REA02200013892', status: 'Active',   expiry: '2027-12-31', units: 120, registered: '2024-01-15', authority: 'RERA Telangana' },
  { project: 'Elara Heights', rera: 'P02400002487',   status: 'Active',   expiry: '2028-06-30', units: 80,  registered: '2024-03-20', authority: 'RERA Telangana' },
  { project: 'Skyline Towers',rera: 'REA02200019876', status: 'Expired',  expiry: '2025-12-01', units: 200, registered: '2022-06-10', authority: 'RERA Telangana' },
]

const STATUS_META: Record<string, { bg: string; color: string }> = {
  Active:   { bg: 'rgba(29,158,117,0.1)',  color: '#085041' },
  Expired:  { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  Pending:  { bg: 'rgba(201,168,76,0.1)',  color: '#866820' },
}

export default function RERAPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Builder portal</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>RERA Documents</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Manage your project registrations</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: '#E07B39', color: '#fff', padding: '11px 22px', borderRadius: '6px',
          fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
          letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>
          ✦ Add RERA registration
        </button>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(224,123,57,0.06)', border: '1px solid rgba(224,123,57,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>📋</div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#7A3010', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
            RERA registration is mandatory
          </p>
          <p style={{ fontSize: '12px', color: '#9A5030', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
            All projects above 500 sq.m or 8 apartments must be registered with RERA Telangana before advertising or selling. Register at <strong>rera.telangana.gov.in</strong>
          </p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(224,123,57,0.2)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Add RERA registration</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Project name',    placeholder: 'Green Vista Phase 2' },
              { label: 'RERA number',     placeholder: 'REA02200000000' },
              { label: 'Registration date', placeholder: '', type: 'date' },
              { label: 'Expiry date',     placeholder: '', type: 'date' },
              { label: 'Total units',     placeholder: '120', type: 'number' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>{f.label}</label>
                <input type={f.type || 'text'} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', background: 'transparent', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#E07B39', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              ✓ Save registration
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Active registrations', value: '2', color: '#1D9E75', bg: 'rgba(29,158,117,0.08)' },
          { label: 'Expiring soon',        value: '0', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)' },
          { label: 'Expired',              value: '1', color: '#dc2626', bg: 'rgba(239,68,68,0.08)'  },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50px', height: '50px', background: s.bg, borderRadius: '0 12px 0 50px' }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* RERA table */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(26,26,22,0.08)' }}>
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>Registered projects</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          <thead style={{ background: 'var(--cream)' }}>
            <tr>
              {['Project', 'RERA number', 'Units', 'Registered', 'Expiry', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RERA_DOCS.map((r, i) => {
              const sm = STATUS_META[r.status]
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(26,26,22,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--charcoal)' }}>{r.project}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--cream)', padding: '3px 8px', borderRadius: '4px', color: 'var(--charcoal)' }}>
                      {r.rera}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{r.units}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {new Date(r.registered).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px', color: r.status === 'Expired' ? '#dc2626' : 'var(--text-muted)' }}>
                    {new Date(r.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.05em', background: sm.bg, color: sm.color }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <a href={`https://rera.telangana.gov.in`} target="_blank" style={{ fontSize: '11px', color: '#E07B39', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                      VIEW →
                    </a>
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
