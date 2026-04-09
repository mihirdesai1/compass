import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'mihird5554@gmail.com'

export async function GET() {
  try {
    // Verify the requesting user is the admin
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Use service role key to bypass RLS and read all data
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: false, error: 'Service role key not configured' }, { status: 500 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Total users
    const { count: totalUsers } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Total completed tests
    const { count: totalCompleted } = await admin
      .from('test_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Total started tests
    const { count: totalStarted } = await admin
      .from('test_sessions')
      .select('*', { count: 'exact', head: true })

    // Average compass score
    const { data: scoreData } = await admin
      .from('psychometric_scores')
      .select('compass_score')

    const avgScore = scoreData && scoreData.length > 0
      ? Math.round(scoreData.reduce((sum, s) => sum + s.compass_score, 0) / scoreData.length)
      : 0

    // Most recommended paths
    const { data: pathData } = await admin
      .from('path_recommendations')
      .select('path_1, path_2')

    const path1Names: Record<string, number> = {}
    const path2Names: Record<string, number> = {}
    pathData?.forEach((p) => {
      const p1 = (p.path_1 as any)?.name
      const p2 = (p.path_2 as any)?.name
      if (p1) path1Names[p1] = (path1Names[p1] || 0) + 1
      if (p2) path2Names[p2] = (path2Names[p2] || 0) + 1
    })
    const topPath1 = Object.entries(path1Names).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A'
    const topPath2 = Object.entries(path2Names).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A'

    // All users with their latest score and path
    const { data: users } = await admin
      .from('profiles')
      .select(`
        id,
        name,
        age,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })

    // Get latest score for each user
    const { data: allScores } = await admin
      .from('psychometric_scores')
      .select('user_id, compass_score, created_at')
      .order('created_at', { ascending: false })

    const { data: allPaths } = await admin
      .from('path_recommendations')
      .select('user_id, path_1, created_at')
      .order('created_at', { ascending: false })

    const latestScoreByUser: Record<string, number> = {}
    allScores?.forEach((s) => {
      if (!(s.user_id in latestScoreByUser)) {
        latestScoreByUser[s.user_id] = s.compass_score
      }
    })

    const latestPathByUser: Record<string, string> = {}
    allPaths?.forEach((p) => {
      if (!(p.user_id in latestPathByUser)) {
        latestPathByUser[p.user_id] = (p.path_1 as any)?.name ?? 'N/A'
      }
    })

    const enrichedUsers = users?.map((u) => ({
      name: u.name,
      age: u.age,
      status: u.status,
      compass_score: latestScoreByUser[u.id] ?? null,
      chosen_path: latestPathByUser[u.id] ?? 'No test yet',
      date: u.created_at,
    })) ?? []

    const dropoffRate = totalStarted && totalStarted > 0
      ? Math.round(((totalStarted - (totalCompleted ?? 0)) / totalStarted) * 100)
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers ?? 0,
        totalCompleted: totalCompleted ?? 0,
        totalStarted: totalStarted ?? 0,
        avgScore,
        topPath1,
        topPath2,
        dropoffRate,
      },
      users: enrichedUsers,
    })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
