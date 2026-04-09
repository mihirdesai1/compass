// QA Monitor - Detects duplicate scores and quality issues
// Agent 4: Compass Master Orchestrator - QA & CRITIC Role

import { createClient } from './supabase/server'

export interface QAMonitorResult {
  status: 'APPROVED' | 'REJECTED' | 'FLAGGED'
  duplicateScore: boolean
  duplicateCount: number
  compassScore: number
  message: string
  issues: string[]
  recommendation: string
}

/**
 * Queries psychometric_scores table for last 50 sessions
 * Detects if any compass_score repeats 3+ times
 * Returns REJECTED if found, with CRITICAL ERROR log
 */
export async function checkForDuplicateScores(
  currentSessionId: string,
  currentCompassScore: number
): Promise<QAMonitorResult> {
  const supabase = createClient()
  const issues: string[] = []

  try {
    // Query last 50 sessions (excluding current)
    const { data: recentScores, error } = await supabase
      .from('psychometric_scores')
      .select('compass_score, session_id, created_at')
      .neq('session_id', currentSessionId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[QA MONITOR] Database error:', error)
      return {
        status: 'FLAGGED',
        duplicateScore: false,
        duplicateCount: 0,
        compassScore: currentCompassScore,
        message: 'QA check failed - database error',
        issues: ['Database query failed'],
        recommendation: 'Manual review required'
      }
    }

    // Count occurrences of current compass_score in last 50
    const scoreCount = recentScores?.filter(
      s => s.compass_score === currentCompassScore
    ).length || 0

    // Include current score in count
    const totalOccurrences = scoreCount + 1

    // Check if this score appears 3+ times (including current)
    if (totalOccurrences >= 3) {
      const criticalError = `
╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL ERROR: DUPLICATE COMPASS SCORE DETECTED                ║
╠══════════════════════════════════════════════════════════════════╣
║  Score: ${currentCompassScore} has appeared ${totalOccurrences} times in last 50 sessions  ║
║  Session ID: ${currentSessionId}                                ║
║                                                                  ║
║  This indicates the scoring algorithm is not producing           ║
║  diverse results. Agent 1 must fix the scoring parser.           ║
║                                                                  ║
║  ACTION: REJECTING this score. Require regeneration.            ║
╚══════════════════════════════════════════════════════════════════╝
      `
      console.error(criticalError)

      issues.push(`Compass score ${currentCompassScore} appears ${totalOccurrences} times in last 50 sessions`)
      issues.push('Scoring algorithm producing non-diverse results')

      return {
        status: 'REJECTED',
        duplicateScore: true,
        duplicateCount: totalOccurrences,
        compassScore: currentCompassScore,
        message: `CRITICAL: Score ${currentCompassScore} repeated ${totalOccurrences} times`,
        issues,
        recommendation: 'Agent 1 must rewrite scoring algorithm with better differentiation'
      }
    }

    // Check for suspicious patterns - same score appearing 2 times (warning)
    if (totalOccurrences === 2) {
      console.warn(`[QA MONITOR] WARNING: Score ${currentCompassScore} appeared twice. Monitoring...`)
      issues.push(`Score ${currentCompassScore} appears twice - approaching threshold`)
    }

    // Check for score clustering (multiple scores within small range)
    if (recentScores && recentScores.length > 0) {
      const recentCompassScores = recentScores.map(s => s.compass_score)
      const avgScore = recentCompassScores.reduce((a, b) => a + b, 0) / recentCompassScores.length
      const variance = recentCompassScores.reduce((acc, val) => acc + Math.pow(val - avgScore, 2), 0) / recentCompassScores.length
      const stdDev = Math.sqrt(variance)

      // If standard deviation is very low, scores are too similar
      if (stdDev < 5) {
        issues.push(`Low variance detected (stdDev: ${stdDev.toFixed(2)}) - scores too similar`)
      }
    }

    return {
      status: 'APPROVED',
      duplicateScore: false,
      duplicateCount: totalOccurrences,
      compassScore: currentCompassScore,
      message: 'Score passed QA checks',
      issues,
      recommendation: issues.length > 0 ? 'Monitor for patterns' : 'No action needed'
    }

  } catch (error) {
    console.error('[QA MONITOR] Unexpected error:', error)
    return {
      status: 'FLAGGED',
      duplicateScore: false,
      duplicateCount: 0,
      compassScore: currentCompassScore,
      message: 'QA check failed - unexpected error',
      issues: ['System error during QA check'],
      recommendation: 'Manual review required'
    }
  }
}

/**
 * Gets statistics on score distribution for monitoring
 */
export async function getScoreDistribution() {
  const supabase = createClient()

  try {
    const { data: scores } = await supabase
      .from('psychometric_scores')
      .select('compass_score')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!scores || scores.length === 0) {
      return { distribution: {}, uniqueCount: 0, totalCount: 0 }
    }

    const distribution: Record<number, number> = {}
    scores.forEach(s => {
      distribution[s.compass_score] = (distribution[s.compass_score] || 0) + 1
    })

    return {
      distribution,
      uniqueCount: Object.keys(distribution).length,
      totalCount: scores.length,
      mostCommon: Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    }
  } catch (error) {
    console.error('[QA MONITOR] Error getting distribution:', error)
    return null
  }
}
