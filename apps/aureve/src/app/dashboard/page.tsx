import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BuyerDashboard }   from '@/components/dashboard/BuyerDashboard'
import { SellerDashboard }  from '@/components/dashboard/SellerDashboard'
import { AgentDashboard }   from '@/components/dashboard/AgentDashboard'
import { BuilderDashboard } from '@/components/dashboard/BuilderDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth/login')

  const role = profile.role

  if (role === 'buyer') {
    const [{ data: saved }, { data: enquiries }] = await Promise.all([
      supabase.from('saved_properties').select('*, properties(id,title,slug,price,locality,thumbnail_url)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('property_enquiries').select('*').eq('phone', profile.phone || '').order('created_at', { ascending: false }),
    ])
    return <BuyerDashboard profile={profile} saved={saved || []} enquiries={enquiries || []} />
  }

  if (role === 'seller') {
    const [{ data: listings }, { data: enquiries }] = await Promise.all([
      supabase.from('properties').select('*').eq('builder_id', user.id).order('created_at', { ascending: false }),
      supabase.from('property_enquiries').select('*'),
    ])
    return <SellerDashboard profile={profile} listings={listings || []} enquiries={enquiries || []} />
  }

  if (role === 'agent') {
    return <AgentDashboard profile={profile} />
  }

  if (role === 'builder') {
    const { data: projects } = await supabase.from('properties').select('*').eq('builder_id', user.id).order('created_at', { ascending: false })
    return <BuilderDashboard profile={profile} projects={projects || []} />
  }

  if (role === 'admin') {
    redirect('/admin')
  }

  return <BuyerDashboard profile={profile} saved={[]} enquiries={[]} />
}
