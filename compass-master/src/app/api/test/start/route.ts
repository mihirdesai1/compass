import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('test_sessions')
      .insert({
        user_id: user.id,
        status: 'in_progress',
        confidence_map: { iq: 0, aq: 0, eq: 0, sq: 0, ocean: 0 }
      })
      .select()
      .single()

    if (error) {
      console.error('Test start error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to start test' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session_id: data.id,
      status: data.status
    })
  } catch (error) {
    console.error('Test start error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
