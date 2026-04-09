import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all completed sessions with scores and paths
    const { data: sessions, error } = await supabase
      .from('test_sessions')
      .select(`
        id,
        started_at,
        completed_at,
        psychometric_scores (
          compass_score,
          iq_score,
          aq_score,
          eq_score,
          sq_score
        ),
        path_recommendations (
          path_1,
          path_2
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('History fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch history' },
        { status: 500 }
      )
    }

    // Format the response
    const formattedSessions = sessions?.map(session => {
      const scores = session.psychometric_scores as any
      const paths = session.path_recommendations as any

      // Determine strongest dimension
      const dimensions = [
        { name: 'IQ', score: scores?.iq_score || 0 },
        { name: 'AQ', score: scores?.aq_score || 0 },
        { name: 'EQ', score: scores?.eq_score || 0 },
        { name: 'SQ', score: scores?.sq_score || 0 }
      ]
      const strongest = dimensions.sort((a, b) => b.score - a.score)[0]

      return {
        session_id: session.id,
        date: session.completed_at,
        compass_score: scores?.compass_score || 0,
        strongest_dimension: strongest?.name || 'N/A',
        paths: [
          { name: paths?.path_1?.name || 'Path 1', tagline: paths?.path_1?.tagline || '' },
          { name: paths?.path_2?.name || 'Path 2', tagline: paths?.path_2?.tagline || '' }
        ]
      }
    }) || []

    return NextResponse.json({
      success: true,
      sessions: formattedSessions
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
