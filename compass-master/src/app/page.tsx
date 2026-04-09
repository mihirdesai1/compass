'use client';
import Link from 'next/link';
export default function LandingPage() {
  return (
    <div className="bg-[#F8F7F4] min-h-screen text-[#1A1916] font-sans selection:bg-blue-200 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <main className="max-w-6xl mx-auto px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          
          <div className="flex-1">
            <h1 className="text-7xl font-serif italic tracking-tighter leading-[0.9] mb-12">
              Building something I wish<br />
              <span className="text-blue-600">existed when I was 20.</span>
            </h1>
            
            <div className="max-w-md space-y-6 text-lg leading-relaxed opacity-90">
              <p>
                I failed college once, dropped out of my Masters, and spent 4 years as an equity research analyst and CFO — before realising I was in the wrong role.
              </p>
              <p>
                The research side felt like flow. The CFO side felt like rubbing my face against a cheese grater every day. Same industry. Completely different cognitive demands. I have ADHD. Nobody told me that before I took the job.
              </p>
              <p>
                In India, your relatives pick your career. Your parents pick your backup. Nobody asks who you actually are.
              </p>
              <p className="text-sm border-l-2 border-[#1A1916] pl-4 italic">
                Compass tests your IQ, EQ, AQ, SQ and OCEAN profile — and maps your results to careers where you'll naturally be in flow, not just survive.
              </p>
            </div>
            <div className="mt-12 flex gap-6 items-center">
              <Link href="/test" className="bg-[#1A1916] text-[#F8F7F4] px-10 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-blue-600 transition-colors">
                Take The Test
              </Link>
              <span className="text-[10px] uppercase tracking-widest opacity-40">
                20 minutes.<br />Free.
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 p-8 border border-[#1A1916]/10 bg-white/50 backdrop-blur-sm text-[#1A1916]">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-40">What We Test</p>
            <ul className="space-y-8">
              <li>
                <p className="text-xs font-bold mb-1">IQ — Intelligence Quotient</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">Raw cognitive processing speed. Determines which roles your brain is structurally built to handle.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">EQ — Emotional Quotient</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">How well you read and manage emotions. Critical for client-facing, leadership, and people-heavy roles.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">AQ — Adaptability Quotient</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">How well you handle change and uncertainty. The most important trait for non-linear career paths.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">SQ — Social Quotient</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">How well you navigate relationships and group dynamics. Determines fit for collaborative or solo environments.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">OCEAN — The Big Five</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. The most validated personality framework in psychology.</p>
              </li>
            </ul>
          </div>

        </div>
      </main>
      <footer className="fixed bottom-8 left-8 text-[10px] uppercase tracking-widest opacity-30 italic text-[#1A1916]">
        Compass © 2026 // compass-ashen.vercel.app
      </footer>
    </div>
  );
}
