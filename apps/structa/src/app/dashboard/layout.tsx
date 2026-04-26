import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StructaDashboardSidebar } from '@/components/dashboard/StructaDashboardSidebar'

export default async function StructaDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('structa_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--concrete)', display: 'flex', paddingTop: '64px' }}>
      <StructaDashboardSidebar profile={profile} />
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
