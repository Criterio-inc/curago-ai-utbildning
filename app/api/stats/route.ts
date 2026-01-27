import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Never cache — stats should always reflect current state
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Call the database function — works with both anon key and service role key
  const { data, error } = await supabase.rpc('get_landing_stats')

  if (error) {
    console.error('[/api/stats] RPC error:', error.message)
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }

  return NextResponse.json({
    total_users: data?.total_users ?? 0,
    active_users_today: data?.active_users_today ?? 0,
    avg_completion_percentage: data?.avg_completion_percentage ?? 0,
  })
}
