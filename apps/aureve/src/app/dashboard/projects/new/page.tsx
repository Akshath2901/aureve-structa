'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '',
    property_type: 'apartment', listing_type: 'sale',
    price: '', price_per_sqft: '',
    address: '', locality: '', pincode: '',
    bedrooms: '', bathrooms: '', carpet_area: '', built_up_area: '',
    total_floors: '', rera_number: '',
    oc_received: false, possession_date: '',
    thumbnail_url: '', is_negotiable: false,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true); setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', 'aureve').single()
    const slug = form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60) + '-' + Date.now()

    const { error: err } = await supabase.from('properties').insert({
      tenant_id: tenant?.id, builder_id: user.id,
      title: form.title, slug, description: form.description,
      property_type: form.property_type, listing_type: form.listing_type,
      status: 'available',
      price: Number(form.price) * 100,
      price_per_sqft: form.price_per_sqft ? Number(form.price_per_sqft) : null,
      address: form.address, locality: form.locality, city: 'Hyderabad',
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      carpet_area: form.carpet_area ? Number(form.carpet_area) : null,
      built_up_area: form.built_up_area ? Number(form.built_up_area) : null,
      total_floors: form.total_floors ? Number(form.total_floors) : null,
      rera_number: form.rera_number || null,
      oc_received: form.oc_received,
      possession_date: form.possession_date || null,
      is_negotiable: form.is_negotiable,
      thumbnail_url: form.thumbnail_url || null,
      is_active: true, is_featured: false,
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard/projects'), 2000)
  }

  if (success) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', background: '#fff', borderRadius: '20px', padding: '3rem', border: '1px solid rgba(224,123,57,0.2)', maxWidth: '400px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: '#E07B39', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--charcoal)', marginBottom: '8px' }}>Project listed!</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Your project is now live on Aureve. Redirecting...</p>
      </div>
    </div>
  )

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: '#1A1A16' }
  const labelStyle = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Builder portal</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>Add New Project</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>List your project and start receiving qualified enquiries</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', alignItems: 'center' }}>
        {[{ n: 1, label: 'Project info' }, { n: 2, label: 'Details' }, { n: 3, label: 'RERA & media' }].map((s, idx) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setStep(s.n)}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s.n ? '#E07B39' : 'rgba(26,26,22,0.08)', color: step >= s.n ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', flexShrink: 0 }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontSize: '12px', fontWeight: step === s.n ? 600 : 400, color: step === s.n ? '#1A1A16' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</span>
            {idx < 2 && <div style={{ width: '40px', height: '1px', background: step > s.n ? '#E07B39' : 'rgba(26,26,22,0.1)' }} />}
          </div>
        ))}
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#dc2626', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>{error}</div>}

      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(26,26,22,0.08)' }}>

        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Project information</h3>
            </div>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Project name *</label>
                <input style={inputStyle} placeholder="e.g. Green Vista Phase 2 — Premium Apartments" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe your project, highlights, amenities..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Property type *</label>
                  <select style={inputStyle} value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                    {['apartment','villa','plot','commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>For *</label>
                  <select style={inputStyle} value={form.listing_type} onChange={e => set('listing_type', e.target.value)}>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Starting price (₹) *</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 8500000 for ₹85 Lac" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Price per sq.ft (₹)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 6500" value={form.price_per_sqft} onChange={e => set('price_per_sqft', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Project details</h3>
            </div>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Full address *</label>
                <input style={inputStyle} placeholder="Survey No., Street, Area" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Locality *</label>
                  <select style={inputStyle} value={form.locality} onChange={e => set('locality', e.target.value)}>
                    <option value="">Select locality</option>
                    {['Kokapet','Narsingi','Gachibowli','Kondapur','Madhapur','Banjara Hills','Jubilee Hills','Manikonda','Tellapur','Hitech City'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Total floors</label>
                  <input style={inputStyle} type="number" placeholder="12" value={form.total_floors} onChange={e => set('total_floors', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Bedrooms</label>
                  <select style={inputStyle} value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
                    <option value="">Select</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Carpet area (sq.ft)</label>
                  <input style={inputStyle} type="number" placeholder="1200" value={form.carpet_area} onChange={e => set('carpet_area', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Built-up area (sq.ft)</label>
                  <input style={inputStyle} type="number" placeholder="1350" value={form.built_up_area} onChange={e => set('built_up_area', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Expected possession date</label>
                <input style={inputStyle} type="date" value={form.possession_date} onChange={e => set('possession_date', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>RERA & media</h3>
            </div>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>RERA number *</label>
                <input style={inputStyle} placeholder="e.g. REA02200013892" value={form.rera_number} onChange={e => set('rera_number', e.target.value)} />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                  Required for all builder projects. Register at rera.telangana.gov.in
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.oc_received} onChange={e => set('oc_received', e.target.checked)} style={{ accentColor: '#E07B39' }} />
                  OC (Occupancy Certificate) received
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_negotiable} onChange={e => set('is_negotiable', e.target.checked)} style={{ accentColor: '#E07B39' }} />
                  Price is negotiable
                </label>
              </div>
              <div>
                <label style={labelStyle}>Project thumbnail image URL</label>
                <input style={inputStyle} placeholder="https://..." value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} />
              </div>
              {form.thumbnail_url && (
                <img src={form.thumbnail_url} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(26,26,22,0.08)' }} />
              )}

              {/* Summary */}
              <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.06)' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                  {[
                    { label: 'Name',     val: form.title || '—' },
                    { label: 'Type',     val: form.property_type },
                    { label: 'Price',    val: form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—' },
                    { label: 'Locality', val: form.locality || '—' },
                    { label: 'RERA',     val: form.rera_number || '—' },
                    { label: 'BHK',      val: form.bedrooms ? `${form.bedrooms} BHK` : '—' },
                  ].map(f => (
                    <div key={f.label}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{f.label}: </span>
                      <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(26,26,22,0.06)' }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            style={{ padding: '11px 24px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', background: 'transparent', fontSize: '13px', fontWeight: 500, color: step === 1 ? 'var(--text-muted)' : 'var(--charcoal)', cursor: step === 1 ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            ← Previous
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)}
              style={{ padding: '11px 28px', borderRadius: '8px', border: 'none', background: '#E07B39', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || !form.title || !form.price || !form.locality}
              style={{ padding: '11px 28px', borderRadius: '8px', border: 'none', background: !form.title || !form.price || !form.locality ? 'rgba(26,26,22,0.1)' : '#E07B39', color: !form.title || !form.price || !form.locality ? 'var(--text-muted)' : '#fff', fontSize: '13px', fontWeight: 600, cursor: !form.title || !form.price || !form.locality ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {loading ? 'Publishing...' : '✦ Publish project'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
