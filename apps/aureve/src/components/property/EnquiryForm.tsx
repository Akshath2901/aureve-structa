'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function EnquiryForm({ propertyId, propertyTitle, price }: { propertyId: string, propertyTitle: string, price: string }) {
  const [name,      setName]      = useState('')
  const [phone,     setPhone]     = useState('')
  const [email,     setEmail]     = useState('')
  const [message,   setMessage]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', 'aureve')
      .single()

    await supabase.from('property_enquiries').insert({
      property_id: propertyId,
      tenant_id:   tenant?.id,
      name, phone, email,
      message: message || null,
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
      <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#1A1A16', marginBottom: '8px' }}>Enquiry sent!</h4>
      <p style={{ fontSize: '13px', color: '#8C8C86' }}>The builder will contact you within 24 hours.</p>
    </div>
  )

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C9A84C', marginBottom: '4px' }}>Interested?</p>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#1A1A16' }}>Enquire now</h4>
        <p style={{ fontSize: '13px', color: '#8C8C86', marginTop: '4px' }}>{price}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A45', display: 'block', marginBottom: '6px' }}>Full name *</label>
          <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required style={{ fontSize: '14px', padding: '10px 14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A45', display: 'block', marginBottom: '6px' }}>Phone *</label>
          <input className="input" placeholder="+91 98765 43210" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ fontSize: '14px', padding: '10px 14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A45', display: 'block', marginBottom: '6px' }}>Email</label>
          <input className="input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ fontSize: '14px', padding: '10px 14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A45', display: 'block', marginBottom: '6px' }}>Message</label>
          <textarea className="input" rows={3} placeholder="Any specific requirements..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ fontSize: '14px', padding: '10px 14px', resize: 'none' }} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
          {loading ? 'Sending...' : 'Send enquiry'}
        </button>
        <p style={{ fontSize: '11px', color: '#8C8C86', textAlign: 'center' }}>
          By submitting you agree to be contacted via call, SMS or WhatsApp.
        </p>
      </form>

      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', opacity: 0.3, margin: '1rem 0' }} />

      <a href="https://wa.me/919100000000" target="_blank"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px solid rgba(26,26,22,0.1)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#4A4A45' }}>
        💬 WhatsApp the builder
      </a>
    </div>
  )
}
