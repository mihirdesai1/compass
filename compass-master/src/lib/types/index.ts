// Type definitions for Compass

export type UserStatus = 'studying' | 'graduated' | 'dropped' | 'working'

export type TestStatus = 'in_progress' | 'completed' | 'abandoned'

export interface Profile {
  id: string
  name: string
  age: number
  status: UserStatus
  created_at: string
}

export interface TestSession {
  id: string
  user_id: string
  started_at: string
  completed_at?: string
  total_questions: number
  status: TestStatus
  confidence_map: {
    iq: number
    aq: number
    eq: number
    sq: number
    ocean: number
  }
}

export interface QuestionLog {
  id: string
  session_id: string
  user_id: string
  question_text: string
  options: QuestionOption[]
  answer_chosen?: string
  dimension_tags: DimensionTags
  sequence_number: number
  predictive_weight: number
  created_at: string
}

export interface QuestionOption {
  id: string
  text: string
  dimension_signals: DimensionSignals
}

export interface DimensionSignals {
  iq?: number
  aq?: number
  eq?: number
  sq?: number
  ocean?: number
}

export interface DimensionTags {
  iq?: number
  aq?: number
  eq?: number
  sq?: number
  ocean?: number
}

export interface PsychometricScores {
  id: string
  user_id: string
  session_id: string
  iq_score: number
  aq_score: number
  eq_score: number
  sq_score: number
  ocean_profile: OceanProfile
  compass_score: number
  interpretations: ScoreInterpretations
  created_at: string
}

export interface OceanProfile {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface ScoreInterpretations {
  iq: string
  aq: string
  eq: string
  sq: string
  ocean: string
}

export interface PathRecommendation {
  id: string
  user_id: string
  session_id: string
  path_1: Path
  path_2: Path
  chosen_path?: 1 | 2
  created_at: string
}

export interface Path {
  name: string
  tagline: string
  why_it_fits: string
  next_30_days: string[]
  skills_to_build: string[]
  resources: Resource[]
  honest_warning: string
}

export interface Resource {
  name: string
  url: string
  type: 'course' | 'video' | 'article' | 'institution' | 'bootcamp' | 'community'
}

export interface GuidanceChat {
  id: string
  user_id: string
  path_recommendation_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface QuestionPerformance {
  id: string
  question_hash: string
  question_text: string
  dimension_tags: DimensionTags
  times_asked: number
  predictive_score: number
  last_updated: string
}

export interface LearningLog {
  id: string
  session_count: number
  insights: Record<string, unknown>
  strategy_update: string
  created_at: string
}

export interface ConfidenceMap {
  iq: number
  aq: number
  eq: number
  sq: number
  ocean: number
}

export interface AdaptiveQuestion {
  action: 'question'
  question: {
    id: string
    text: string
    options: QuestionOption[]
  }
  dimension_focus: string
  confidence_after: ConfidenceMap
  reasoning: string
}

export interface TestComplete {
  action: 'complete'
  message: string
}

export type NextQuestionResponse = AdaptiveQuestion | TestComplete
