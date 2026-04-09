/**
 * Compass Synthetic User Test Runner
 * Simulates realistic test-takers with varied psychometric profiles
 */

import { createClient } from './supabase/server'
import { questions, Question, QuestionOption } from './questions'
import type { UserStatus, TestSession, QuestionLog, PsychometricScores } from './types'

// Environment check - simulator needs service role key for RLS bypass
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[SIMULATOR] SUPABASE_SERVICE_ROLE_KEY not set - simulator writes may fail RLS policies')
}

if (!SUPABASE_URL) {
  throw new Error('[SIMULATOR] NEXT_PUBLIC_SUPABASE_URL is required')
}

// ============================================================================
// PERSONA DEFINITIONS - 6 Synthetic User Profiles
// ============================================================================

export interface Persona {
  id: string
  name: string
  age: number
  status: UserStatus
  description: string
  traitWeights: TraitWeights
  answerSpeed: { min: number; max: number } // milliseconds per question
  consistency: number // 0-1, how consistently they follow their trait weights
}

export interface TraitWeights {
  iq: number      // Intelligence Quotient preference (-1 to 1)
  aq: number      // Adaptability Quotient preference (-1 to 1)
  eq: number      // Emotional Quotient preference (-1 to 1)
  sq: number      // Social Quotient preference (-1 to 1)
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

/**
 * Persona 1: "Rohan" - High-IQ Dropout
 * 21yo, dropped out, analytical choices
 * Strong IQ, weak AQ - brilliant but rigid thinker
 */
export const rohan: Persona = {
  id: 'persona-rohan',
  name: 'Rohan',
  age: 21,
  status: 'dropped',
  description: 'High-IQ Dropout - analytical but rigid thinker who struggles with adaptability',
  traitWeights: {
    iq: 0.8,          // Strong preference for IQ-based answers
    aq: -0.6,         // Avoids adaptability-focused choices
    eq: 0.2,           // Neutral emotional intelligence
    sq: -0.3,          // Slightly avoids social solutions
    openness: 0.3,
    conscientiousness: 0.6,
    extraversion: -0.2,
    agreeableness: -0.3,
    neuroticism: 0.2,
  },
  answerSpeed: { min: 8000, max: 15000 }, // Thinks carefully
  consistency: 0.85,
}

/**
 * Persona 2: "Priya" - Low-AQ Graduate
 * 23yo, graduated, rigid thinker
 * High conscientiousness, low adaptability
 */
export const priya: Persona = {
  id: 'persona-priya',
  name: 'Priya',
  age: 23,
  status: 'graduated',
  description: 'Low-AQ Graduate - follows rules rigidly, struggles with uncertainty',
  traitWeights: {
    iq: 0.2,           // Average intelligence preference
    aq: -0.8,          // Strongly avoids adaptability
    eq: 0.1,           // Neutral EQ
    sq: 0.3,           // Slightly prefers social/hierarchical
    openness: -0.4,    // Prefers known paths
    conscientiousness: 0.9, // Very high - follows rules
    extraversion: -0.1,
    agreeableness: 0.7,
    neuroticism: 0.3,
  },
  answerSpeed: { min: 6000, max: 12000 }, // Moderate speed
  consistency: 0.9,
}

/**
 * Persona 3: "Amit" - High-EQ Worker
 * 24yo, working, emotional intelligence
 * Empathetic, people-focused, emotionally aware
 */
export const amit: Persona = {
  id: 'persona-amit',
  name: 'Amit',
  age: 24,
  status: 'working',
  description: 'High-EQ Worker - emotionally intelligent, empathetic, people-focused',
  traitWeights: {
    iq: 0.1,           // Not IQ-focused
    aq: 0.3,           // Moderate adaptability
    eq: 0.9,           // Strongly prefers EQ-based answers
    sq: 0.4,           // Socially aware
    openness: 0.2,
    conscientiousness: 0.4,
    extraversion: 0.3,
    agreeableness: 0.8, // Very agreeable
    neuroticism: -0.2, // Emotionally stable
  },
  answerSpeed: { min: 5000, max: 10000 }, // Intuitive, faster
  consistency: 0.75,
}

/**
 * Persona 4: "Sneha" - Balanced Student
 * 20yo, studying, well-rounded
 * Moderate across all dimensions
 */
export const sneha: Persona = {
  id: 'persona-sneha',
  name: 'Sneha',
  age: 20,
  status: 'studying',
  description: 'Balanced Student - well-rounded, adaptable, moderate across all dimensions',
  traitWeights: {
    iq: 0.2,           // Slightly analytical
    aq: 0.3,           // Open to change
    eq: 0.3,           // Emotionally aware
    sq: 0.2,           // Socially capable
    openness: 0.4,
    conscientiousness: 0.4,
    extraversion: 0.1,
    agreeableness: 0.3,
    neuroticism: 0.0,
  },
  answerSpeed: { min: 7000, max: 13000 },
  consistency: 0.6,
}

/**
 * Persona 5: "Vikram" - High-SQ Pivoter
 * 25yo, working, social butterfly
 * Network-focused, socially intelligent, career pivoter
 */
export const vikram: Persona = {
  id: 'persona-vikram',
  name: 'Vikram',
  age: 25,
  status: 'working',
  description: 'High-SQ Pivoter - socially intelligent networker, career pivot expert',
  traitWeights: {
    iq: 0.0,           // Not IQ-focused
    aq: 0.6,           // High adaptability for pivoting
    eq: 0.4,           // Socially aware
    sq: 0.9,           // Strongly prefers social/networking solutions
    openness: 0.6,
    conscientiousness: 0.2,
    extraversion: 0.8, // Very extraverted
    agreeableness: 0.4,
    neuroticism: -0.1,
  },
  answerSpeed: { min: 4000, max: 9000 }, // Quick, decisive
  consistency: 0.7,
}

/**
 * Persona 6: "Neha" - Low-Confidence Seeker
 * 22yo, graduated, unsure
 * Lower confidence, higher neuroticism, seeks validation
 */
export const neha: Persona = {
  id: 'persona-neha',
  name: 'Neha',
  age: 22,
  status: 'graduated',
  description: 'Low-Confidence Seeker - unsure, anxious, seeks validation and guidance',
  traitWeights: {
    iq: -0.1,
    aq: -0.3,          // Less adaptable
    eq: 0.2,
    sq: 0.5,           // Seeks social solutions/help
    openness: -0.2,
    conscientiousness: 0.3,
    extraversion: -0.3,
    agreeableness: 0.5,
    neuroticism: 0.7,  // High anxiety/uncertainty
  },
  answerSpeed: { min: 10000, max: 20000 }, // Hesitant, slower
  consistency: 0.5,    // Less consistent = more randomness
}

// All personas export
export const PERSONAS: Persona[] = [rohan, priya, amit, sneha, vikram, neha]

// ============================================================================
// SIMULATION LOGIC
// ============================================================================

interface SimulationResult {
  userId: string
  sessionId: string
  persona: Persona
  answers: AnswerRecord[]
  scores: CalculatedScores
  duration: number
}

interface AnswerRecord {
  questionId: string
  questionDimension: string
  optionChosen: 'a' | 'b' | 'c' | 'd'
  timeSpentMs: number
  signals: {
    iq: number
    aq: number
    eq: number
    sq: number
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

interface CalculatedScores {
  iq: number
  aq: number
  eq: number
  sq: number
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  compass: number
}

/**
 * Calculate weighted score for each option based on persona preferences
 */
function scoreOption(option: QuestionOption, persona: Persona): number {
  const signals = option.signals
  const weights = persona.traitWeights

  // Weighted sum of signals
  let score =
    signals.iq * weights.iq +
    signals.aq * weights.aq +
    signals.eq * weights.eq +
    signals.sq * weights.sq +
    signals.openness * weights.openness +
    signals.conscientiousness * weights.conscientiousness +
    signals.extraversion * weights.extraversion +
    signals.agreeableness * weights.agreeableness +
    signals.neuroticism * weights.neuroticism

  // Add some randomness based on consistency
  const randomFactor = (Math.random() - 0.5) * 2 * (1 - persona.consistency)
  score += randomFactor * 2

  return score
}

/**
 * Select an answer for a question based on persona traits
 */
function selectAnswer(question: Question, persona: Persona): { option: QuestionOption; timeSpentMs: number } {
  // Score each option
  const scoredOptions = question.options.map((option) => ({
    option,
    score: scoreOption(option, persona),
  }))

  // Sort by score (highest first)
  scoredOptions.sort((a, b) => b.score - a.score)

  // Softmax selection for more realistic distribution
  const expScores = scoredOptions.map((s) => Math.exp(s.score * 2))
  const totalExp = expScores.reduce((a, b) => a + b, 0)
  const probabilities = expScores.map((s) => s / totalExp)

  // Random selection based on probabilities
  const random = Math.random()
  let cumulative = 0
  let selectedIndex = 0
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i]
    if (random <= cumulative) {
      selectedIndex = i
      break
    }
  }

  // Simulate realistic timing (12-20 seconds range per persona)
  const baseTime = persona.answerSpeed.min + Math.random() * (persona.answerSpeed.max - persona.answerSpeed.min)
  // Add slight variance per question
  const timeSpentMs = Math.floor(baseTime * (0.9 + Math.random() * 0.2))

  return {
    option: scoredOptions[selectedIndex].option,
    timeSpentMs,
  }
}

/**
 * Calculate final scores from all answers
 */
function calculateScores(answers: AnswerRecord[]): CalculatedScores {
  const totals = answers.reduce(
    (acc, answer) => ({
      iq: acc.iq + answer.signals.iq,
      aq: acc.aq + answer.signals.aq,
      eq: acc.eq + answer.signals.eq,
      sq: acc.sq + answer.signals.sq,
      openness: acc.openness + answer.signals.openness,
      conscientiousness: acc.conscientiousness + answer.signals.conscientiousness,
      extraversion: acc.extraversion + answer.signals.extraversion,
      agreeableness: acc.agreeableness + answer.signals.agreeableness,
      neuroticism: acc.neuroticism + answer.signals.neuroticism,
    }),
    { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 }
  )

  const count = answers.length

  // Normalize to 0-100 scale
  // Signals are -1 to 1, so sum ranges from -count to +count
  const normalize = (sum: number) => Math.round(50 + (sum / count) * 50)

  const scores = {
    iq: normalize(totals.iq),
    aq: normalize(totals.aq),
    eq: normalize(totals.eq),
    sq: normalize(totals.sq),
    openness: normalize(totals.openness),
    conscientiousness: normalize(totals.conscientiousness),
    extraversion: normalize(totals.extraversion),
    agreeableness: normalize(totals.agreeableness),
    neuroticism: normalize(totals.neuroticism),
  }

  // Calculate composite Compass score
  // Weighted average emphasizing adaptability
  const compass = Math.round(
    scores.iq * 0.25 +
    scores.aq * 0.3 +
    scores.eq * 0.2 +
    scores.sq * 0.15 +
    (100 - scores.neuroticism) * 0.1 // Emotional stability bonus
  )

  return {
    ...scores,
    compass,
  }
}

/**
 * Generate score interpretations
 */
function generateInterpretations(scores: CalculatedScores) {
  const interpret = (score: number, type: string): string => {
    if (score >= 80) return `Exceptional ${type} - top percentile`
    if (score >= 70) return `Strong ${type} - above average`
    if (score >= 50) return `Average ${type} - room for growth`
    if (score >= 35) return `Developing ${type} - needs attention`
    return `Challenged ${type} - significant intervention recommended`
  }

  const oceanSummary = `${scores.openness >= 50 ? 'Open' : 'Traditional'}, ${scores.conscientiousness >= 50 ? 'organized' : 'spontaneous'}, ${scores.extraversion >= 50 ? 'extraverted' : 'reserved'}, ${scores.agreeableness >= 50 ? 'cooperative' : 'challenging'}, ${scores.neuroticism >= 50 ? 'emotionally reactive' : 'stable'}`

  return {
    iq: interpret(scores.iq, 'analytical intelligence'),
    aq: interpret(scores.aq, 'adaptability'),
    eq: interpret(scores.eq, 'emotional intelligence'),
    sq: interpret(scores.sq, 'social intelligence'),
    ocean: oceanSummary,
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Create a service role client for RLS bypass (simulator needs this)
 */
async function createServiceClient() {
  // Dynamic import to avoid SSR issues
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Run a complete synthetic test simulation
 */
export async function runSimulation(persona: Persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]): Promise<SimulationResult> {
  const startTime = Date.now()
  const supabase = await createServiceClient()

  // Step 1: Create synthetic user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      name: persona.name,
      age: persona.age,
      status: persona.status,
    })
    .select()
    .single()

  if (profileError) {
    console.error('[SIMULATOR] Failed to create profile:', profileError)
    throw new Error(`Failed to create profile: ${profileError.message}`)
  }

  const userId = profile.id
  console.log(`[SIMULATOR] Created user ${userId} (${persona.name})`)

  // Step 2: Create test session
  const { data: session, error: sessionError } = await supabase
    .from('test_sessions')
    .insert({
      user_id: userId,
      total_questions: questions.length,
      status: 'in_progress',
      confidence_map: { iq: 0, aq: 0, eq: 0, sq: 0, ocean: 0 },
    })
    .select()
    .single()

  if (sessionError) {
    console.error('[SIMULATOR] Failed to create session:', sessionError)
    throw new Error(`Failed to create session: ${sessionError.message}`)
  }

  const sessionId = session.id
  console.log(`[SIMULATOR] Created session ${sessionId}`)

  // Step 3: Simulate answering all questions
  const answers: AnswerRecord[] = []
  const questionLogs: any[] = []

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    const { option, timeSpentMs } = selectAnswer(question, persona)

    const answer: AnswerRecord = {
      questionId: question.id,
      questionDimension: question.dimension,
      optionChosen: option.id,
      timeSpentMs,
      signals: { ...option.signals },
    }
    answers.push(answer)

    // Build question log entry
    questionLogs.push({
      session_id: sessionId,
      user_id: userId,
      question_id: question.id,
      question_text: question.question,
      situation: question.situation,
      options: question.options.map((o) => ({ id: o.id, text: o.text })),
      answer_chosen: option.id,
      answer_text: option.text,
      dimension: question.dimension,
      signals: option.signals,
      sequence_number: i + 1,
      time_spent_ms: timeSpentMs,
    })

    // Simulate realistic delay (but faster for simulation purposes)
    // In reality, we'd await here but for speed we'll batch
  }

  // Step 4: Bulk insert question logs
  const { error: logsError } = await supabase.from('questions_log').insert(questionLogs)

  if (logsError) {
    console.error('[SIMULATOR] Failed to insert question logs:', logsError)
  } else {
    console.log(`[SIMULATOR] Inserted ${questionLogs.length} question logs`)
  }

  // Step 5: Calculate and store scores
  const scores = calculateScores(answers)
  const interpretations = generateInterpretations(scores)

  const { data: psychScores, error: scoresError } = await supabase
    .from('psychometric_scores')
    .insert({
      user_id: userId,
      session_id: sessionId,
      iq_score: scores.iq,
      aq_score: scores.aq,
      eq_score: scores.eq,
      sq_score: scores.sq,
      ocean_profile: {
        openness: scores.openness,
        conscientiousness: scores.conscientiousness,
        extraversion: scores.extraversion,
        agreeableness: scores.agreeableness,
        neuroticism: scores.neuroticism,
      },
      compass_score: scores.compass,
      interpretations,
    })
    .select()
    .single()

  if (scoresError) {
    console.error('[SIMULATOR] Failed to insert scores:', scoresError)
    throw new Error(`Failed to insert scores: ${scoresError.message}`)
  }

  console.log(`[SIMULATOR] Inserted psychometric scores`)

  // Step 6: Update session as completed
  const { error: updateError } = await supabase
    .from('test_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      confidence_map: {
        iq: scores.iq / 100,
        aq: scores.aq / 100,
        eq: scores.eq / 100,
        sq: scores.sq / 100,
        ocean: (scores.openness + scores.conscientiousness + scores.extraversion + scores.agreeableness + (100 - scores.neuroticism)) / 500,
      },
    })
    .eq('id', sessionId)

  if (updateError) {
    console.error('[SIMULATOR] Failed to update session:', updateError)
  } else {
    console.log(`[SIMULATOR] Completed session ${sessionId}`)
  }

  const duration = Date.now() - startTime

  console.log(`[SIMULATOR] Simulation complete for ${persona.name}:`)
  console.log(`  - IQ: ${scores.iq}, AQ: ${scores.aq}, EQ: ${scores.eq}, SQ: ${scores.sq}`)
  console.log(`  - Compass Score: ${scores.compass}`)
  console.log(`  - Duration: ${duration}ms`)

  return {
    userId,
    sessionId,
    persona,
    answers,
    scores,
    duration,
  }
}

/**
 * Run multiple simulations
 */
export async function runBatchSimulation(count: number = 6): Promise<SimulationResult[]> {
  const results: SimulationResult[] = []

  for (let i = 0; i < count; i++) {
    // Cycle through personas evenly
    const persona = PERSONAS[i % PERSONAS.length]
    console.log(`\n[SIMULATOR] Running simulation ${i + 1}/${count} with ${persona.name}`)

    try {
      const result = await runSimulation(persona)
      results.push(result)

      // Small delay between simulations
      if (i < count - 1) {
        await new Promise((r) => setTimeout(r, 500))
      }
    } catch (error) {
      console.error(`[SIMULATOR] Simulation ${i + 1} failed:`, error)
    }
  }

  return results
}

/**
 * Get summary statistics from simulations
 */
export function getSimulationSummary(results: SimulationResult[]) {
  if (results.length === 0) return null

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)

  return {
    count: results.length,
    avgScores: {
      iq: avg(results.map((r) => r.scores.iq)),
      aq: avg(results.map((r) => r.scores.aq)),
      eq: avg(results.map((r) => r.scores.eq)),
      sq: avg(results.map((r) => r.scores.sq)),
      compass: avg(results.map((r) => r.scores.compass)),
    },
    totalDuration: results.reduce((a, r) => a + r.duration, 0),
    personas: results.map((r) => r.persona.name),
  }
}
