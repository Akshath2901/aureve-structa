import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PropertyDetailClient } from '@/components/property/PropertyDetailClient'

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, property_amenities(*), property_images(*)')
    .eq('slug', slug)
    .single()

  if (!property) notFound()

  // Increment views
  await supabase.from('properties').update({ views_count: (property.views_count || 0) + 1 }).eq('id', property.id)

  const [{ data: similar }, { data: insight }] = await Promise.all([
    supabase.from('properties').select('id,title,slug,price,locality,bedrooms,thumbnail_url,listing_type').eq('locality', property.locality).neq('id', property.id).eq('is_active', true).limit(3),
    supabase.from('locality_insights').select('*').ilike('locality', `%${property.locality}%`).single(),
  ])

  return (
    <PropertyDetailClient
      property={property}
      similar={similar || []}
      insight={insight}
    />
  )
}
