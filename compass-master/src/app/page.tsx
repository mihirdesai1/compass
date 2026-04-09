'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-[#F8F7F4] min-h-screen text-[#1A1916] font-sans selection:bg-blue-200 relative overflow-hidden">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <main className="max-w-6xl mx-auto px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          
          <div className="flex-1">
            <h1 className="text-7xl font-serif italic tracking-tighter leading-[0.9] mb-12">
              Most career counselors <br />
              <span className="text-blue-600">are lying to you.</span>
            </h1>
            
            <div className="max-w-md space-y-6 text-lg leading-relaxed opacity-90">
              <p>
                The 2026 market doesn't care about your "passion." It cares about your 
                <strong> leverage</strong>. Most degrees are a liability; most advice is 
                outdated before it's even spoken.
              </p>
              <p className="text-sm border-l-2 border-[#1A1916] pl-4 italic">
                Compass is a cold, psychometric audit. We don't tell you what you want to hear. 
                We tell you where the math says you'll actually survive.
              </p>
            </div>

            <div className="mt-12 flex gap-6 items-center">
              <Link href="/test" className="bg-[#1A1916] text-[#F8F7F4] px-10 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-blue-600 transition-colors">
                Begin The Audit
              </Link>
              <span className="text-[10px] uppercase tracking-widest opacity-40">
                Requires 12 minutes <br /> of total honesty.
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 p-8 border border-[#1A1916]/10 bg-white/50 backdrop-blur-sm text-[#1A1916]">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 opacity-40">The 2026 Engine Logic</p>
            <ul className="space-y-8">
              <li>
                <p className="text-xs font-bold mb-1">01 / IQ Standardized</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">We map raw cognitive scores to a 70-145 scale. Passion is irrelevant if you lack the processing power for the sector.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">02 / Burnout Shield</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">High Neuroticism + High Stress = Failure. We filter roles based on your biological resilience threshold.</p>
              </li>
              <li>
                <p className="text-xs font-bold mb-1">03 / The Entry Hack</p>
                <p className="text-[11px] leading-relaxed opacity-60 text-justify">We skip the HR portals. Every recommendation includes a specific, cynical move to bypass the gatekeepers.</p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-8 left-8 text-[10px] uppercase tracking-widest opacity-30 italic text-[#1A1916]">
        Compass Engine © 2026 // Strictly Objective.
      </footer>
    </div>
  );
}
