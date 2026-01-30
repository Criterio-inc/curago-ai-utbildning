import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Never cache — stats should always reflect current state
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_progress')
      .select('user_id', { count: 'exact', head: true })

    // For active users, we count distinct users in user_progress
    // (since we can't query auth.users directly with anon key)
    const today = new Date().toISOString().split('T')[0]
    const { data: activeData } = await supabase
      .from('user_progress')
      .select('user_id, completed_at, quiz_completed_at')

    const activeToday = new Set(
      (activeData || []).filter(row => {
        const completedDate = row.completed_at?.split('T')[0]
        const quizDate = row.quiz_completed_at?.split('T')[0]
        return completedDate === today || quizDate === today
      }).map(row => row.user_id)
    ).size

    // Calculate average completion percentage
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed')

    // Group by user and calculate percentage
    const userProgress: Record<string, number> = {}
    for (const row of progressData || []) {
      if (!userProgress[row.user_id]) {
        userProgress[row.user_id] = 0
      }
      if (row.completed) {
        userProgress[row.user_id]++
      }
    }

    const userIds = Object.keys(userProgress)
    const avgPct = userIds.length > 0
      ? Math.round(
          userIds.reduce((sum, id) => sum + (userProgress[id] / 6) * 100, 0) / userIds.length
        )
      : 0

    return NextResponse.json({
      total_users: userIds.length || totalUsers || 0,
      active_users_today: activeToday,
      avg_completion_percentage: avgPct,
    })
  } catch (error) {
    console.error('[/api/stats] Error:', error)
    return NextResponse.json({
      total_users: 0,
      active_users_today: 0,
      avg_completion_percentage: 0,
    })
  }
}
