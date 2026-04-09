'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';

export default function AuditTest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({
    iq: [], aq: [], eq: [], sq: [],
    openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: []
  });

  const current = questions[currentStep];

  const handleAnswer = (signalValues: Record<string, number>) => {
    const newAnswers = { ...answers };
    Object.entries(signalValues).forEach(([trait, val]) => {
      newAnswers[trait] = [...(newAnswers[trait] || []), val];
    });

    if (currentStep < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      const score = (arr: number[]) => {
        if (!arr.length) return 50;
        const sum = arr.reduce((a, b) => a + b, 0);
        const normalized = ((sum / arr.length) + 1) / 2;
        return Math.round(70 + normalized * 75);
      };
      const params = new URLSearchParams({
        iq: String(score(newAnswers.iq)),
        aq: String(score(newAnswers.aq)),
        eq: String(score(newAnswers.eq)),
        sq: String(score(newAnswers.sq)),
        openness: String(score(newAnswers.openness)),
        conscientiousness: String(score(newAnswers.conscientiousness)),
        extraversion: String(score(newAnswers.extraversion)),
        agreeableness: String(score(newAnswers.agreeableness)),
        neuroticism: String(score(newAnswers.neuroticism)),
      });
      router.push(`/results?${params.toString()}`);
    }
  };

  const handleNone = () => {
    const neutral: Record<string, number> = {
      iq: 0, aq: 0, eq: 0, sq: 0,
      openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0
    };
    handleAnswer(neutral);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-[#F8F7F4] min-h-screen text-[#1A1916] font-sans p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">

        {/* Progress bar */}
        <div className="mb-2 h-1 bg-[#1A1916]/10 w-full">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
        </div>

        {/* Question number */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] uppercase tracking-widest opacity-40">Question {currentStep + 1}</span>
          {currentStep > 0 && (
            <button onClick={handleBack} className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
              ← Back
            </button>
          )}
        </div>

        {/* Situation */}
        {current.situation && (
          <p className="text-sm opacity-60 mb-4 leading-relaxed">{current.situation}</p>
        )}

        {/* Question */}
        <h2 className="text-3xl font-serif italic mb-10">{current.question}</h2>

        {/* Options */}
        <div className="grid gap-3">
          {current.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer({
                iq: opt.signals.iq,
                aq: opt.signals.aq,
                eq: opt.signals.eq,
                sq: opt.signals.sq,
                openness: opt.signals.openness,
                conscientiousness: opt.signals.conscientiousness,
                extraversion: opt.signals.extraversion,
                agreeableness: opt.signals.agreeableness,
                neuroticism: opt.signals.neuroticism,
              })}
              className="p-5 border border-[#1A1916]/20 hover:border-blue-600 text-left transition-colors"
            >
              <span className="text-sm leading-relaxed">{opt.text}</span>
            </button>
          ))}

          {/* None of these */}
          <button
            onClick={handleNone}
            className="p-5 border border-dashed border-[#1A1916]/20 hover:border-blue-600 text-left transition-colors"
          >
            <span className="text-[11px] uppercase tracking-widest opacity-40">None of these feel right</span>
          </button>
        </div>

      </div>
    </div>
  );
}
