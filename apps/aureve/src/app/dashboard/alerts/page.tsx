'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AlertsPage() {
  const [alertType, setAlertType] = useState('property')
  const [locality,  setLocality]  = useState('')
  const [maxPrice,  setMaxPrice]  = useState('')
  const [saved,     setSaved]     = useState(false)

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Notifications</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>Price Alerts</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Get notified when prices drop in your target areas</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Create alert */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Create new alert</h3>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Alert type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[{v:'property',l:'Property price drop'},{v:'material',l:'Material price drop'}].map(t => (
                <button key={t.v} onClick={() => setAlertType(t.v)} style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                  borderColor: alertType === t.v ? 'var(--gold)' : 'rgba(26,26,22,0.1)',
                  background: alertType === t.v ? 'rgba(201,168,76,0.06)' : 'transparent',
                  color: alertType === t.v ? 'var(--gold-dark)' : 'var(--text-secondary)',
                }}>{t.l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Locality</label>
            <select className="input" value={locality} onChange={e => setLocality(e.target.value)} style={{ fontSize: '13px' }}>
              <option value="">Select locality</option>
              {['Kokapet','Narsingi','Gachibowli','Kondapur','Madhapur','Manikonda','Tellapur','Banjara Hills'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Max budget (₹)</label>
            <input className="input" type="number" placeholder="e.g. 10000000 for ₹1 Cr" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ fontSize: '13px' }} />
          </div>

          <button onClick={() => setSaved(true)} style={{
            width: '100%', padding: '12px', background: 'var(--gold)', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {saved ? '✓ Alert created!' : 'Create alert'}
          </button>
        </div>

        {/* How it works */}
        <div style={{ background: 'linear-gradient(135deg, #1A1A16 0%, #2C2C28 100%)', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, var(--gold), transparent)', borderRadius: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#FAF8F3' }}>How alerts work</h3>
          </div>
          {[
            { icon: '◎', text: 'Set your target locality and max budget' },
            { icon: '▲', text: 'We monitor prices daily across all listings' },
            { icon: '✉', text: 'Get an email + WhatsApp when a match drops to your price' },
            { icon: '❤', text: 'Save time — never miss a good deal again' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(201,168,76,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--gold)', flexShrink: 0 }}>
                {s.icon}
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(250,248,243,0.6)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
