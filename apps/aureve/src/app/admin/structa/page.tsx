import { createClient } from '@/lib/supabase/server'

export default async function StructaAdminPage() {
  const supabase = await createClient()

  const { data: materials } = await supabase
    .from('materials')
    .select('*, material_prices(*)')
    .eq('is_active', true)

  return (
    <div style={{ padding: '2rem', background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E07B39', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Platform overview</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>Structa Dashboard</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Construction intelligence — material prices & suppliers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Materials tracked', value: materials?.length || 0, color: '#E07B39' },
          { label: 'Price records',     value: materials?.reduce((a, m) => a + (m.material_prices?.length || 0), 0) || 0, color: '#F59E0B' },
          { label: 'Suppliers',         value: 4,                       color: '#10B981' },
          { label: 'Calculator uses',   value: 0,                       color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, ${s.color}60, transparent)` }} />
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Materials price table */}
      <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', background: '#E07B39' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#fff' }}>Live material prices</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Live</span>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Material', 'Brand', 'Category', 'Unit', 'Price (Hyd)', 'Change', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials?.map((m: any, i) => {
              const price = m.material_prices?.[0]
              return (
                <tr key={m.id} style={{ borderBottom: i < materials.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#fff' }}>{m.name}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{m.brand}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(224,123,57,0.15)', color: '#E07B39', padding: '2px 8px', borderRadius: '3px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {m.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)' }}>{m.unit}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#E07B39' }}>
                    {price ? `₹${price.price}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {price?.price_change_pct ? (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: price.price_change_pct > 0 ? '#EF4444' : '#10B981' }}>
                        {price.price_change_pct > 0 ? '▲' : '▼'} {Math.abs(price.price_change_pct)}%
                      </span>
                    ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ fontSize: '11px', color: '#E07B39', background: 'transparent', border: '1px solid rgba(224,123,57,0.3)', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                      Update
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
