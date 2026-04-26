import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const supabase  = await createClient()

  const property_id = formData.get('property_id') as string
  const name        = formData.get('name') as string
  const phone       = formData.get('phone') as string
  const email       = formData.get('email') as string
  const message     = formData.get('message') as string

  if (!property_id || !name || !phone) {
    return NextResponse.redirect(new URL('/?error=missing_fields', request.url))
  }

  await supabase.from('property_enquiries').insert({
    property_id,
    name,
    phone,
    email,
    message,
    is_contacted: false,
  })

  const { data: property } = await supabase
    .from('properties')
    .select('slug')
    .eq('id', property_id)
    .single()

  const redirectUrl = property?.slug
    ? `/property/${property.slug}?enquiry=success`
    : '/?enquiry=success'

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
