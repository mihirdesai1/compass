'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditTest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    { q: "I'd rather build a machine than manage a team.", trait: "o" },
    { q: "I don't mind lying if it closes the deal.", trait: "a" },
    { q: "I can spot a tiny error in a contract in seconds.", trait: "c" },
    { q: "I thrive when everything is crashing around me.", trait: "n" },
    { q: "People usually think I'm the smartest person in the room.", trait: "iq" },
    { q: "I find it easy to talk HNWIs out of their money.", trait: "e" }
  ];

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers, val];
    if (currentStep < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate real raw score (20 to 100)
      const totalPoints = newAnswers.reduce((a, b) => a + b, 0);
      const maxPoints = questions.length * 5;
      const rawScore = Math.round((totalPoints / maxPoints) * 100);
      
      // FORCE the score into the URL
      router.push(`/results?iq=${rawScore}`);
    }
  };

  return (
    <div className="bg-[#F8F7F4] min-h-screen text-[#1A1916] font-sans p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="mb-8 h-1 bg-[#1A1916]/10 w-full">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
        </div>
        <h2 className="text-4xl font-serif italic mb-12">"{questions[currentStep].q}"</h2>
        <div className="grid gap-4">
          {[5, 4, 3, 2, 1].map((n) => (
            <button key={n} onClick={() => handleAnswer(n)} className="p-6 border border-[#1A1916]/20 hover:border-blue-600 text-left flex justify-between group">
              <span className="text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100">{n === 5 ? 'True' : n === 1 ? 'False' : 'Neutral'}</span>
              <span className="font-serif italic text-xl">{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
