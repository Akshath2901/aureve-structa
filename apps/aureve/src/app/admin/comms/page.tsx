'use client'

import { useState } from 'react'

export default function AdminCommsPage() {
  const [channel, setChannel] = useState<'whatsapp'|'email'>('whatsapp')
  const [audience, setAudience] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }

  const TEMPLATES = [
    { label: 'New listing alert',     body: 'Hi! A new property matching your preferences has been listed on Aureve. Check it out: aureve.in/properties' },
    { label: 'Price drop alert',      body: 'Great news! A property you saved has dropped in price. Login to Aureve to see the updated price.' },
    { label: 'Enquiry follow-up',     body: 'Hi! We noticed you enquired about a property on Aureve. Would you like to schedule a site visit? Reply YES to confirm.' },
    { label: 'Platform announcement', body: 'Exciting updates on Aureve! We have added new features to help you find your dream home faster. Visit aureve.in to explore.' },
  ]

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10B981', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Outreach</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>Communications</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Send WhatsApp messages and emails to your users</p>
      </div>

      {sent ? (
        <div style={{ background: '#161616', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: '#10B981', marginBottom: '1rem' }}>✓</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Message queued!</h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: '1.5rem' }}>Your message has been queued for delivery via {channel}.</p>
          <button onClick={() => { setSent(false); setBody(''); setSubject('') }} style={{ padding: '11px 24px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Send another
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

          {/* Compose */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, #10B98160, transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#10B981' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#fff' }}>Compose message</h3>
            </div>

            {/* Channel */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Channel</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{v:'whatsapp',l:'💬 WhatsApp'},{v:'email',l:'✉ Email'}].map(c => (
                  <button key={c.v} onClick={() => setChannel(c.v as any)} style={{
                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                    borderColor: channel === c.v ? '#10B981' : 'rgba(255,255,255,0.08)',
                    background: channel === c.v ? 'rgba(16,185,129,0.1)' : 'transparent',
                    color: channel === c.v ? '#10B981' : 'rgba(255,255,255,0.4)',
                  }}>{c.l}</button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Send to</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} style={inputStyle}>
                <option value="all">All users</option>
                <option value="buyer">All buyers</option>
                <option value="seller">All sellers</option>
                <option value="agent">All agents</option>
                <option value="builder">All builders</option>
              </select>
            </div>

            {/* Subject — only for email */}
            {channel === 'email' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Subject line</label>
                <input style={inputStyle} placeholder="e.g. New properties in Kokapet" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
            )}

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Message body</label>
              <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Type your message here..." value={body} onChange={e => setBody(e.target.value)} />
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                {body.length}/160 characters {channel === 'whatsapp' ? '(WhatsApp limit per message)' : ''}
              </p>
            </div>

            <button onClick={() => body && setSent(true)} disabled={!body} style={{
              width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
              background: body ? '#10B981' : 'rgba(255,255,255,0.06)',
              color: body ? '#fff' : 'rgba(255,255,255,0.2)',
              fontSize: '13px', fontWeight: 600, cursor: body ? 'pointer' : 'not-allowed',
              fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em',
            }}>
              📤 Send {channel === 'whatsapp' ? 'WhatsApp' : 'Email'} →
            </button>

            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '10px', fontFamily: 'DM Sans, sans-serif' }}>
              ⚡ WhatsApp integration via Twilio · Email via Resend — connect in Settings
            </p>
          </div>

          {/* Templates */}
          <div>
            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ width: '16px', height: '1px', background: '#F59E0B' }} />
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#fff' }}>Quick templates</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TEMPLATES.map((t) => (
                  <button key={t.label} onClick={() => setBody(t.body)} style={{
                    padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
                    background: 'transparent', color: 'rgba(255,255,255,0.6)',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B40'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
                    {t.label} →
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ width: '16px', height: '1px', background: '#3B82F6' }} />
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#fff' }}>Reach</h4>
              </div>
              {[
                { label: 'All users',   count: '5', color: '#fff' },
                { label: 'Buyers',      count: '1', color: '#8B5CF6' },
                { label: 'Sellers',     count: '1', color: '#10B981' },
                { label: 'Agents',      count: '1', color: '#F59E0B' },
                { label: 'Builders',    count: '1', color: '#E07B39' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: r.color }}>{r.count} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
