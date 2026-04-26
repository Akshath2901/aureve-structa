import { createClient } from '@/lib/supabase/server'
import { HomeClient } from '@/components/home/HomeClient'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { count: totalProperties },
    { count: totalUsers },
    { data: featured },
    { data: localities },
    { data: recentProperties },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('id,title,slug,price,locality,bedrooms,carpet_area,thumbnail_url,listing_type,is_premium,is_featured,rera_number,property_type,price_per_sqft').eq('is_active', true).eq('is_featured', true).limit(6),
    supabase.from('locality_insights').select('*').order('growth_score', { ascending: false }).limit(8),
    supabase.from('properties').select('id,title,slug,price,locality,bedrooms,carpet_area,thumbnail_url,listing_type,is_premium,rera_number,property_type,created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <HomeClient
      totalProperties={totalProperties || 0}
      totalUsers={totalUsers || 0}
      featured={featured || []}
      localities={localities || []}
      recentProperties={recentProperties || []}
    />
  )
}
