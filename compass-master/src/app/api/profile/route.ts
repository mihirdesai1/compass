import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, age, status } = body

    // Validate input
    if (!name || !age || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (age < 18 || age > 26) {
      return NextResponse.json(
        { success: false, error: 'Age must be between 18 and 26' },
        { status: 400 }
      )
    }

    const validStatuses = ['studying', 'graduated', 'dropped', 'working']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { id: user.id, name, age, status },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) {
      console.error('Profile upsert error:', error.code, error.message, error.details)
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error('Profile POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        )
      }
      console.error('Profile fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
