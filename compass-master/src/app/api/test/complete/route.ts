import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const baseUrl = new URL(request.url).origin
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
    const { session_id } = body

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Get session and all answers
    const { data: session } = await supabase
      .from('test_sessions')
      .select('*, profiles(*)')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Test already completed' },
        { status: 400 }
      )
    }

    // Get all answers
    const { data: answers } = await supabase
      .from('questions_log')
      .select('*')
      .eq('session_id', session_id)
      .order('sequence_number', { ascending: true })

    // ── COMPUTE SCORES DETERMINISTICALLY FROM SIGNALS ──
    // Don't trust Gemini to do math — tally signals ourselves
    const dims = ['iq', 'aq', 'eq', 'sq'] as const
    const oceanTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const

    // Tally: sum of signal values per dimension
    const dimTally: Record<string, { sum: number; count: number }> = {}
    for (const d of [...dims, ...oceanTraits]) {
      dimTally[d] = { sum: 0, count: 0 }
    }

    for (const a of answers ?? []) {
      const signals = a.dimension_tags ?? {}
      for (const key of Object.keys(signals)) {
        const val = Number(signals[key])
        if (key in dimTally && !isNaN(val)) {
          dimTally[key].sum += val
          dimTally[key].count += 1
        }
      }
    }

    // Convert tally to 0-100 score
    // signal range per question: -1 to +1
    // average signal: -1 to +1 → map to 0-100
    const tallyToScore = (t: { sum: number; count: number }): number => {
      if (t.count === 0) return 50 // no data → neutral
      const avg = t.sum / t.count // range: -1 to +1
      const raw = Math.round((avg + 1) * 50) // map to 0-100
      return Math.max(0, Math.min(100, raw))
    }

    const computedScores = {
      iq: tallyToScore(dimTally.iq),
      aq: tallyToScore(dimTally.aq),
      eq: tallyToScore(dimTally.eq),
      sq: tallyToScore(dimTally.sq),
      openness: tallyToScore(dimTally.openness),
      conscientiousness: tallyToScore(dimTally.conscientiousness),
      extraversion: tallyToScore(dimTally.extraversion),
      agreeableness: tallyToScore(dimTally.agreeableness),
      neuroticism: tallyToScore(dimTally.neuroticism),
    }
    const compassScore = Math.round(
      (computedScores.iq + computedScores.aq + computedScores.eq + computedScores.sq) / 4
    )

    console.log('=== COMPUTED SCORES FROM SIGNALS ===')
    console.log('Tallies:', JSON.stringify(dimTally))
    console.log('Scores:', JSON.stringify(computedScores))
    console.log('Compass:', compassScore)
    console.log('Answer count:', answers?.length ?? 0)
    console.log('====================================')

    // ── ASK GEMINI ONLY FOR INTERPRETATIONS ──
    const prompt = `You are Compass — a wise older sibling giving honest career feedback to an Indian youth.

${session.profiles?.name} is a ${session.profiles?.age} year old Indian ${session.profiles?.status}.

Their psychometric scores (already computed from their answers — DO NOT change these numbers):
- IQ (logical thinking): ${computedScores.iq}/100
- AQ (adaptability): ${computedScores.aq}/100
- EQ (emotional intelligence): ${computedScores.eq}/100
- SQ (social intelligence): ${computedScores.sq}/100
- Openness: ${computedScores.openness}/100
- Conscientiousness: ${computedScores.conscientiousness}/100
- Extraversion: ${computedScores.extraversion}/100
- Agreeableness: ${computedScores.agreeableness}/100
- Neuroticism: ${computedScores.neuroticism}/100
- Compass Score: ${compassScore}/100

Their answers:
${JSON.stringify(answers?.map(a => ({
      question: a.question_text,
      chosen: a.answer_chosen
    })), null, 2)}

Write interpretations for each dimension. Be warm but honest. Reference Indian context.
- If high (70-100): what this strength means practically
- If mid (40-69): what average means in real terms, not just "you're average"
- If low (0-39): what to work on and why it matters

Return JSON only:
{
  "iq_interpretation": "string",
  "aq_interpretation": "string",
  "eq_interpretation": "string",
  "sq_interpretation": "string",
  "ocean_interpretation": "string — how this personality plays out in Indian workplaces",
  "summary": "string — 2-3 sentences on their overall profile for Indian career context"
}`

    let rawText = ''
    let interpretations: Record<string, string> = {}
    try {
      rawText = await generateText(prompt)
      console.log('=== RAW GEMINI INTERPRETATION RESPONSE ===')
      console.log(rawText.substring(0, 500))
      console.log('==========================================')

      const clean = rawText.replace(/```json|```/g, '').trim()
      interpretations = JSON.parse(clean)
    } catch (err) {
      console.error('Gemini interpretation failed:', err)
      console.error('Raw text:', rawText.substring(0, 1000))
      // Fallback: generic interpretations so scoring still works
      interpretations = {
        iq_interpretation: `Your IQ score is ${computedScores.iq}/100.`,
        aq_interpretation: `Your AQ score is ${computedScores.aq}/100.`,
        eq_interpretation: `Your EQ score is ${computedScores.eq}/100.`,
        sq_interpretation: `Your SQ score is ${computedScores.sq}/100.`,
        ocean_interpretation: 'Personality profile computed from your answers.',
        summary: `Compass score: ${compassScore}/100. Complete profile based on ${answers?.length ?? 0} answers.`
      }
    }

    // Build final scores object using computed numbers (never Gemini's)
    const scores = {
      iq: { score: computedScores.iq, interpretation: interpretations.iq_interpretation },
      aq: { score: computedScores.aq, interpretation: interpretations.aq_interpretation },
      eq: { score: computedScores.eq, interpretation: interpretations.eq_interpretation },
      sq: { score: computedScores.sq, interpretation: interpretations.sq_interpretation },
      ocean: {
        openness: computedScores.openness,
        conscientiousness: computedScores.conscientiousness,
        extraversion: computedScores.extraversion,
        agreeableness: computedScores.agreeableness,
        neuroticism: computedScores.neuroticism,
        interpretation: interpretations.ocean_interpretation,
      },
      compass_score: compassScore,
      summary: interpretations.summary,
    }

    // Save scores
    const { data: savedScores, error: scoresError } = await supabase
      .from('psychometric_scores')
      .insert({
        user_id: user.id,
        session_id,
        iq_score: scores.iq.score,
        aq_score: scores.aq.score,
        eq_score: scores.eq.score,
        sq_score: scores.sq.score,
        ocean_profile: {
          openness: scores.ocean.openness,
          conscientiousness: scores.ocean.conscientiousness,
          extraversion: scores.ocean.extraversion,
          agreeableness: scores.ocean.agreeableness,
          neuroticism: scores.ocean.neuroticism
        },
        compass_score: scores.compass_score,
        interpretations: {
          iq: scores.iq.interpretation,
          aq: scores.aq.interpretation,
          eq: scores.eq.interpretation,
          sq: scores.sq.interpretation,
          ocean: scores.ocean.interpretation,
          summary: scores.summary
        }
      })
      .select()
      .single()

    if (scoresError) {
      console.error('Scores save error:', scoresError)
      return NextResponse.json(
        { success: false, error: 'Failed to save scores' },
        { status: 500 }
      )
    }

    // Update session status
    await supabase
      .from('test_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', session_id)

    // Trigger learning loop asynchronously
    fetch(`${baseUrl}/api/learn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id })
    }).catch(err => console.error('Learn trigger error:', err))

    return NextResponse.json({
      success: true,
      scores: savedScores
    })
  } catch (error) {
    console.error('Test complete error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
