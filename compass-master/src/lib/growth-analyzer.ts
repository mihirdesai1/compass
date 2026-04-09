// Growth Analyzer - Signal Variance Analysis for Compass
// Analyzes question effectiveness and adjusts weights based on signal variance

import { createClient } from '@/lib/supabase/server'

export interface SignalVarianceResult {
  question_hash: string
  question_text: string
  variance: number
  mean_signal: number
  response_count: number
  dimension_breakdown: Record<string, number>
  recommendation: 'boost' | 'reduce' | 'retire' | 'maintain'
  current_weight: number
  suggested_weight: number
}

export interface LearningLoopResult {
  session_count: number
  analyzed_questions: number
  high_variance_questions: string[]
  low_variance_questions: string[]
  retirement_candidates: string[]
  insights: string
}

// Thresholds for variance analysis
const VARIANCE_CONFIG = {
  HIGH_VARIANCE_THRESHOLD: 0.3,    // Questions with variance above this get boosted
  LOW_VARIANCE_THRESHOLD: 0.05,    // Questions with variance below this get reduced
  WEIGHT_BOOST_AMOUNT: 0.1,        // Amount to increase weight for high-variance
  WEIGHT_REDUCE_AMOUNT: 0.1,       // Amount to decrease weight for low-variance
  MAX_WEIGHT: 2.0,                 // Maximum predictive weight
  MIN_WEIGHT: 0.5,                 // Minimum weight before retirement
  RETIREMENT_SESSION_THRESHOLD: 100, // Sessions before retirement eligible
  LEARNING_LOOP_INTERVAL: 10       // Run analysis every N sessions
}

/**
 * Calculate signal variance for a given question
 * Formula: variance = standard deviation of signal magnitudes across all responses
 * Higher variance = question differentiates users better
 */
export async function calculateSignalVariance(
  questionText: string
): Promise<SignalVarianceResult | null> {
  const supabase = createClient()

  // Get all responses for this question
  const { data: responses, error } = await supabase
    .from('questions_log')
    .select('answer_chosen, dimension_tags, options')
    .eq('question_text', questionText)
    .not('answer_chosen', 'is', null)

  if (error || !responses || responses.length === 0) {
    return null
  }

  // Calculate signal magnitude for each response
  const signalMagnitudes: number[] = []
  const dimensionBreakdown: Record<string, number> = {}

  for (const response of responses) {
    // Find the chosen option's signals
    const chosenOption = response.options.find(
      (opt: { id: string }) => opt.id === response.answer_chosen
    )

    if (chosenOption && chosenOption.dimension_signals) {
      // Calculate signal magnitude (Euclidean norm of all dimension signals)
      const signals = chosenOption.dimension_signals
      const magnitude = Math.sqrt(
        Math.pow(signals.iq || 0, 2) +
        Math.pow(signals.aq || 0, 2) +
        Math.pow(signals.eq || 0, 2) +
        Math.pow(signals.sq || 0, 2) +
        Math.pow(signals.openness || 0, 2) +
        Math.pow(signals.conscientiousness || 0, 2) +
        Math.pow(signals.extraversion || 0, 2) +
        Math.pow(signals.agreeableness || 0, 2) +
        Math.pow(signals.neuroticism || 0, 2)
      )
      signalMagnitudes.push(magnitude)

      // Aggregate dimension tags
      Object.entries(response.dimension_tags || {}).forEach(([dim, val]) => {
        dimensionBreakdown[dim] = (dimensionBreakdown[dim] || 0) + (val as number)
      })
    }
  }

  if (signalMagnitudes.length === 0) {
    return null
  }

  // Calculate mean and variance
  const mean = signalMagnitudes.reduce((a, b) => a + b, 0) / signalMagnitudes.length
  const squaredDiffs = signalMagnitudes.map(m => Math.pow(m - mean, 2))
  const variance = Math.sqrt(
    squaredDiffs.reduce((a, b) => a + b, 0) / signalMagnitudes.length
  )

  // Get current question performance
  const questionHash = generateQuestionHash(questionText)
  const { data: performance } = await supabase
    .from('question_performance')
    .select('predictive_score, times_asked')
    .eq('question_hash', questionHash)
    .single()

  const currentWeight = performance?.predictive_score ?? 1.0
  const timesAsked = performance?.times_asked ?? 0

  // Determine recommendation
  let recommendation: 'boost' | 'reduce' | 'retire' | 'maintain' = 'maintain'
  let suggestedWeight = currentWeight

  if (timesAsked >= VARIANCE_CONFIG.RETIREMENT_SESSION_THRESHOLD && currentWeight < VARIANCE_CONFIG.MIN_WEIGHT) {
    recommendation = 'retire'
  } else if (variance > VARIANCE_CONFIG.HIGH_VARIANCE_THRESHOLD) {
    recommendation = 'boost'
    suggestedWeight = Math.min(currentWeight + VARIANCE_CONFIG.WEIGHT_BOOST_AMOUNT, VARIANCE_CONFIG.MAX_WEIGHT)
  } else if (variance < VARIANCE_CONFIG.LOW_VARIANCE_THRESHOLD && currentWeight > VARIANCE_CONFIG.MIN_WEIGHT) {
    recommendation = 'reduce'
    suggestedWeight = Math.max(currentWeight - VARIANCE_CONFIG.WEIGHT_REDUCE_AMOUNT, VARIANCE_CONFIG.MIN_WEIGHT)
  }

  return {
    question_hash: questionHash,
    question_text: questionText,
    variance: parseFloat(variance.toFixed(4)),
    mean_signal: parseFloat(mean.toFixed(4)),
    response_count: signalMagnitudes.length,
    dimension_breakdown: dimensionBreakdown,
    recommendation,
    current_weight: currentWeight,
    suggested_weight: parseFloat(suggestedWeight.toFixed(2))
  }
}

/**
 * Run the learning loop every N sessions
 * Analyzes all questions and updates their weights
 */
export async function runLearningLoop(): Promise<LearningLoopResult> {
  const supabase = createClient()

  // Get current completed session count
  const { count: sessionCount } = await supabase
    .from('test_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  const actualSessionCount = sessionCount || 0

  // Check if we should run the learning loop
  if (actualSessionCount % VARIANCE_CONFIG.LEARNING_LOOP_INTERVAL !== 0) {
    return {
      session_count: actualSessionCount,
      analyzed_questions: 0,
      high_variance_questions: [],
      low_variance_questions: [],
      retirement_candidates: [],
      insights: 'Learning loop skipped - not at interval threshold'
    }
  }

  // Get all unique questions that have been asked
  const { data: uniqueQuestions } = await supabase
    .from('questions_log')
    .select('question_text')
    .not('answer_chosen', 'is', null)

  if (!uniqueQuestions || uniqueQuestions.length === 0) {
    return {
      session_count: actualSessionCount,
      analyzed_questions: 0,
      high_variance_questions: [],
      low_variance_questions: [],
      retirement_candidates: [],
      insights: 'No answered questions to analyze'
    }
  }

  // Get unique question texts
  const uniqueQuestionTexts = Array.from(new Set(uniqueQuestions.map(q => q.question_text)))

  // Analyze each question
  const results: SignalVarianceResult[] = []
  const highVarianceQuestions: string[] = []
  const lowVarianceQuestions: string[] = []
  const retirementCandidates: string[] = []

  for (const questionText of uniqueQuestionTexts) {
    const analysis = await calculateSignalVariance(questionText)
    if (analysis) {
      results.push(analysis)

      // Apply weight updates based on recommendation
      if (analysis.recommendation === 'boost') {
        await updateQuestionWeight(analysis.question_hash, analysis.suggested_weight)
        highVarianceQuestions.push(analysis.question_hash)
      } else if (analysis.recommendation === 'reduce') {
        await updateQuestionWeight(analysis.question_hash, analysis.suggested_weight)
        lowVarianceQuestions.push(analysis.question_hash)
      } else if (analysis.recommendation === 'retire') {
        retirementCandidates.push(analysis.question_hash)
      }
    }
  }

  // Generate insights
  const avgVariance = results.length > 0
    ? results.reduce((sum, r) => sum + r.variance, 0) / results.length
    : 0

  const insights = `Learning Loop Complete (Session ${actualSessionCount}):
- Analyzed ${results.length} questions
- Average signal variance: ${avgVariance.toFixed(4)}
- Boosted ${highVarianceQuestions.length} high-variance questions
- Reduced ${lowVarianceQuestions.length} low-variance questions
- Identified ${retirementCandidates.length} candidates for retirement
- Questions with high variance differentiate users better and should be asked more frequently
- Questions with low variance (everyone answers similarly) are less predictive`

  // Log to learning_log
  await supabase.from('learning_log').insert({
    session_count: actualSessionCount,
    insights: {
      questions_analyzed: results.length,
      avg_variance: avgVariance,
      high_variance_count: highVarianceQuestions.length,
      low_variance_count: lowVarianceQuestions.length,
      retirement_candidates: retirementCandidates.length
    },
    strategy_update: insights
  })

  return {
    session_count: actualSessionCount,
    analyzed_questions: results.length,
    high_variance_questions: highVarianceQuestions,
    low_variance_questions: lowVarianceQuestions,
    retirement_candidates: retirementCandidates,
    insights
  }
}

/**
 * Update a question's predictive weight
 */
async function updateQuestionWeight(questionHash: string, newWeight: number): Promise<void> {
  const supabase = createClient()

  await supabase
    .from('question_performance')
    .update({ predictive_score: newWeight })
    .eq('question_hash', questionHash)
}

/**
 * Generate a simple hash for a question text
 */
function generateQuestionHash(questionText: string): string {
  return questionText.slice(0, 50).replace(/\s/g, '_').toLowerCase()
}

/**
 * Get questions sorted by their predictive weight (highest first)
 * Used for adaptive question selection
 */
export async function getWeightedQuestions(
  dimension?: string,
  excludeHashes?: string[]
): Promise<{ hash: string; text: string; weight: number; times_asked: number }[]> {
  const supabase = createClient()

  let query = supabase
    .from('question_performance')
    .select('question_hash, question_text, predictive_score, times_asked, dimension_tags')
    .gte('predictive_score', VARIANCE_CONFIG.MIN_WEIGHT)
    .order('predictive_score', { ascending: false })

  if (dimension) {
    query = query.contains('dimension_tags', { [dimension]: 1 })
  }

  if (excludeHashes && excludeHashes.length > 0) {
    query = query.not('question_hash', 'in', `(${excludeHashes.join(',')})`)
  }

  const { data } = await query

  return (data || []).map(q => ({
    hash: q.question_hash,
    text: q.question_text,
    weight: q.predictive_score,
    times_asked: q.times_asked
  }))
}

/**
 * Get growth metrics for the dashboard
 */
export async function getGrowthMetrics(): Promise<{
  total_questions: number
  avg_variance: number
  weight_distribution: { high: number; medium: number; low: number }
  retirement_candidates: SignalVarianceResult[]
  recent_insights: string
  last_learning_run: number
}> {
  const supabase = createClient()

  // Get all question performance data
  const { data: allQuestions } = await supabase
    .from('question_performance')
    .select('*')

  // Get the most recent learning log entry
  const { data: recentLogs } = await supabase
    .from('learning_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  // Calculate weight distribution
  const questions = allQuestions || []
  const highWeight = questions.filter(q => q.predictive_score >= 1.5).length
  const mediumWeight = questions.filter(q => q.predictive_score >= 1.0 && q.predictive_score < 1.5).length
  const lowWeight = questions.filter(q => q.predictive_score < 1.0).length

  // Find retirement candidates
  const retirementCandidates: SignalVarianceResult[] = []
  for (const q of questions) {
    if (q.times_asked >= VARIANCE_CONFIG.RETIREMENT_SESSION_THRESHOLD && q.predictive_score < VARIANCE_CONFIG.MIN_WEIGHT) {
      const analysis = await calculateSignalVariance(q.question_text)
      if (analysis && analysis.recommendation === 'retire') {
        retirementCandidates.push(analysis)
      }
    }
  }

  // Calculate average variance for all questions
  let totalVariance = 0
  let varianceCount = 0
  for (const q of questions) {
    const analysis = await calculateSignalVariance(q.question_text)
    if (analysis) {
      totalVariance += analysis.variance
      varianceCount++
    }
  }

  return {
    total_questions: questions.length,
    avg_variance: varianceCount > 0 ? totalVariance / varianceCount : 0,
    weight_distribution: { high: highWeight, medium: mediumWeight, low: lowWeight },
    retirement_candidates: retirementCandidates,
    recent_insights: recentLogs?.[0]?.strategy_update || 'No learning data yet',
    last_learning_run: recentLogs?.[0]?.session_count || 0
  }
}

// Export config for external use
export { VARIANCE_CONFIG }
