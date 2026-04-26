'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '', description: '',
    property_type: 'apartment', listing_type: 'sale',
    price: '', price_per_sqft: '',
    address: '', locality: '', pincode: '',
    bedrooms: '', bathrooms: '', carpet_area: '',
    floor_number: '', total_floors: '',
    rera_number: '', oc_received: false,
    possession_date: '', is_negotiable: false,
    thumbnail_url: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', 'aureve').single()

    const slug = form.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) + '-' + Date.now()

    const { error: err } = await supabase.from('properties').insert({
      tenant_id:      tenant?.id,
      builder_id:     user.id,
      title:          form.title,
      slug,
      description:    form.description,
      property_type:  form.property_type,
      listing_type:   form.listing_type,
      status:         'available',
      price:          Number(form.price) * 100,
      price_per_sqft: form.price_per_sqft ? Number(form.price_per_sqft) : null,
      address:        form.address,
      locality:       form.locality,
      city:           'Hyderabad',
      pincode:        form.pincode,
      bedrooms:       form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms:      form.bathrooms ? Number(form.bathrooms) : null,
      carpet_area:    form.carpet_area ? Number(form.carpet_area) : null,
      floor_number:   form.floor_number ? Number(form.floor_number) : null,
      total_floors:   form.total_floors ? Number(form.total_floors) : null,
      rera_number:    form.rera_number || null,
      oc_received:    form.oc_received,
      possession_date:form.possession_date || null,
      is_negotiable:  form.is_negotiable,
      thumbnail_url:  form.thumbnail_url || null,
      is_active:      true,
      is_featured:    false,
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard/listings'), 2000)
  }

  if (success) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', background: '#fff', borderRadius: '20px', padding: '3rem', border: '1px solid rgba(26,26,22,0.08)', maxWidth: '400px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', color: '#1D9E75', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--charcoal)', marginBottom: '8px' }}>Listing created!</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Your property is now live. Redirecting to your listings...</p>
      </div>
    </div>
  )

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', color: '#1A1A16' }
  const labelStyle = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
          Seller portal
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
          Add New Listing
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: '#1D9E75' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
            Fill in the details below to list your property on Aureve
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        {[
          { n: 1, label: 'Basic info' },
          { n: 2, label: 'Details' },
          { n: 3, label: 'Legal & media' },
        ].map((s) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setStep(s.n)}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: step >= s.n ? '#1D9E75' : 'rgba(26,26,22,0.08)',
              color: step >= s.n ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              flexShrink: 0,
            }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontSize: '12px', fontWeight: step === s.n ? 600 : 400, color: step === s.n ? '#1A1A16' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
              {s.label}
            </span>
            {s.n < 3 && <div style={{ width: '40px', height: '1px', background: step > s.n ? '#1D9E75' : 'rgba(26,26,22,0.1)' }} />}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#dc2626', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(26,26,22,0.08)' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#1D9E75' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Basic information</h3>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Property title *</label>
                <input style={inputStyle} placeholder="e.g. Green Vista — 3BHK Premium Apartment" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe the property, key features, nearby landmarks..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Property type *</label>
                  <select style={inputStyle} value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                    {['apartment','villa','plot','commercial','farmhouse'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Listing for *</label>
                  <select style={inputStyle} value={form.listing_type} onChange={e => set('listing_type', e.target.value)}>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 12500000 for ₹1.25 Cr" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Price per sq.ft (₹)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 7000" value={form.price_per_sqft} onChange={e => set('price_per_sqft', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_negotiable} onChange={e => set('is_negotiable', e.target.checked)} style={{ accentColor: '#1D9E75' }} />
                  Price is negotiable
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#1D9E75' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Property details</h3>
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
                    {['Kokapet','Narsingi','Gachibowli','Kondapur','Madhapur','Banjara Hills','Jubilee Hills','Manikonda','Tellapur','Hitech City','Miyapur','Kompally'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input style={inputStyle} placeholder="500032" value={form.pincode} onChange={e => set('pincode', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Bedrooms</label>
                  <select style={inputStyle} value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Bathrooms</label>
                  <select style={inputStyle} value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}>
                    <option value="">Select</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Carpet area (sq.ft)</label>
                  <input style={inputStyle} type="number" placeholder="1200" value={form.carpet_area} onChange={e => set('carpet_area', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Floor number</label>
                  <input style={inputStyle} type="number" placeholder="3" value={form.floor_number} onChange={e => set('floor_number', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Total floors</label>
                  <input style={inputStyle} type="number" placeholder="10" value={form.total_floors} onChange={e => set('total_floors', e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Possession date</label>
                <input style={inputStyle} type="date" value={form.possession_date} onChange={e => set('possession_date', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
              <div style={{ width: '20px', height: '1px', background: '#1D9E75' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Legal & media</h3>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>RERA number</label>
                <input style={inputStyle} placeholder="e.g. REA02200013892" value={form.rera_number} onChange={e => set('rera_number', e.target.value)} />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                  RERA-verified listings get 40% more views. Find your number at rera.telangana.gov.in
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.oc_received} onChange={e => set('oc_received', e.target.checked)} style={{ accentColor: '#1D9E75' }} />
                  Occupancy certificate received
                </label>
              </div>

              <div>
                <label style={labelStyle}>Thumbnail image URL</label>
                <input style={inputStyle} placeholder="https://..." value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'DM Sans, sans-serif' }}>
                  Paste an image URL. We'll add full photo upload in the next update.
                </p>
              </div>

              {form.thumbnail_url && (
                <div>
                  <label style={labelStyle}>Preview</label>
                  <img src={form.thumbnail_url} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(26,26,22,0.08)' }} />
                </div>
              )}

              {/* Summary */}
              <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.06)' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>Listing summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                  {[
                    { label: 'Title',    val: form.title || '—' },
                    { label: 'Type',     val: form.property_type },
                    { label: 'For',      val: form.listing_type },
                    { label: 'Price',    val: form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—' },
                    { label: 'Locality', val: form.locality || '—' },
                    { label: 'BHK',      val: form.bedrooms ? `${form.bedrooms} BHK` : '—' },
                  ].map((f) => (
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

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(26,26,22,0.06)' }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            style={{ padding: '11px 24px', borderRadius: '8px', border: '1px solid rgba(26,26,22,0.12)', background: 'transparent', fontSize: '13px', fontWeight: 500, color: step === 1 ? 'var(--text-muted)' : 'var(--charcoal)', cursor: step === 1 ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            ← Previous
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{ padding: '11px 28px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }}>
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !form.title || !form.price || !form.locality}
              style={{ padding: '11px 28px', borderRadius: '8px', border: 'none', background: !form.title || !form.price || !form.locality ? 'rgba(26,26,22,0.1)' : '#1D9E75', color: !form.title || !form.price || !form.locality ? 'var(--text-muted)' : '#fff', fontSize: '13px', fontWeight: 600, cursor: !form.title || !form.price || !form.locality ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }}>
              {loading ? 'Publishing...' : '✦ Publish listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
