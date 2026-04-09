'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTopFive } from '@/lib/scoring-engine';

function ResultsContent() {
  const searchParams = useSearchParams();
  
  // NUCLEAR FAIL-SAFE: Check every possible name for the score
  const rawUrlScore = searchParams.get('iq') || searchParams.get('ui_score') || searchParams.get('score');
  
  // If the URL is empty, we use 85 so it doesn't default to 145
  const rawScore = rawUrlScore ? parseInt(rawUrlScore) : 85;
  
  // Engine Math: 70 + (rawScore * 0.75)
  const displayIq = Math.round(70 + (rawScore * 0.75));

  const careers = getTopFive({
    iq: rawScore,
    neuroticism: 50,
    conscientiousness: 70,
    openness: 70,
    extraversion: 70,
    agreeableness: 30
  }, "Pune");

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans text-[#1A1916] bg-[#F8F7F4] min-h-screen">
      <header className="mb-20 border-b border-[#1A1916] pb-12 pt-12">
        <h1 className="text-8xl font-serif italic tracking-tighter mb-8">The Audit.</h1>
        {!rawUrlScore && (
          <p className="text-red-600 text-[10px] uppercase font-bold mb-4">Warning: No live data detected. Showing baseline audit.</p>
        )}
        <div className="flex gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold">Standard IQ</p>
            <p className="text-5xl font-light">{displayIq}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2 font-bold">Market Bracket</p>
            <p className="text-5xl font-light">TOP {displayIq > 125 ? '3' : '15'}%</p>
          </div>
        </div>
      </header>

      <div className="space-y-24">
        {careers.map((job: any, i: number) => (
          <div key={i} className="border-b border-[#1A1916]/10 pb-16">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1">{job.category}</p>
                <h3 className="text-4xl font-serif italic">{job.title}</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-medium">₹{job.adjustedEntrySalary} LPA</p>
              </div>
            </div>
            <div className="mt-8 text-sm italic border-l border-[#1A1916] pl-4">
              "{job.getting_the_job.phase_4_entry_hack}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Diagnostic...</div>}><ResultsContent /></Suspense>;
}
