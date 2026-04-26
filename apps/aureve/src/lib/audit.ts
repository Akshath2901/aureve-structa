import { createClient } from '@/lib/supabase/client'

export async function logAdminAction({
  action,
  entityType,
  entityId,
  description,
  metadata,
}: {
  action: string
  entityType: string
  entityId?: string
  description?: string
  metadata?: Record<string, any>
}) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('audit_logs').insert({
      admin_id:    user.id,
      action,
      entity_type: entityType,
      entity_id:   entityId || null,
      description: description || null,
      metadata:    metadata || null,
    })
  } catch (e) {
    console.error('Audit log failed:', e)
  }
}
