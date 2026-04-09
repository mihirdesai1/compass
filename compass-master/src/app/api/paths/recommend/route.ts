import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini/client'
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
    const { session_id } = body

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Get scores and profile
    const { data: scores } = await supabase
      .from('psychometric_scores')
      .select('*, test_sessions(profiles(*))')
      .eq('session_id', session_id)
      .eq('user_id', user.id)
      .single()

    if (!scores) {
      return NextResponse.json(
        { success: false, error: 'Scores not found' },
        { status: 404 }
      )
    }

    // Get full answer history for this session
    const { data: answers } = await supabase
      .from('questions_log')
      .select('*')
      .eq('session_id', session_id)
      .order('sequence_number', { ascending: true })

    const profile = scores.test_sessions?.profiles
    const interpretations = scores.interpretations as Record<string, string>

    // Build prompt for path recommendations with Compass Philosophy
    const prompt = `You are Compass — an honest, research-backed career guide for Indians aged 18-26. You have access to real-time information about the Indian job market, colleges, salaries, and career paths.

User profile:
- Name: ${profile?.name}
- Age: ${profile?.age}
- Status: ${profile?.status}
- Psychometric scores: IQ ${scores.iq_score}/100, AQ ${scores.aq_score}/100, EQ ${scores.eq_score}/100, SQ ${scores.sq_score}/100, OCEAN: O${scores.ocean_profile?.openness} C${scores.ocean_profile?.conscientiousness} E${scores.ocean_profile?.extraversion} A${scores.ocean_profile?.agreeableness} N${scores.ocean_profile?.neuroticism}
- Compass score: ${scores.compass_score}/100
- Score interpretations: ${JSON.stringify(interpretations)}

Full answer history (${answers?.length || 0} questions):
${JSON.stringify(answers?.map(a => ({
  question: a.question_text,
  chosen: a.answer_chosen,
  signals: a.dimension_tags
})), null, 2)}

RULES FOR EVERY SINGLE RECOMMENDATION:

1. NEVER INFER. NEVER ASSUME.
   If you do not have a verified fact, do not state it.
   If a salary range is not confirmed, say "varies widely, research current openings on Naukri/LinkedIn before deciding"
   Never say "many companies" — name the actual companies.
   Never say "good salary" — give the actual number in INR per month.

2. FACT CHECK EVERYTHING IN REAL TIME.
   Verify current median salaries for this career in India (INR, not USD)
   Name which Indian companies actually hire for this role
   Name which bootcamps are actually respected by Indian hiring managers
   State what the actual job market looks like RIGHT NOW for this path

3. REALISTIC NOT MOTIVATIONAL.
   Do not say "you can do anything you set your mind to"
   Do say "this path typically takes 18-24 months to get first job"
   Do say "entry level salary in this field in Pune/Mumbai is X-Y per month"
   Do say "here are 3 companies in India actively hiring for this right now"
   Do say "this certification costs X and takes Y months"

4. STEP BY STEP. COMPLETE. NO GAPS.
   Every path must include exact next actions, timelines, costs in INR, first job targets, exact resources with URLs

5. INDIA SPECIFIC. ALWAYS.
   Never recommend something that does not work in India.
   Never cite US salaries or US companies as benchmarks.
   Ground advice in Indian cities, Indian companies, Indian salaries.

6. RESPECTFUL OF THE USER'S SITUATION.
   A dropout is not a failure. Say so directly.
   Never condescend. Never pity. Never overpraise.

Recommend exactly 2 realistic Indian career paths that fit ${profile?.name} based on their psychometric profile.

For each path provide:

PATH NAME: [specific, not vague — e.g. 'UX Designer at a Bangalore product startup' not just 'Design']

WHY THIS FITS ${profile?.name} SPECIFICALLY:
Write 3 sentences using their actual psychometric scores as evidence.

REALITY CHECK:
- Entry level salary in India for this role: [exact INR range per month]
- Time to first job from today: [exact months]
- Total cost to get there: [exact INR]
- Hardest part of this path: [one honest sentence]
- Who actually hires for this in India: [3-5 company names]

WEEK BY WEEK PLAN FOR FIRST 30 DAYS:
Week 1: [exact action — what to do, where to go, what to sign up for]
Week 2: [exact action]
Week 3: [exact action]
Week 4: [exact action]

MONTHS 2-6 ROADMAP:
Month 2: [exact milestone]
Month 3: [exact milestone]
Month 4: [exact milestone]
Month 5: [exact milestone]
Month 6: [exact milestone — what should they have achieved by now]

SKILLS TO BUILD IN ORDER:
[List in exact sequence]

RESOURCES WITH REAL LINKS AND PRICES:
[Course name] — [platform] — [exact price in INR] — [URL]
[Course name] — [platform] — [exact price in INR] — [URL]
[YouTube channel] — [what it covers] — [free]
[Community] — [where] — [how to join]

HONEST WARNING:
One paragraph. What is genuinely hard about this path for someone with ${profile?.name}'s specific profile. No sugarcoating. Just truth.

Return JSON only matching this structure:
{
  "path_1": {
    "name": "string",
    "tagline": "string",
    "why_it_fits": "string",
    "next_30_days": ["string", "string", "string", "string"],
    "skills_to_build": ["string", "string", "string"],
    "resources": [{"name": "string", "url": "string", "type": "course|video|article|institution|bootcamp|community"}],
    "honest_warning": "string"
  },
  "path_2": { same structure }
}`

    let paths
    let lastError
    const maxRetries = 3

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await generateText(prompt)
        console.log('=== RAW GEMINI PATH RESPONSE ===')
        console.log('Attempt:', attempt + 1)
        console.log('Raw text:', result)
        console.log('================================')

        const clean = result.replace(/```json|```/g, '').trim()
        paths = JSON.parse(clean)

        if (!paths.path_1 || !paths.path_2) {
          throw new Error('Invalid path response structure — missing path_1 or path_2')
        }

        break
      } catch (err) {
        lastError = err
        console.error(`Gemini path attempt ${attempt + 1} failed:`, err)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
        }
      }
    }

    if (!paths) {
      console.error('All Gemini path retries exhausted. Last error:', lastError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate path recommendations after multiple attempts' },
        { status: 500 }
      )
    }

    // Save paths
    const { data: savedPaths, error: pathsError } = await supabase
      .from('path_recommendations')
      .insert({
        user_id: user.id,
        session_id,
        path_1: paths.path_1,
        path_2: paths.path_2
      })
      .select()
      .single()

    if (pathsError) {
      console.error('Paths save error:', pathsError)
      return NextResponse.json(
        { success: false, error: 'Failed to save paths' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      path_1: paths.path_1,
      path_2: paths.path_2,
      recommendation_id: savedPaths.id
    })
  } catch (error) {
    console.error('Path recommend error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
