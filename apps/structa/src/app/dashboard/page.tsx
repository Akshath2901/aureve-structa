import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContractorDashboard } from '@/components/dashboard/ContractorDashboard'
import { SupplierDashboard } from '@/components/dashboard/SupplierDashboard'

export default async function StructaDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('structa_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: materials } = await supabase
    .from('materials')
    .select('id, name, category, unit, material_prices(price, price_change_pct)')
    .eq('is_active', true)
    .limit(6)

  if (profile?.role === 'supplier') return <SupplierDashboard profile={profile} />
  return <ContractorDashboard profile={profile} materials={materials || []} />
}
