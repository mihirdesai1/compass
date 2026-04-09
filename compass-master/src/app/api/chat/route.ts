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
    const { path_id, message, conversation_history = [], choice = 1 } = body

    if (!path_id || !message) {
      return NextResponse.json(
        { success: false, error: 'Path ID and message required' },
        { status: 400 }
      )
    }

    // Get path recommendation and user profile
    const { data: pathData } = await supabase
      .from('path_recommendations')
      .select('*, psychometric_scores(*, test_sessions(profiles(*)))')
      .eq('id', path_id)
      .eq('user_id', user.id)
      .single()

    if (!pathData) {
      return NextResponse.json(
        { success: false, error: 'Path not found' },
        { status: 404 }
      )
    }

    const profile = pathData.psychometric_scores?.test_sessions?.profiles
    const scores = pathData.psychometric_scores
    const chosenPath = choice === 2 ? pathData.path_2 : pathData.path_1

    // Build prompt for chat with Compass Philosophy
    const prompt = `You are Compass — ${profile?.name}'s personal career guide.

You know everything about ${profile?.name}:
- Age: ${profile?.age}, Status: ${profile?.status}
- Psychometric profile: IQ ${scores?.iq_score}/100, AQ ${scores?.aq_score}/100, EQ ${scores?.eq_score}/100, SQ ${scores?.sq_score}/100, OCEAN: O${scores?.ocean_profile?.openness} C${scores?.ocean_profile?.conscientiousness} E${scores?.ocean_profile?.extraversion} A${scores?.ocean_profile?.agreeableness} N${scores?.ocean_profile?.neuroticism}
- Chosen path: ${chosenPath?.name}
- Their 30 day plan: ${JSON.stringify(chosenPath?.next_30_days)}
- Conversation so far: ${conversation_history.slice(-5).map((m: any) => `${m.role}: ${m.content}`).join('\n')}

COMPASS PHILOSOPHY - FOLLOW STRICTLY:

1. NEVER INFER. NEVER ASSUME.
   If you do not have a verified fact, say "I don't have current data on that — verify on [specific source]"
   Never guess salary numbers. Never guess company hiring status.

2. FACT CHECK IN REAL TIME.
   Use your knowledge of current Indian job market (2024-2025 data).
   Current salaries in INR per month only.
   Indian companies only.

3. REALISTIC NOT MOTIVATIONAL.
   Never say "follow your passion" or "you can do anything"
   Do say "this takes X months based on current market"
   Do say "entry salary is Y in Bangalore, Z in Pune"

4. INDIA SPECIFIC. ALWAYS.
   Reference Indian cities, companies, salaries, culture.
   Acknowledge family pressure, financial constraints, tier-2/3 realities.

5. RESPECTFUL DIRECTNESS.
   A dropout is not a failure. Say so.
   Never condescend. Never pity. Never overpraise.

When ${profile?.name} asks you "${message}":

- If it is a factual question (salary, college, company, course): give the exact verified answer with source if possible. Never guess.
- If it is an emotional question (am I good enough, should I quit): acknowledge the feeling in one sentence, then give evidence-based answer.
- If it is a planning question (what do I do next): give the exact next step, not a general direction.
- If you do not know something: say "I am not certain about this — verify on Naukri/LinkedIn/Institute website" rather than guessing.

Tone: Direct. Warm. Never preachy. Never vague.
Length: Answer completely but concisely (under 150 words).
India context: Always. Salaries in INR. Companies in India.

Your response:`

    let response
    try {
      response = await generateText(prompt)
    } catch (geminiError) {
      console.error('Gemini chat error:', geminiError)
      response = "I'm here to help. Could you tell me more about what's worrying you? Sometimes just talking it out helps."
    }

    // Update or create chat record
    const { data: existingChat } = await supabase
      .from('guidance_chats')
      .select('*')
      .eq('path_recommendation_id', path_id)
      .eq('user_id', user.id)
      .single()

    const newMessages = [
      ...conversation_history,
      { id: Date.now().toString(), role: 'user', content: message, created_at: new Date().toISOString() },
      { id: (Date.now() + 1).toString(), role: 'assistant', content: response, created_at: new Date().toISOString() }
    ]

    if (existingChat) {
      await supabase
        .from('guidance_chats')
        .update({ messages: newMessages })
        .eq('id', existingChat.id)
    } else {
      await supabase
        .from('guidance_chats')
        .insert({
          user_id: user.id,
          path_recommendation_id: path_id,
          messages: newMessages
        })
    }

    return NextResponse.json({
      success: true,
      response
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
