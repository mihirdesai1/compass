/**
 * Simulator API Route
 * POST /api/simulator/run
 *
 * Triggers a synthetic test run with a randomly selected persona
 * Returns the created user_id and session_id
 */

import { NextRequest, NextResponse } from 'next/server'
import { runSimulation, PERSONAS, Persona } from '@/lib/simulator'

export interface SimulatorRunRequest {
  personaId?: string  // Optional: specific persona to run (e.g., 'persona-rohan')
  delay?: number    // Optional: delay in ms between questions (default: 0 for instant)
}

export interface SimulatorRunResponse {
  success: boolean
  data?: {
    userId: string
    sessionId: string
    persona: {
      id: string
      name: string
      age: number
      status: string
      description: string
    }
    scores: {
      iq: number
      aq: number
      eq: number
      sq: number
      compass: number
      ocean: {
        openness: number
        conscientiousness: number
        extraversion: number
        agreeableness: number
        neuroticism: number
      }
    }
    duration: number
    questionsAnswered: number
  }
  error?: string
}

/**
 * POST handler - Run a synthetic test simulation
 */
export async function POST(request: NextRequest): Promise<NextResponse<SimulatorRunResponse>> {
  try {
    // Parse request body (optional persona selection)
    let selectedPersona: Persona | undefined

    try {
      const body = await request.json()

      if (body.personaId) {
        selectedPersona = PERSONAS.find(p => p.id === body.personaId)
        if (!selectedPersona) {
          return NextResponse.json(
            {
              success: false,
              error: `Persona "${body.personaId}" not found. Available: ${PERSONAS.map(p => p.id).join(', ')}`
            },
            { status: 400 }
          )
        }
      }
    } catch {
      // No body provided, will use random persona
    }

    // Run the simulation
    const result = await runSimulation(selectedPersona)

    // Return success response
    const response: SimulatorRunResponse = {
      success: true,
      data: {
        userId: result.userId,
        sessionId: result.sessionId,
        persona: {
          id: result.persona.id,
          name: result.persona.name,
          age: result.persona.age,
          status: result.persona.status,
          description: result.persona.description,
        },
        scores: {
          iq: result.scores.iq,
          aq: result.scores.aq,
          eq: result.scores.eq,
          sq: result.scores.sq,
          compass: result.scores.compass,
          ocean: {
            openness: result.scores.openness,
            conscientiousness: result.scores.conscientiousness,
            extraversion: result.scores.extraversion,
            agreeableness: result.scores.agreeableness,
            neuroticism: result.scores.neuroticism,
          },
        },
        duration: result.duration,
        questionsAnswered: result.answers.length,
      },
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[SIMULATOR API] Error running simulation:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler - List available personas
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    personas: PERSONAS.map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      status: p.status,
      description: p.description,
      traits: p.traitWeights,
    }))
  })
}
