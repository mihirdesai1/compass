import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini/client'
import { NextResponse } from 'next/server'
import {
  calculateSignalVariance,
  runLearningLoop,
  getGrowthMetrics,
  VARIANCE_CONFIG
} from '@/lib/growth-analyzer'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Note: This endpoint can be called without auth for async processing
    const body = await request.json()
    const { session_id, trigger_learning_loop = false } = body

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Get session data
    const { data: session } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get all answers
    const { data: answers } = await supabase
      .from('questions_log')
      .select('*')
      .eq('session_id', session_id)
      .order('sequence_number', { ascending: true })

    // Get scores
    const { data: scores } = await supabase
      .from('psychometric_scores')
      .select('*')
      .eq('session_id', session_id)
      .single()

    // Get current question performance
    const { data: questionPerformance } = await supabase
      .from('question_performance')
      .select('*')

    // Calculate signal variance for each question in this session
    const varianceResults: Awaited<ReturnType<typeof calculateSignalVariance>>[] = []
    for (const answer of answers || []) {
      const variance = await calculateSignalVariance(answer.question_text)
      if (variance) {
        varianceResults.push(variance)
      }
    }

    // Update question weights based on variance analysis
    const weightUpdates: {
      question_hash: string
      old_weight: number
      new_weight: number
      reason: string
      variance: number
    }[] = []

    for (const result of varianceResults) {
      if (!result) continue

      let newWeight = result.current_weight
      let reason = ''

      // Apply weight adjustments based on signal variance
      if (result.recommendation === 'boost') {
        newWeight = Math.min(
          result.current_weight + VARIANCE_CONFIG.WEIGHT_BOOST_AMOUNT,
          VARIANCE_CONFIG.MAX_WEIGHT
        )
        reason = `High signal variance (${result.variance.toFixed(4)}) - question differentiates users well`
      } else if (result.recommendation === 'reduce') {
        newWeight = Math.max(
          result.current_weight - VARIANCE_CONFIG.WEIGHT_REDUCE_AMOUNT,
          VARIANCE_CONFIG.MIN_WEIGHT
        )
        reason = `Low signal variance (${result.variance.toFixed(4)}) - most users answer similarly`
      }

      // Only update if weight changed
      if (newWeight !== result.current_weight) {
        await supabase
          .from('question_performance')
          .update({
            predictive_score: newWeight,
            last_updated: new Date().toISOString()
          })
          .eq('question_hash', result.question_hash)

        weightUpdates.push({
          question_hash: result.question_hash,
          old_weight: result.current_weight,
          new_weight: newWeight,
          reason,
          variance: result.variance
        })
      }
    }

    // Build prompt for learning analysis (enhanced with variance data)
    const prompt = `Analyze this completed Compass session to improve question strategy.

Questions asked: ${answers?.length}
Final scores: ${JSON.stringify({
      iq: scores?.iq_score,
      aq: scores?.aq_score,
      eq: scores?.eq_score,
      sq: scores?.sq_score,
      compass: scores?.compass_score
    })}

Question history:
${answers?.map((a, i) => `${i + 1}. ${a.question_text} - Answer: ${a.answer_chosen}`).join('\n')}

Signal Variance Analysis:
${varianceResults.filter(r => r !== null).map(r => `- ${r?.question_hash}: variance=${r?.variance}, recommendation=${r?.recommendation}`).join('\n')}

Return JSON only:
{
  "question_updates": [{"question_hash": "string", "new_predictive_weight": number, "reasoning": "string"}],
  "questions_to_retire": ["hash1", "hash2"],
  "new_questions_to_add": [{"text": "string", "options": ["a", "b", "c", "d"], "dimension_tags": {"iq": 0.5}, "rationale": "string"}],
  "strategy_insight": "string"
}`

    let analysis
    try {
      const result = await generateText(prompt)
      analysis = JSON.parse(result)
    } catch (geminiError) {
      console.error('Gemini learning error:', geminiError)
      analysis = {
        question_updates: [],
        questions_to_retire: [],
        new_questions_to_add: [],
        strategy_insight: 'Test completed successfully. Using variance-based weight updates.'
      }
    }

    // Merge AI suggestions with variance-based updates
    for (const update of analysis.question_updates || []) {
      const existing = weightUpdates.find(w => w.question_hash === update.question_hash)
      if (!existing) {
        await supabase
          .from('question_performance')
          .update({ predictive_score: update.new_predictive_weight })
          .eq('question_hash', update.question_hash)

        weightUpdates.push({
          question_hash: update.question_hash,
          old_weight: questionPerformance?.find(q => q.question_hash === update.question_hash)?.predictive_score || 1.0,
          new_weight: update.new_predictive_weight,
          reason: update.reasoning || 'AI-suggested update',
          variance: 0
        })
      }
    }

    // Increment times_asked for all questions in this session
    for (const answer of answers || []) {
      // Simple hash of question text
      const hash = answer.question_text.slice(0, 50).replace(/\s/g, '_')
      const { data: existing } = await supabase
        .from('question_performance')
        .select('*')
        .eq('question_hash', hash)
        .single()

      if (existing) {
        await supabase
          .from('question_performance')
          .update({ times_asked: existing.times_asked + 1 })
          .eq('question_hash', hash)
      } else {
        await supabase
          .from('question_performance')
          .insert({
            question_hash: hash,
            question_text: answer.question_text,
            dimension_tags: answer.dimension_tags,
            times_asked: 1,
            predictive_score: 1.0 // Start with neutral weight
          })
      }
    }

    // Run learning loop if triggered or auto-run based on session count
    let learningLoopResult = null
    if (trigger_learning_loop) {
      learningLoopResult = await runLearningLoop()
    }

    // Identify retirement candidates (questions with weight < 0.5 after 100 sessions)
    const retirementCandidates: string[] = []
    for (const perf of questionPerformance || []) {
      if (perf.times_asked >= VARIANCE_CONFIG.RETIREMENT_SESSION_THRESHOLD &&
          perf.predictive_score < VARIANCE_CONFIG.MIN_WEIGHT) {
        retirementCandidates.push(perf.question_hash)
      }
    }
    // Also include AI-suggested retirements
    for (const hash of analysis.questions_to_retire || []) {
      if (!retirementCandidates.includes(hash)) {
        retirementCandidates.push(hash)
      }
    }

    // Log learning insights
    const { count } = await supabase
      .from('test_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const varianceSummary = varianceResults
      .filter(r => r !== null)
      .map(r => ({
        hash: r?.question_hash,
        variance: r?.variance,
        recommendation: r?.recommendation
      }))

    await supabase
      .from('learning_log')
      .insert({
        session_count: count || 0,
        insights: {
          session_id,
          questions_count: answers?.length,
          compass_score: scores?.compass_score,
          variance_analysis: varianceSummary,
          weight_updates: weightUpdates.length,
          retirement_candidates: retirementCandidates.length
        },
        strategy_update: analysis.strategy_insight || `Variance-based learning: Updated ${weightUpdates.length} question weights`
      })

    return NextResponse.json({
      success: true,
      analysis: {
        questions_analyzed: answers?.length || 0,
        questions_updated: weightUpdates.length,
        weight_updates: weightUpdates,
        retirement_candidates: retirementCandidates,
        learning_loop: learningLoopResult,
        strategy_insight: analysis.strategy_insight || 'Variance-based weight adjustment applied'
      }
    })
  } catch (error) {
    console.error('Learn error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving learning insights
export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get recent learning logs
    const { data: logs } = await supabase
      .from('learning_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get current question performance stats
    const { data: performance } = await supabase
      .from('question_performance')
      .select('*')
      .order('predictive_score', { ascending: false })

    return NextResponse.json({
      success: true,
      recent_logs: logs || [],
      question_performance: performance || [],
      variance_config: {
        high_variance_threshold: VARIANCE_CONFIG.HIGH_VARIANCE_THRESHOLD,
        low_variance_threshold: VARIANCE_CONFIG.LOW_VARIANCE_THRESHOLD,
        max_weight: VARIANCE_CONFIG.MAX_WEIGHT,
        min_weight: VARIANCE_CONFIG.MIN_WEIGHT,
        learning_loop_interval: VARIANCE_CONFIG.LEARNING_LOOP_INTERVAL
      }
    })
  } catch (error) {
    console.error('Learn GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
