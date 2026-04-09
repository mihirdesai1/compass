import { createClient } from '@/lib/supabase/server'
import { questions, getQuestionText } from '@/lib/questions'
import { NextResponse } from 'next/server'

const MIN_QUESTIONS = 10
const MAX_QUESTIONS = 20

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
    const { session_id, previous_answers = [] } = body

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Save the previous question's answer first
    if (previous_answers.length > 0) {
      const lastAnswer = previous_answers[previous_answers.length - 1]
      if (lastAnswer.question_id && lastAnswer.answer) {
        await supabase
          .from('questions_log')
          .update({
            answer_chosen: lastAnswer.answer,
            dimension_tags: lastAnswer.dimension_signals ?? {}
          })
          .eq('id', lastAnswer.question_id)
          .eq('session_id', session_id)
      }
    }

    // Get session
    const { data: session } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get question history for this session — used to prevent repeats
    const { data: questionHistory } = await supabase
      .from('questions_log')
      .select('question_text, sequence_number, answer_chosen')
      .eq('session_id', session_id)
      .order('sequence_number', { ascending: true })

    const questionCount = questionHistory?.length ?? 0

    // Force end after MAX_QUESTIONS regardless of anything
    if (questionCount >= MAX_QUESTIONS) {
      return NextResponse.json({ action: 'complete', message: 'Test complete' })
    }

    // Check dimension coverage for adaptive ending between MIN and MAX
    if (questionCount >= MIN_QUESTIONS) {
      const answeredQuestions = questionHistory?.filter(q => q.answer_chosen) ?? []
      const dimensions = ['iq', 'aq', 'eq', 'sq', 'ocean']
      // Count how many questions per dimension have been answered
      // If we have at least 2 answered per dimension, we can end
      const dimensionCoverage = dimensions.every(dim => {
        const matching = questions.filter(q =>
          q.dimension === dim &&
          answeredQuestions.some(a => a.question_text === getQuestionText(q))
        )
        return matching.length >= 2
      })
      if (dimensionCoverage) {
        return NextResponse.json({ action: 'complete', message: 'Test complete' })
      }
    }

    // Build set of already-asked question texts — never repeat these
    const askedTexts = new Set(questionHistory?.map(q => q.question_text) ?? [])

    // Find next unasked question — filter out any already in this session's log
    const nextQuestion = questions.find(q => !askedTexts.has(getQuestionText(q)))

    // If no unasked questions remain, complete
    if (!nextQuestion) {
      return NextResponse.json({ action: 'complete', message: 'Test complete' })
    }

    const fullText = getQuestionText(nextQuestion)

    // Double-check: this exact text must not exist in log for this session
    if (askedTexts.has(fullText)) {
      // Should never happen given the filter above, but safety net
      return NextResponse.json({ action: 'complete', message: 'Test complete' })
    }

    // Log the question
    const { data: questionLog } = await supabase
      .from('questions_log')
      .insert({
        session_id,
        user_id: user.id,
        question_text: fullText,
        options: nextQuestion.options.map(o => ({
          id: o.id,
          text: o.text,
          dimension_signals: o.signals
        })),
        dimension_tags: { [nextQuestion.dimension]: 1 },
        sequence_number: questionCount + 1
      })
      .select()
      .single()

    // Update session with question count
    await supabase
      .from('test_sessions')
      .update({
        total_questions: questionCount + 1
      })
      .eq('id', session_id)

    return NextResponse.json({
      action: 'question',
      question: {
        id: questionLog?.id ?? `q-${questionCount + 1}`,
        text: fullText,
        options: nextQuestion.options.map(o => ({
          id: o.id,
          text: o.text,
          dimension_signals: o.signals
        }))
      },
      dimension_focus: nextQuestion.dimension,
      progress: questionCount + 1,
      total_questions: MAX_QUESTIONS
    })
  } catch (error) {
    console.error('Next question error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
