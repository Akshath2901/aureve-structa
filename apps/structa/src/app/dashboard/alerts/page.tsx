'use client'

import { useState } from 'react'

const MATERIALS = ['Cement 53G','TMT Steel','M-Sand','Red Bricks','Aggregate 20mm','River Sand','OPC Cement','Fly Ash Brick']

export default function StructaAlertsPage() {
  const [material,  setMaterial]  = useState('')
  const [price,     setPrice]     = useState('')
  const [saved,     setSaved]     = useState(false)

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(17,25,39,0.12)', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff', color: '#111927' }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>Price Alerts</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Get notified when prices drop to your target</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid rgba(17,25,39,0.08)', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '16px', height: '2px', background: '#E07B39', borderRadius: '1px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Create price alert</h3>
          </div>

          {saved ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔔</div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', color: '#111927', marginBottom: '6px' }}>Alert created!</h4>
              <p style={{ fontSize: '12px', color: '#8A96A8', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>We'll notify you when {material} drops below ₹{price}</p>
              <button onClick={() => { setSaved(false); setMaterial(''); setPrice('') }} style={{ padding: '9px 20px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Create another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A96A8', display: 'block', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Material</label>
                <select style={inputStyle} value={material} onChange={e => setMaterial(e.target.value)}>
                  <option value="">Select material</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A96A8', display: 'block', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Alert me when price drops below (₹)</label>
                <input type="number" style={inputStyle} placeholder="e.g. 350" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <button onClick={() => material && price && setSaved(true)} disabled={!material || !price} style={{ padding: '12px', background: !material || !price ? 'rgba(17,25,39,0.06)' : '#E07B39', color: !material || !price ? '#8A96A8' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: !material || !price ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                🔔 Create alert
              </button>
            </div>
          )}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #111927 100%)', borderRadius: '14px', padding: '1.75rem', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ width: '16px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>How alerts work</h3>
          </div>
          {[
            { icon: '◎', text: 'Pick a material and set your target price' },
            { icon: '▲', text: 'We monitor prices daily from market sources' },
            { icon: '✉', text: 'Get a WhatsApp + email when price hits target' },
            { icon: '⊞', text: 'Never miss a good buying opportunity again' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(245,158,11,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#F59E0B', flexShrink: 0 }}>{s.icon}</div>
              <p style={{ fontSize: '13px', color: 'rgba(247,247,246,0.55)', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
