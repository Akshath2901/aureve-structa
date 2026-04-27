import { createClient } from '@/lib/supabase/server'
import { StructaHomeClient } from '@/components/home/StructaHomeClient'

export default async function StructaHomePage() {
  const supabase = await createClient()

  const [{ data: materials }, { data: prices }, { count: total }] = await Promise.all([
    supabase.from('materials').select('id,name,slug,category,brand,unit').eq('is_active', true).limit(8),
    supabase.from('material_prices').select('material_id,price,price_change_pct').eq('city', 'Hyderabad'),
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const materialsWithPrices = (materials || []).map(m => ({
    ...m,
    price: prices?.find(p => p.material_id === m.id)?.price || 0,
    change: prices?.find(p => p.material_id === m.id)?.price_change_pct || 0,
  }))

  return <StructaHomeClient materials={materialsWithPrices} total={total || 0} />
}
