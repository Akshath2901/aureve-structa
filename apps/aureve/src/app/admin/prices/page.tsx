'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Material = {
  id: string
  name: string
  brand: string
  category: string
  unit: string
  current_price: number
  price_change_pct: number
  price_id: string
}

export default function AdminPricesPage() {
  const [materials,  setMaterials]  = useState<Material[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState<string | null>(null)
  const [saved,      setSaved]      = useState<string | null>(null)
  const [editPrices, setEditPrices] = useState<Record<string, string>>({})
  const [editPcts,   setEditPcts]   = useState<Record<string, string>>({})
  const [history,    setHistory]    = useState<any[]>([])

  useEffect(() => {
    fetchMaterials()
    fetchHistory()
  }, [])

  const fetchMaterials = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('materials')
      .select('id, name, brand, category, unit, material_prices(id, price, price_change_pct)')
      .eq('is_active', true)
      .order('category')

    if (data) {
      const flat = data.map((m: any) => ({
        id:              m.id,
        name:            m.name,
        brand:           m.brand,
        category:        m.category,
        unit:            m.unit,
        current_price:   m.material_prices?.[0]?.price || 0,
        price_change_pct:m.material_prices?.[0]?.price_change_pct || 0,
        price_id:        m.material_prices?.[0]?.id || '',
      }))
      setMaterials(flat)

      const prices: Record<string, string> = {}
      const pcts:   Record<string, string> = {}
      flat.forEach(m => {
        prices[m.id] = String(m.current_price)
        pcts[m.id]   = String(m.price_change_pct)
      })
      setEditPrices(prices)
      setEditPcts(pcts)
    }
    setLoading(false)
  }

  const fetchHistory = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('material_price_history')
      .select('*, materials(name)')
      .order('recorded_at', { ascending: false })
      .limit(10)
    setHistory(data || [])
  }

  const handleUpdate = async (material: Material) => {
    setSaving(material.id)
    const supabase  = createClient()
    const newPrice  = Number(editPrices[material.id])
    const newPct    = Number(editPcts[material.id])

    // Save old price to history
    await supabase.from('material_price_history').insert({
      material_id: material.id,
      city:        'Hyderabad',
      price:       material.current_price,
    })

    // Update current price
    if (material.price_id) {
      await supabase.from('material_prices').update({
        price:            newPrice,
        price_change_pct: newPct,
        recorded_at:      new Date().toISOString(),
      }).eq('id', material.price_id)
    } else {
      await supabase.from('material_prices').insert({
        material_id:      material.id,
        city:             'Hyderabad',
        price:            newPrice,
        price_change_pct: newPct,
      })
    }

    setSaving(null)
    setSaved(material.id)
    setTimeout(() => setSaved(null), 2000)
    fetchMaterials()
    fetchHistory()
  }

  const CATEGORY_COLORS: Record<string, string> = {
    cement:     '#C9A84C',
    steel:      '#4A4A45',
    bricks:     '#8B7355',
    sand:       '#D4A853',
    aggregates: '#6B6B65',
    tiles:      '#866820',
    paint:      '#A67C52',
  }

  const categories = [...new Set(materials.map(m => m.category))]

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(26,26,22,0.12)',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    background: '#fff',
    color: '#1A1A16',
    width: '100%',
  }

  return (
    <div style={{ padding: '2.5rem', background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>
            Structa admin
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>
            Material Price Manager
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
              Update live prices — changes reflect instantly on Structa
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(29,158,117,0.2)', borderRadius: '8px', padding: '8px 14px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1D9E75', fontFamily: 'DM Sans, sans-serif' }}>
            Live on structa.in
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, margin: 0 }}>
          Update prices daily based on Hyderabad market rates. Old prices are automatically saved to price history so users can see trends.
          Change % shows weekly movement — use positive for price rise, negative for price drop.
        </p>
      </div>

      {/* Materials by category */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Loading prices...</div>
      ) : (
        categories.map(category => {
          const catMaterials = materials.filter(m => m.category === category)
          const catColor = CATEGORY_COLORS[category] || '#C9A84C'

          return (
            <div key={category} style={{ marginBottom: '1.5rem' }}>
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '3px', height: '20px', background: catColor, borderRadius: '2px' }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)', textTransform: 'capitalize' }}>
                  {category}
                </h3>
                <span style={{ fontSize: '11px', background: `${catColor}15`, color: catColor, padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                  {catMaterials.length} materials
                </span>
              </div>

              <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                  <thead style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(26,26,22,0.06)' }}>
                    <tr>
                      {['Material', 'Brand', 'Unit', 'Current price (₹)', 'Change %', 'Last updated', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catMaterials.map((m, i) => (
                      <tr key={m.id} style={{ borderBottom: i < catMaterials.length - 1 ? '1px solid rgba(26,26,22,0.04)' : 'none', background: saved === m.id ? 'rgba(29,158,117,0.04)' : 'transparent', transition: 'background 0.3s' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{m.name}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{m.brand}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '11px', background: 'rgba(26,26,22,0.06)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                            per {m.unit}
                          </span>
                        </td>

                        {/* Editable price */}
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>₹</span>
                            <input
                              type="number"
                              value={editPrices[m.id] || ''}
                              onChange={e => setEditPrices(p => ({ ...p, [m.id]: e.target.value }))}
                              style={{ ...inputStyle, width: '90px' }}
                            />
                          </div>
                        </td>

                        {/* Editable change % */}
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={editPcts[m.id] || ''}
                              onChange={e => setEditPcts(p => ({ ...p, [m.id]: e.target.value }))}
                              style={{ ...inputStyle, width: '80px' }}
                              placeholder="0.0"
                            />
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>%</span>
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td style={{ padding: '10px 16px' }}>
                          {saved === m.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1D9E75', fontSize: '12px', fontWeight: 600 }}>
                              <span>✓</span> Saved
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdate(m)}
                              disabled={saving === m.id}
                              style={{
                                padding: '7px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                background: saving === m.id ? 'rgba(26,26,22,0.06)' : 'var(--charcoal)',
                                color: saving === m.id ? 'var(--text-muted)' : '#fff',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: saving === m.id ? 'not-allowed' : 'pointer',
                                fontFamily: 'DM Sans, sans-serif',
                                letterSpacing: '0.05em',
                                transition: 'all 0.2s',
                              }}>
                              {saving === m.id ? 'Saving...' : 'Update →'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })
      )}

      {/* Price history */}
      <div style={{ background: '#fff', border: '1px solid rgba(26,26,22,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,26,22,0.04)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold), transparent)' }} />
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,22,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '1px', background: 'var(--gold)' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--charcoal)' }}>Price update history</h3>
        </div>
        {history.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(26,26,22,0.2)', marginBottom: '6px' }}>No updates yet</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>When you update a price, the old price is saved here automatically</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead style={{ background: 'var(--cream)' }}>
              <tr>
                {['Material', 'Price recorded', 'City', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h: any, i) => (
                <tr key={h.id} style={{ borderTop: '1px solid rgba(26,26,22,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--charcoal)' }}>{h.materials?.name}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--gold-dark)' }}>₹{h.price}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{h.city}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {new Date(h.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  )
}
