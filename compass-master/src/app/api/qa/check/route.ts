// QA Check API Endpoint
// Agent 4: Compass Master Orchestrator - QA & CRITIC Role
// Returns: { scores_unique: boolean, paths_specific: boolean, issues: string[] }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkForDuplicateScores, getScoreDistribution } from '@/lib/qa-monitor'
import { validatePathData } from '@/lib/path-validator'
import { Path } from '@/lib/types'

export interface QACheckResponse {
  scores_unique: boolean
  paths_specific: boolean
  issues: string[]
  details?: {
    score_check?: {
      duplicate_detected: boolean
      duplicate_count: number
      compass_score: number
      status: string
    }
    path_check?: {
      status: string
      indian_companies_count: number
      has_inr_salary: boolean
      path_1_issues: string[]
      path_2_issues: string[]
    }
  }
  timestamp: string
}

/**
 * GET /api/qa/check
 * Returns overall QA status of the system
 */
export async function GET() {
  const issues: string[] = []
  const supabase = createClient()

  try {
    // Get score distribution
    const distribution = await getScoreDistribution()

    // Check for duplicates in distribution
    let scoresUnique = true
    if (distribution) {
      const duplicates = Object.entries(distribution.distribution)
        .filter(([_, count]) => count >= 3)

      if (duplicates.length > 0) {
        scoresUnique = false
        duplicates.forEach(([score, count]) => {
          issues.push(`Score ${score} appears ${count} times in last 100 sessions`)
        })
      }
    }

    // Check recent paths
    const { data: recentPaths } = await supabase
      .from('path_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    let pathsSpecific = true
    if (recentPaths && recentPaths.length > 0) {
      const pathIssues: string[] = []

      recentPaths.forEach((rec, index) => {
        const validation = validatePathData(rec.path_1 as Path, rec.path_2 as Path)

        if (validation.status === 'REJECTED' || validation.status === 'FLAGGED') {
          pathIssues.push(`Session ${rec.session_id}: ${validation.issues.join(', ')}`)
        }
      })

      if (pathIssues.length > 0) {
        pathsSpecific = false
        issues.push(...pathIssues)
      }
    }

    return NextResponse.json({
      scores_unique: scoresUnique,
      paths_specific: pathsSpecific,
      issues,
      details: {
        score_distribution: distribution
      },
      timestamp: new Date().toISOString()
    } as QACheckResponse)

  } catch (error) {
    console.error('[QA CHECK] Error:', error)
    return NextResponse.json({
      scores_unique: false,
      paths_specific: false,
      issues: ['QA check failed due to system error'],
      timestamp: new Date().toISOString()
    } as QACheckResponse, { status: 500 })
  }
}

/**
 * POST /api/qa/check
 * Validates specific session scores and paths
 * Body: { session_id: string, compass_score: number, path_1: Path, path_2: Path }
 */
export async function POST(request: Request) {
  const issues: string[] = []
  const supabase = createClient()

  try {
    const body = await request.json()
    const { session_id, compass_score, path_1, path_2 } = body

    if (!session_id) {
      return NextResponse.json({
        scores_unique: false,
        paths_specific: false,
        issues: ['session_id is required'],
        timestamp: new Date().toISOString()
      } as QACheckResponse, { status: 400 })
    }

    // Run score duplicate check
    const scoreCheck = await checkForDuplicateScores(session_id, compass_score || 0)

    if (scoreCheck.status === 'REJECTED') {
      issues.push(...scoreCheck.issues)
    }

    // Run path validation if paths provided
    let pathCheck = null
    if (path_1 && path_2) {
      pathCheck = validatePathData(path_1, path_2)

      if (pathCheck.status === 'REJECTED') {
        issues.push(...pathCheck.issues)
      }
    } else {
      // Fetch paths from database
      const { data: paths } = await supabase
        .from('path_recommendations')
        .select('*')
        .eq('session_id', session_id)
        .single()

      if (paths) {
        pathCheck = validatePathData(paths.path_1 as Path, paths.path_2 as Path)

        if (pathCheck.status === 'REJECTED') {
          issues.push(...pathCheck.issues)
        }
      }
    }

    return NextResponse.json({
      scores_unique: scoreCheck.status !== 'REJECTED',
      paths_specific: pathCheck ? pathCheck.status !== 'REJECTED' : true,
      issues,
      details: {
        score_check: {
          duplicate_detected: scoreCheck.duplicateScore,
          duplicate_count: scoreCheck.duplicateCount,
          compass_score: scoreCheck.compassScore,
          status: scoreCheck.status
        },
        path_check: pathCheck ? {
          status: pathCheck.status,
          indian_companies_count: pathCheck.indianCompaniesCount,
          has_inr_salary: pathCheck.hasINRSalary,
          path_1_issues: pathCheck.details.path1.issues,
          path_2_issues: pathCheck.details.path2.issues
        } : null
      },
      timestamp: new Date().toISOString()
    } as QACheckResponse)

  } catch (error) {
    console.error('[QA CHECK] Error:', error)
    return NextResponse.json({
      scores_unique: false,
      paths_specific: false,
      issues: ['QA check failed due to system error', error instanceof Error ? error.message : 'Unknown error'],
      timestamp: new Date().toISOString()
    } as QACheckResponse, { status: 500 })
  }
}
