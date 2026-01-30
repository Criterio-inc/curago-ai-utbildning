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
    // Use RPC function to get stats from auth.users (requires service role key)
    const { data, error } = await supabase.rpc('get_landing_stats')

    if (!error && data) {
      return NextResponse.json({
        total_users: data.total_users ?? 0,
        active_users_today: data.active_users_today ?? 0,
        avg_completion_percentage: data.avg_completion_percentage ?? 0,
      })
    }

    // Fallback: calculate from user_progress table
    console.log('[/api/stats] RPC failed, using fallback:', error?.message)

    const today = new Date().toISOString().split('T')[0]
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, completed, completed_at, quiz_completed_at')

    // Count unique users
    const uniqueUsers = new Set((progressData || []).map(r => r.user_id))
    const totalUsers = uniqueUsers.size

    // Count active today
    const activeToday = new Set(
      (progressData || []).filter(row => {
        const completedDate = row.completed_at?.split('T')[0]
        const quizDate = row.quiz_completed_at?.split('T')[0]
        return completedDate === today || quizDate === today
      }).map(row => row.user_id)
    ).size

    // Calculate average completion percentage
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
      total_users: totalUsers,
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
