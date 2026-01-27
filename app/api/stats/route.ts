import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Revalidate every 60 seconds so stats stay fresh without hammering the DB
export const revalidate = 60

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    // --- Total users & active today from auth.users ---
    const { data: { users } } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    })

    const totalUsers = users?.length ?? 0

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const activeToday = users?.filter((u) => {
      if (!u.last_sign_in_at) return false
      return new Date(u.last_sign_in_at) >= todayStart
    }).length ?? 0

    // --- Average completion from user_progress ---
    const { data: progress } = await supabase
      .from('user_progress')
      .select('user_id, completed')

    const TOTAL_MODULES = 6
    const perUser: Record<string, number> = {}

    if (progress) {
      for (const row of progress) {
        if (!perUser[row.user_id]) perUser[row.user_id] = 0
        if (row.completed) perUser[row.user_id]++
      }
    }

    const completions = Object.values(perUser)
    const avgCompletion =
      completions.length > 0
        ? Math.round(
            completions.reduce((sum, c) => sum + (c / TOTAL_MODULES) * 100, 0) /
              completions.length
          )
        : 0

    return NextResponse.json({
      total_users: totalUsers,
      active_users_today: activeToday,
      avg_completion_percentage: avgCompletion,
    })
  } catch {
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }
}
