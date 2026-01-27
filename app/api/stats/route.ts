import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Never cache — stats should always reflect current state
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[/api/stats] Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // --- Total users & active today from auth.users ---
  let totalUsers = 0
  let activeToday = 0

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  })

  if (usersError) {
    console.error('[/api/stats] listUsers error:', usersError.message)
  } else {
    const users = usersData?.users ?? []
    totalUsers = users.length

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    activeToday = users.filter((u) => {
      if (!u.last_sign_in_at) return false
      return new Date(u.last_sign_in_at) >= todayStart
    }).length
  }

  // --- Average completion from user_progress ---
  let avgCompletion = 0

  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('user_id, completed')

  if (progressError) {
    console.error('[/api/stats] user_progress error:', progressError.message)
  } else if (progress && progress.length > 0) {
    const TOTAL_MODULES = 6
    const perUser: Record<string, number> = {}

    for (const row of progress) {
      if (!perUser[row.user_id]) perUser[row.user_id] = 0
      if (row.completed) perUser[row.user_id]++
    }

    const completions = Object.values(perUser)
    if (completions.length > 0) {
      avgCompletion = Math.round(
        completions.reduce((sum, c) => sum + (c / TOTAL_MODULES) * 100, 0) /
          completions.length
      )
    }
  }

  return NextResponse.json({
    total_users: totalUsers,
    active_users_today: activeToday,
    avg_completion_percentage: avgCompletion,
  })
}
