import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { PropertiesShell } from '@/components/properties/PropertiesClient'

interface PageProps {
  searchParams: Promise<{
    type?: string; category?: string; locality?: string
    beds?: string; q?: string; sort?: string; view?: string
  }>
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params   = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('id,title,slug,price,price_per_sqft,locality,city,bedrooms,bathrooms,carpet_area,built_up_area,thumbnail_url,rera_number,listing_type,status,property_type,is_featured,is_premium,possession_date,views_count,description')
    .eq('is_active', true)

  if (params.type     && ['sale','rent'].includes(params.type)) query = query.eq('listing_type', params.type)
  if (params.category) query = query.eq('property_type', params.category)
  if (params.locality) query = query.ilike('locality', `%${params.locality}%`)
  if (params.beds)     query = query.eq('bedrooms', parseInt(params.beds))
  if (params.q)        query = query.ilike('title', `%${params.q}%`)

  if      (params.sort === 'price_low')  query = query.order('price', { ascending: true })
  else if (params.sort === 'price_high') query = query.order('price', { ascending: false })
  else if (params.sort === 'newest')     query = query.order('created_at', { ascending: false })
  else if (params.sort === 'popular')    query = query.order('views_count', { ascending: false })
  else query = query.order('is_featured', { ascending: false }).order('is_premium', { ascending: false }).order('views_count', { ascending: false })

  const { data: properties = [] } = await query.limit(30)
  const { count: total }          = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true)

  return (
    <Suspense fallback={null}>
      <PropertiesShell
        properties={properties || []}
        total={total || 0}
        params={params}
      />
    </Suspense>
  )
}
