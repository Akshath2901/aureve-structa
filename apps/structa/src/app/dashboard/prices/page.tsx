'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SupplierPricesPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [editPrices, setEditPrices] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string|null>(null)
  const [saved, setSaved] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('materials').select('id, name, category, unit, material_prices(id, price, price_change_pct)').eq('is_active', true).then(({ data }) => {
      if (data) {
        setMaterials(data)
        const prices: Record<string, string> = {}
        data.forEach((m: any) => { prices[m.id] = String(m.material_prices?.[0]?.price || '') })
        setEditPrices(prices)
      }
      setLoading(false)
    })
  }, [])

  const handleUpdate = async (m: any) => {
    setSaving(m.id)
    const supabase = createClient()
    const newPrice = Number(editPrices[m.id])
    const currentPrice = m.material_prices?.[0]?.price || 0
    const changePct = currentPrice > 0 ? ((newPrice - currentPrice) / currentPrice * 100) : 0

    if (m.material_prices?.[0]?.id) {
      await supabase.from('material_prices').update({ price: newPrice, price_change_pct: Number(changePct.toFixed(1)) }).eq('id', m.material_prices[0].id)
    }
    setSaving(null)
    setSaved(m.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(17,25,39,0.12)', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff', width: '100px' }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: '#8A96A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>Supplier portal</p>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 600, color: '#111927', marginBottom: '4px' }}>Update Prices</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: '#F59E0B', borderRadius: '1px' }} />
          <p style={{ fontSize: '13px', color: '#8A96A8', fontFamily: 'Inter, sans-serif' }}>Update your material prices — reflected live on Structa</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid rgba(17,25,39,0.08)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(17,25,39,0.04)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(17,25,39,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75' }} />
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111927' }}>Material prices — Hyderabad</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
          <thead style={{ background: 'var(--concrete)' }}>
            <tr>
              {['Material', 'Category', 'Unit', 'Your price (₹)', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A96A8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((m: any, i) => (
              <tr key={m.id} style={{ borderTop: '1px solid rgba(17,25,39,0.04)', background: saved === m.id ? 'rgba(29,158,117,0.04)' : 'transparent', transition: 'background 0.3s' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500, color: '#111927', fontFamily: 'Space Grotesk, sans-serif' }}>{m.name}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(224,123,57,0.1)', color: '#E07B39', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'capitalize' }}>{m.category}</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#8A96A8' }}>per {m.unit}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#8A96A8' }}>₹</span>
                    <input type="number" style={inputStyle} value={editPrices[m.id] || ''} onChange={e => setEditPrices(p => ({ ...p, [m.id]: e.target.value }))} />
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {saved === m.id ? (
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1D9E75', fontFamily: 'Space Grotesk, sans-serif' }}>✓ Updated</span>
                  ) : (
                    <button onClick={() => handleUpdate(m)} disabled={saving === m.id || !editPrices[m.id]} style={{ padding: '7px 16px', borderRadius: '6px', border: 'none', background: saving === m.id ? 'rgba(17,25,39,0.06)' : '#1E2A3A', color: saving === m.id ? '#8A96A8' : '#fff', fontSize: '11px', fontWeight: 600, cursor: saving === m.id ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
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
}
