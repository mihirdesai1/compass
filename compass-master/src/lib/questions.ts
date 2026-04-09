export interface QuestionSignals {
  iq: -1 | 0 | 1
  aq: -1 | 0 | 1
  eq: -1 | 0 | 1
  sq: -1 | 0 | 1
  openness: -1 | 0 | 1
  conscientiousness: -1 | 0 | 1
  extraversion: -1 | 0 | 1
  agreeableness: -1 | 0 | 1
  neuroticism: -1 | 0 | 1
}

export interface QuestionOption {
  id: 'a' | 'b' | 'c' | 'd'
  text: string
  signals: QuestionSignals
}

export interface Question {
  id: string
  dimension: 'iq' | 'aq' | 'eq' | 'sq' | 'ocean'
  situation: string
  question: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
}

export const questions: Question[] = [

  // ─── IQ (12) ─────────────────────────────────────────────────────────────

  {
    id: 'iq-1',
    dimension: 'iq',
    situation: "You are in a group project and your team's approach is clearly wrong. The deadline is tomorrow.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Stay up all night and redo the work yourself without telling anyone.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: -1, neuroticism: 1 } },
      { id: 'b', text: "Tell the group right now, risk the conflict, and try to fix it together.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Submit what you have — it might still pass.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'd', text: "Message the professor before submission to flag the issue.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-2',
    dimension: 'iq',
    situation: "You need to make an important career decision. You read two expert opinions that completely contradict each other. Both seem credible.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Go with the one who has higher credentials — seniority usually means more experience.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: -1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Keep researching until you find a clear third source that breaks the tie.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Go with whichever opinion feels right in your gut.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Post in a Reddit/Quora community and ask for more perspectives.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'iq-3',
    dimension: 'iq',
    situation: "You are 2 months into a new job. You have data suggesting your team's current strategy is going to fail. Your manager is confident and well-regarded.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Show the data to your manager privately and ask if you're missing something.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Stay quiet — you're too new to challenge strategy.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
      { id: 'c', text: "Raise it in the team meeting so everyone can see the data.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
      { id: 'd', text: "Run a small side-test to validate your hypothesis before saying anything.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'iq-4',
    dimension: 'iq',
    situation: "Your college project has two supervisors who've given you contradictory instructions. Both are confident they're right. Submission is in one week.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Follow the senior supervisor's instructions — hierarchy resolves conflicts.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'b', text: "Do both versions and pick the better one at the last minute.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Get both supervisors in the same conversation and let them align.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Choose the approach that makes more logical sense, document your reasoning, and inform both.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'iq-5',
    dimension: 'iq',
    situation: "In an important exam, you encounter a question that could mean two very different things. Both interpretations lead to completely different answers. You have 10 minutes left.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Write a note stating your interpretation and answer confidently based on it.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Pick the simpler interpretation and move fast — time matters more.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Answer both interpretations briefly within the same response.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Spend the 10 minutes trying to figure out which interpretation is correct.", signals: { iq: -1, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-6',
    dimension: 'iq',
    situation: "You've been selling handmade products online for 3 months. Sales are decent but you have no idea which platform or method is actually bringing in buyers.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Keep going — if it's working, don't overthink it.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Set up basic tracking to understand exactly what's driving sales.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Ask buyers directly how they found you — simple and free.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Double your spending on all channels and see which scales best.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'iq-7',
    dimension: 'iq',
    situation: "Your laptop keeps crashing randomly. You've restarted three times. Your deadline is in 2 hours and you need this device to submit.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Switch to a backup device or use a college computer immediately.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Work in safe mode and save every few minutes as a precaution.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Spend the time trying to diagnose and fix the crash before continuing.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'd', text: "Keep going and hope it holds until you submit.", signals: { iq: -1, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-8',
    dimension: 'iq',
    situation: "You want to invest ₹50,000 in savings. One friend says real estate, another says mutual funds, your father says FD. You have a week to decide.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Split equally between all three to keep everyone happy and reduce risk.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Research each option and decide based on your actual risk tolerance and timeline.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Go with your father's advice — he's seen more financial cycles than you.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: -1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Keep it in savings until you feel more confident about the decision.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-9',
    dimension: 'iq',
    situation: "You are 4 months into a 5-month research project. You just realised the core methodology is flawed and the data isn't valid. Presenting it as-is could damage your credibility.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Continue and present it — you cannot redo 4 months of work.", signals: { iq: -1, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Tell your supervisor, explain what happened, and figure out what's salvageable.", signals: { iq: 1, aq: 1, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Reframe the flawed sections as a 'limitations and future work' section.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Start over from scratch even if it means missing the deadline.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-10',
    dimension: 'iq',
    situation: "You got into two colleges. Equal rank, equal fees, different cities. One is a safer career bet, one is riskier but potentially better. You must decide today.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Make a pros/cons list and go with whichever side is longer.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Call alumni from both and ask about real placement outcomes.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Go with your gut — if both are equal on paper, logic won't separate them.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Ask your parents — this decision affects the whole family.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'iq-11',
    dimension: 'iq',
    situation: "You have a job offer you really want. HR won't tell you the team structure, who you'd report to, or what the actual day-to-day looks like. You have 24 hours to accept.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Accept — the offer is good and details sort themselves out.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'b', text: "Ask directly for a 15-minute call with your would-be manager before deciding.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Research the company and team on LinkedIn and Glassdoor yourself.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Decline — companies that hide this information usually have a reason.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: -1, neuroticism: 1 } },
    ],
  },

  {
    id: 'iq-12',
    dimension: 'iq',
    situation: "You are in a job interview solving a case study. You notice a pattern in the data that might be important, but you're not 100% certain. Time is almost up.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Mention it as a hypothesis you'd want to test, not a conclusion.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Stay silent — if you're not sure, don't bring it up.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "State it confidently — confidence is what interviewers want to see.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'd', text: "Ask the interviewer if they want you to explore that angle before you run out of time.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  // ─── AQ (12) ─────────────────────────────────────────────────────────────

  {
    id: 'aq-1',
    dimension: 'aq',
    situation: "You are 3 months into a ₹40,000 certification course. You now realise the field is wrong for you and this won't help your career at all.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Finish it — you paid for it and quitting feels like failure.", signals: { iq: 0, aq: -1, eq: -1, sq: 0, openness: -1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Stop immediately and start figuring out what you actually want.", signals: { iq: 0, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Keep attending but use the spare time to also build in the right direction.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Talk to your parents before making any decision.", signals: { iq: 0, aq: -1, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
    ],
  },

  {
    id: 'aq-2',
    dimension: 'aq',
    situation: "You accepted a job offer and gave up another opportunity. Three days before your start date, the company calls — the position is on hold indefinitely. You are now unemployed.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Immediately contact every professional connection and start applying in parallel.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Take a week to process before deciding what to do next.", signals: { iq: 0, aq: -1, eq: 1, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Call the company back and ask if there's any other role you could fill.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Reach out to the opportunity you gave up and honestly explain the situation.", signals: { iq: 0, aq: 1, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-3',
    dimension: 'aq',
    situation: "You have been preparing for an exam using the same study method for years. This time it isn't working — you're not retaining anything. The exam is 2 months away.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Push harder with the same method — you're probably just not focused enough.", signals: { iq: -1, aq: -1, eq: -1, sq: 0, openness: -1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Completely change your approach and try something new immediately.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Research what study methods work best for this specific exam, then switch.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Lower your expectations for this attempt and plan better for the retake.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
    ],
  },

  {
    id: 'aq-4',
    dimension: 'aq',
    situation: "You spent 2 years building expertise in a skill. A new AI tool now does it in seconds for free. Companies have largely stopped hiring for your role.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Wait and see — technology hype usually fades.", signals: { iq: -1, aq: -1, eq: 0, sq: 0, openness: -1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Start immediately learning skills that make you work better alongside the AI.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Pivot to a completely different field that isn't affected yet.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Double down on depth — specialists with rare expertise survive these cycles.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-5',
    dimension: 'aq',
    situation: "You moved to Bangalore for a new job. Your PG accommodation fell through. You don't know anyone in the city. Work starts in 2 days. Your phone is at 20%.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Book the first decent hotel you find online, deal with the PG search tomorrow.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Call home and consider going back until things are sorted.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
      { id: 'c', text: "Post in Bangalore housing Facebook groups and local subreddits asking for emergency leads.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Go directly to the office and ask HR if they can help with temporary accommodation.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-6',
    dimension: 'aq',
    situation: "You are halfway through a major project with a partner. They drop out with no warning. You can't find a replacement and the submission is in 3 weeks.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Inform the professor now, explain the situation, and ask for adjusted expectations or an extension.", signals: { iq: 1, aq: 1, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Try to complete the entire project alone — it's your grade too.", signals: { iq: 0, aq: 1, eq: -1, sq: -1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: -1, neuroticism: 1 } },
      { id: 'c', text: "Submit only your portion and document clearly what was your contribution.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Ask for the project to be cancelled and receive an Incomplete grade.", signals: { iq: -1, aq: -1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'aq-7',
    dimension: 'aq',
    situation: "You have a 5-year career plan. Halfway through, the industry you're targeting has a major crash — mass layoffs, companies shutting down. Most of your peers are panicking.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Stick to the plan — industry cycles happen and it will recover.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: -1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Research adjacent industries where your skills transfer and start building there.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Take the crash as a signal and completely reinvent yourself immediately.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'd', text: "Talk to 5-6 people inside the industry to get real information before making any move.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-8',
    dimension: 'aq',
    situation: "A scholarship or stipend you were relying on gets cancelled without warning. You have ₹8,000 left. Your monthly expenses are ₹15,000.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Call family immediately and ask for help.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "List all non-essential expenses and cut them today, then find any income source fast.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Apply for every quick income source simultaneously — tutoring, freelance, delivery.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Move back home temporarily to buy time and reset.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-9',
    dimension: 'aq',
    situation: "You've been building a product for 6 months. A well-funded startup just announced the exact same idea with a professional team and ₹5 crore in funding. You have 3 months of savings left.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Shut it down — you can't compete with ₹5 crore.", signals: { iq: -1, aq: -1, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Find the one angle they can't do as well and focus everything on that.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Reach out to the funded startup — maybe you can collaborate or they'd want to acquire.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Pivot the product to a niche audience the big startup won't bother targeting.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'aq-10',
    dimension: 'aq',
    situation: "JEE results are out. You didn't get an IIT. You got a decent NIT. Your plan was always IIT. Your family is disappointed.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take a drop year and prepare again.", signals: { iq: 0, aq: -1, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "Accept the NIT, reframe your goal, and focus on what you can build from here.", signals: { iq: 0, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Look seriously at alternative paths — entrepreneurship, upskilling, working and studying.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Feel devastated for a few weeks, then decide once the emotion has passed.", signals: { iq: 0, aq: -1, eq: 1, sq: 0, openness: 0, conscientiousness: -1, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'aq-11',
    dimension: 'aq',
    situation: "You fought hard to get into a creative field — design, writing, content. Six months in, the work is tedious, underpaid, and nothing like you imagined.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Give it at least a year before judging — early stages are always hard.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Diagnose whether this is temporary growing pain or a structural mismatch with this field.", signals: { iq: 1, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Look for ways to stay in the field but shift to a different role within it.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Admit the mistake and start looking at more stable, predictable options.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
    ],
  },

  {
    id: 'aq-12',
    dimension: 'aq',
    situation: "A respected mentor reviews your 2 months of work and says the entire approach is wrong and you should start over. You believe in what you built.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Ask them to explain exactly what is wrong and where you see it differently.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 0 } },
      { id: 'b', text: "Thank them and start over without pushing back — they've seen more than you.", signals: { iq: -1, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Get a second opinion from someone else you respect before deciding.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Continue your way and use the results to prove whether you were right.", signals: { iq: 0, aq: -1, eq: -1, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
    ],
  },

  // ─── EQ (12) ─────────────────────────────────────────────────────────────

  {
    id: 'eq-1',
    dimension: 'eq',
    situation: "You are presenting your idea in front of a group. Someone interrupts and says your idea will not work. Everyone is watching.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Ask them to explain specifically what won't work — you want to understand.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'b', text: "Feel embarrassed, lose your train of thought, and continue awkwardly.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Thank them for the input and move on without engaging with it.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'd', text: "Defend your idea immediately and explain why they are wrong.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
    ],
  },

  {
    id: 'eq-2',
    dimension: 'eq',
    situation: "A mentor you deeply respect tells you directly: 'This work isn't good enough. You need to get serious.' You worked very hard on this and feel hurt.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Thank them, go home, feel bad for a day, then eventually get back to work.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "Ask them exactly what 'serious' means and what specifically needs to change.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Tell them you disagree — you put in real effort and don't think that's fair.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
      { id: 'd', text: "Spiral and start questioning whether you should continue this path at all.", signals: { iq: -1, aq: -1, eq: -1, sq: 0, openness: 0, conscientiousness: -1, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'eq-3',
    dimension: 'eq',
    situation: "You made a significant mistake in front of your whole team or class. Everyone saw it. You can tell people are talking about it.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Address it directly — acknowledge the mistake and explain what you're doing to fix it.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Avoid the people who saw it for a few days until it blows over.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Pretend it didn't happen and act completely normally.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'd', text: "Make a light joke about it to reduce the tension and move on.", signals: { iq: 0, aq: 1, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: -1 } },
    ],
  },

  {
    id: 'eq-4',
    dimension: 'eq',
    situation: "You told your family about your career choice. They are visibly disappointed and have started telling relatives it's a mistake. You believe in your path.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Have a real conversation with your family about why you believe in this direction.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Stay quiet to keep the peace and hope they come around when they see results.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
      { id: 'c', text: "Feel guilty enough to reconsider — maybe they know something you don't.", signals: { iq: -1, aq: -1, eq: -1, sq: 0, openness: -1, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
      { id: 'd', text: "Stop sharing career updates with them until you have results to show.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'eq-5',
    dimension: 'eq',
    situation: "Your close friend just got a huge break — dream job, great salary. You're genuinely happy for them but also feeling something uncomfortable and dark about your own situation.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Sit with the feeling and figure out what it's actually telling you about what you want.", signals: { iq: 1, aq: 0, eq: 1, sq: 0, openness: 1, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Push the feeling down — it's not who you want to be and it will pass.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
      { id: 'c', text: "Tell your friend honestly how you're feeling — you trust them enough.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Use the feeling as fuel and throw yourself into your own work.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'eq-6',
    dimension: 'eq',
    situation: "A teammate took credit for your work in front of people who matter. You're genuinely angry. You have to work with this person for 3 more months.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Confront them privately and directly about what they did.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
      { id: 'b', text: "Say nothing, become cold and distant, let the work relationship sour.", signals: { iq: -1, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Let it go this time but start documenting your contributions carefully going forward.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Tell your manager what happened before this becomes a pattern.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'eq-7',
    dimension: 'eq',
    situation: "You prepared for months for an exam or job interview. You did everything right and still didn't get it. The rejection came as a cold email with no explanation.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take a few days off — you need to feel this before moving forward.", signals: { iq: 0, aq: 0, eq: 1, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Immediately start the next application — there's no time to sit with it.", signals: { iq: 0, aq: 1, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Email and ask for specific feedback, even knowing the odds are low.", signals: { iq: 1, aq: 0, eq: 1, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Start questioning whether this path is the right one for you.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'eq-8',
    dimension: 'eq',
    situation: "A close friend tells you they've been really struggling — mentally and emotionally. They don't ask for anything specific. They just tell you. You don't know what to say.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Listen without trying to fix anything — just be present and let them talk.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Immediately suggest professional help — a counsellor or therapist.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Share your own struggles to show you understand and they're not alone.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Feel uncomfortable, not know what to say, and gently change the subject.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: -1, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'eq-9',
    dimension: 'eq',
    situation: "You've been trying to break into your field for 14 months — applying, building, getting rejected. You haven't given up but you are completely exhausted.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take a real break — rest is part of the process, not a failure of commitment.", signals: { iq: 0, aq: 1, eq: 1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Push harder — the breakthrough is probably just around the corner.", signals: { iq: -1, aq: -1, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Step back and seriously review your strategy — 14 months means something isn't working.", signals: { iq: 1, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Talk to someone who has been through something similar — you need a reality check.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'eq-10',
    dimension: 'eq',
    situation: "You are in a professional setting — an office or internship. A colleague suddenly starts crying at their desk. You are the only person nearby.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Go over quietly and ask if there's anything they need.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Give them space — you don't want to intrude and make it more awkward.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Ask what happened — you want to understand and help if you can.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Feel uncomfortable and leave to get water, hoping the moment passes.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'eq-11',
    dimension: 'eq',
    situation: "Your friend asks for honest feedback on their business idea they've worked on for months. It has serious problems. They're clearly hoping you'll validate it.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Give completely honest feedback — they asked for it and they deserve the truth.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
      { id: 'b', text: "Focus on the positives and suggest only small improvements.", signals: { iq: -1, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "First ask what kind of feedback they're looking for before giving any.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Give honest feedback but spend equal time on genuine strengths and real problems.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'eq-12',
    dimension: 'eq',
    situation: "You worked as hard as everyone else on a team project. When the leader distributed credit, you were significantly overlooked. You're confident it was unfair.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Say nothing — making noise about credit looks petty.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "Bring it up privately with the leader and calmly explain your perspective.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Bring it up in front of the group so everyone hears it.", signals: { iq: 0, aq: 0, eq: 0, sq: -1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
      { id: 'd', text: "Let it go but make your individual contributions more visible from here on.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
    ],
  },

  // ─── SQ (12) ─────────────────────────────────────────────────────────────

  {
    id: 'sq-1',
    dimension: 'sq',
    situation: "You're at a college party where everyone is doing something you're not comfortable with. Your close friend is pressuring you to join.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Join anyway — the friendship matters more and it's not a big deal.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 1, conscientiousness: -1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Make an excuse and leave quietly without explaining.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Tell your friend directly you're not comfortable and see what they do with that.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Stay but don't participate, hoping no one notices.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
    ],
  },

  {
    id: 'sq-2',
    dimension: 'sq',
    situation: "You need something important from a senior — a recommendation or introduction. You've been putting it off. Today they seem visibly stressed and distracted. Your deadline is tomorrow.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Ask anyway — you have a deadline and their stress isn't your problem.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: -1, neuroticism: -1 } },
      { id: 'b', text: "Wait, watch for a better moment, and ask when they seem calmer.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Send an email so they can respond when they're ready.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Ask a mutual person to quietly put in a word on your behalf.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'sq-3',
    dimension: 'sq',
    situation: "You just started a new job. Within the first week you can already see factions forming, a person everyone avoids, and an unspoken hierarchy nobody explains.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Observe without picking sides for the first month — understand before you act.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Try to befriend everyone equally and stay strictly neutral.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Align with whoever seems most respected or powerful.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'd', text: "Ignore the politics entirely and focus on doing good work.", signals: { iq: -1, aq: 0, eq: 0, sq: -1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: -1 } },
    ],
  },

  {
    id: 'sq-4',
    dimension: 'sq',
    situation: "You joined a new friend group where everyone has years of history. Inside jokes you don't get, references you miss. You feel like a permanent outsider.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Be patient and keep showing up — relationships take time to build.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'b', text: "Ask about the references and jokes — show genuine curiosity about their world.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Match their energy and wait for a natural moment to contribute something real.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Stay on the periphery — you don't want to force a connection that isn't there.", signals: { iq: 0, aq: -1, eq: 0, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'sq-5',
    dimension: 'sq',
    situation: "Your parents keep telling relatives you're going to become a doctor or engineer. You're on a completely different path. A family gathering is in two weeks where this will definitely come up.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Have the conversation with your parents before the event so they're not blindsided.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Let the event happen and deal with it in the moment — you'll figure it out.", signals: { iq: -1, aq: 1, eq: -1, sq: -1, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Skip the gathering entirely to avoid the confrontation.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'd', text: "Prepare a calm, confident one-sentence explanation and deliver it when asked.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
    ],
  },

  {
    id: 'sq-6',
    dimension: 'sq',
    situation: "A close friend asks to borrow ₹15,000. You have it. Their situation is genuinely rough. You also know they borrowed from mutual friends before and didn't pay back.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Lend it — they need it and that's what friendship is.", signals: { iq: -1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Say you don't have it available right now.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Lend a smaller amount you're emotionally OK not getting back.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Ask directly about the previous loans before making any decision.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
    ],
  },

  {
    id: 'sq-7',
    dimension: 'sq',
    situation: "Two close friends are fighting. Both call you separately to vent and ask for your support. Both are asking you to take their side.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Support both privately without taking a position — hear them both out.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Tell both of them you're not comfortable being in the middle of this.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Side with the one you're genuinely closer to — loyalty matters.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Try to mediate — get them to talk to each other directly.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'sq-8',
    dimension: 'sq',
    situation: "You're in a professional gathering. You know something private about one senior person present — not a rumour, an actual fact. Someone starts talking about that person positively.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Stay silent — it's not your information to share.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Hint subtly that there might be more to the story.", signals: { iq: -1, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
      { id: 'c', text: "Share what you know — people deserve accurate information.", signals: { iq: 0, aq: 0, eq: -1, sq: -1, openness: 1, conscientiousness: -1, extraversion: 1, agreeableness: -1, neuroticism: 0 } },
      { id: 'd', text: "Change the subject to something else entirely.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'sq-9',
    dimension: 'sq',
    situation: "You are at a professional event alone — a startup meetup or industry conference. You don't know anyone. You're standing near the food.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Wait for someone to approach you.", signals: { iq: 0, aq: -1, eq: 0, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Identify the most interesting-looking person and start a conversation.", signals: { iq: 1, aq: 1, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Find someone else who also looks alone and start there.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Open your phone and look busy until you feel comfortable enough to approach someone.", signals: { iq: 0, aq: -1, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'sq-10',
    dimension: 'sq',
    situation: "You failed something publicly — an exam, a startup, a big pitch. Some people already know. You're deciding whether to post about it on LinkedIn or Instagram.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Post honestly about what happened — vulnerability builds real trust.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Say nothing publicly — process it privately and move forward quietly.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'c', text: "Post about it only later when you have a comeback story to attach to it.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Post something completely unrelated to change the subject in people's feeds.", signals: { iq: -1, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'sq-11',
    dimension: 'sq',
    situation: "You are in a group. Someone shares their work and asks you directly, 'What do you honestly think?' Everyone is watching. The work has real problems.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Give gentle but honest feedback in front of everyone.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "Compliment it — you don't want to embarrass them publicly.", signals: { iq: -1, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Say something noncommittal like 'it's a good start' and leave it there.", signals: { iq: -1, aq: 0, eq: -1, sq: -1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Ask to share feedback privately after — 'let me think about it properly.'", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'sq-12',
    dimension: 'sq',
    situation: "Your manager asks you to do something that crosses a personal ethical line. It's not illegal, but it feels wrong. Your job seems secure.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Do it — you need this job and it's not illegal.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "Tell your manager you're not comfortable and explain clearly why.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: -1, neuroticism: 0 } },
      { id: 'c', text: "Do it this time, but quietly start looking for another job.", signals: { iq: 0, aq: 1, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'd', text: "Escalate the issue to HR or someone more senior.", signals: { iq: 1, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  // ─── OCEAN (12) ──────────────────────────────────────────────────────────

  {
    id: 'ocean-1',
    dimension: 'ocean',
    situation: "You have a completely free Saturday — no obligations, no one expecting anything from you, nothing that needs to be done.",
    question: "What do you actually do?",
    options: [
      { id: 'a', text: "Plan it out the night before so you actually use it well.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'b', text: "See how you feel in the morning and decide then.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Call friends immediately — a free day is a social day.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Stay home, recharge, read or consume something you've been putting off.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'ocean-2',
    dimension: 'ocean',
    situation: "Your friend group wants to plan a trip. Nobody has taken initiative. You're the most available one.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Take charge — build a full itinerary, hotel options, cost breakdown, and send it.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Create a group poll and let everyone vote on the key decisions.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Give lots of ideas and energy but avoid being the person formally 'in charge.'", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Say you'll go along with whatever — you genuinely don't care about the details.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
    ],
  },

  {
    id: 'ocean-3',
    dimension: 'ocean',
    situation: "You get an unexpected opportunity — a collaboration, an internship abroad, a chance at something big. It requires dropping your current plans for 3 months.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Research it thoroughly before getting excited — if it sounds too good, it usually is.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Say yes immediately — opportunities like this don't come twice.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'c', text: "Explore it seriously while weighing what you'd have to give up.", signals: { iq: 1, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Pass — you have a plan and stability matters more right now.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: -1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'ocean-4',
    dimension: 'ocean',
    situation: "You walk into a situation someone else left in complete chaos — a shared project, a common space, a plan. You weren't responsible but someone has to fix it.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Fix it without mentioning it — the outcome matters more than the accountability.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 1, neuroticism: 0 } },
      { id: 'b', text: "Fix it but make sure the right person knows what you did and what happened.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Leave it for whoever made the mess — it teaches accountability.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: -1, neuroticism: 0 } },
      { id: 'd', text: "Fix it while venting about it to someone nearby.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
    ],
  },

  {
    id: 'ocean-5',
    dimension: 'ocean',
    situation: "You are facing a difficult personal life decision — not career, something deeper. There's no deadline. No one is waiting on you.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Research it, make a pros/cons list, sleep on it for a few days.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Talk to 3-4 people whose judgment you respect before deciding.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Trust your gut — big decisions don't get better with more analysis.", signals: { iq: -1, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'd', text: "Wait until the situation forces a decision — clarity comes from pressure.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
    ],
  },

  {
    id: 'ocean-6',
    dimension: 'ocean',
    situation: "In a conversation, someone challenges a belief you hold strongly. They make some genuinely good points you hadn't considered before.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Listen properly and update your view if their argument is solid.", signals: { iq: 1, aq: 1, eq: 1, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'b', text: "Defend your position — you've thought about this more than they have.", signals: { iq: 0, aq: -1, eq: -1, sq: 0, openness: -1, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: 1 } },
      { id: 'c', text: "Engage with curiosity but need time alone to actually think it through properly.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Agree to disagree — some things are personal and not worth a debate.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
    ],
  },

  {
    id: 'ocean-7',
    dimension: 'ocean',
    situation: "In a group situation, everyone looks to you to lead something — a project, an event, a decision. Nobody said you're in charge. They're just waiting on you.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Step up — if no one else will, you will.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Ask the group who actually wants to take the lead before assuming it's you.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Start leading but stay clearly open to others taking over if they want to.", signals: { iq: 0, aq: 1, eq: 1, sq: 1, openness: 0, conscientiousness: 1, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'd', text: "Feel uncomfortable but step up because someone has to.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'ocean-8',
    dimension: 'ocean',
    situation: "Someone publicly praises your work in front of a group — more strongly than you expected. You feel a bit embarrassed.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Deflect immediately and give credit to the team or circumstances.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: -1, agreeableness: 1, neuroticism: 1 } },
      { id: 'b', text: "Accept it graciously with a simple thank you and move on.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: -1 } },
      { id: 'c', text: "Enjoy it visibly — you worked hard and it's okay to let that land.", signals: { iq: 0, aq: 0, eq: 1, sq: 0, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: -1, neuroticism: -1 } },
      { id: 'd', text: "Feel awkward and make a self-deprecating joke to reduce the tension.", signals: { iq: 0, aq: 0, eq: -1, sq: 0, openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 1 } },
    ],
  },

  {
    id: 'ocean-9',
    dimension: 'ocean',
    situation: "You are choosing between two jobs. Option A is a fast startup — chaotic, exciting, no structure. Option B is a corporate role — stable, structured, clear growth path. Pay is the same.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Option A — chaos is where interesting things happen and you learn faster.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: -1, extraversion: 1, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Option B — structure lets you do deep work and build real skills without the noise.", signals: { iq: 0, aq: 0, eq: 0, sq: 0, openness: -1, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'c', text: "Try to negotiate with the startup to get more clarity and structure before deciding.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Decide based entirely on the team and manager — not the structure or company type.", signals: { iq: 1, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 1, neuroticism: 0 } },
    ],
  },

  {
    id: 'ocean-10',
    dimension: 'ocean',
    situation: "You are 3 months into a self-directed project — no one reviewing your work, no check-ins, no external validation. You don't know if you're on the right track.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Keep going — the work itself is the signal, not external approval.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Share it with someone even if it's not required — you need a reality check.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 1 } },
      { id: 'c', text: "Set your own milestones and review against them yourself.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
      { id: 'd', text: "Start losing motivation — you need external feedback to keep going.", signals: { iq: 0, aq: -1, eq: -1, sq: 0, openness: 0, conscientiousness: -1, extraversion: 1, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'ocean-11',
    dimension: 'ocean',
    situation: "You want to try something none of your friends have done before — an unconventional career move, a new lifestyle, a different path. Nobody in your circle has done it.",
    question: "What do you do?",
    options: [
      { id: 'a', text: "Do it without making a big deal of it — it doesn't need to be an announcement.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: -1 } },
      { id: 'b', text: "Talk about it openly — sharing the journey is part of why you do it.", signals: { iq: 0, aq: 0, eq: 0, sq: 1, openness: 1, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Research it thoroughly first to make sure it's actually a good idea.", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
      { id: 'd', text: "Wait to see if anyone else in your circle tries it first.", signals: { iq: 0, aq: -1, eq: 0, sq: 0, openness: -1, conscientiousness: -1, extraversion: 0, agreeableness: 0, neuroticism: 1 } },
    ],
  },

  {
    id: 'ocean-12',
    dimension: 'ocean',
    situation: "It's the end of the year. You're naturally thinking back on what happened.",
    question: "What does that reflection look like for you?",
    options: [
      { id: 'a', text: "Measure against the specific goals you set — where did you land versus where you planned?", signals: { iq: 1, aq: 0, eq: 0, sq: 0, openness: 0, conscientiousness: 1, extraversion: -1, agreeableness: 0, neuroticism: 1 } },
      { id: 'b', text: "Think about the people — the relationships built, the conversations that mattered.", signals: { iq: 0, aq: 0, eq: 1, sq: 1, openness: 0, conscientiousness: 0, extraversion: 1, agreeableness: 1, neuroticism: 0 } },
      { id: 'c', text: "Mostly look forward — the past is information, not something to dwell on.", signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: -1 } },
      { id: 'd', text: "Notice the overall feeling — was this a good year or not, in your gut?", signals: { iq: 0, aq: 0, eq: 1, sq: 0, openness: 1, conscientiousness: -1, extraversion: -1, agreeableness: 0, neuroticism: 0 } },
    ],
  },
]

// Helper: get full question text for deduplication
export function getQuestionText(q: Question): string {
  return `${q.situation} ${q.question}`
}
