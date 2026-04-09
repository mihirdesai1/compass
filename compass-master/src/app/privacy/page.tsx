import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/login" className="text-blue-600 hover:underline text-sm mb-8 inline-block">
          &larr; back
        </Link>

        <h1 className="font-serif text-4xl mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">What we collect</h2>
            <p>When you use Compass, we collect the following information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your Google account email address (used only to identify your account)</li>
              <li>Your first name, age, and current status (studying / graduated / dropped out / working)</li>
              <li>Your responses to psychometric questions during the test</li>
              <li>The career paths you explore and any chat messages you send on the path pages</li>
              <li>Computed psychometric scores (IQ, AQ, EQ, SQ, OCEAN) derived from your answers</li>
            </ul>
            <p className="mt-3">We do not collect payment information, phone numbers, location data, or any other personal information beyond what is listed above.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">How we use your data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate personalised career path recommendations based on your psychometric profile</li>
              <li>To power the guidance chat on your path pages</li>
              <li>To show you your history of test results</li>
              <li>To improve the quality of questions over time (in aggregate, anonymised form)</li>
            </ul>
            <p className="mt-3">We do not use your data for advertising, profiling for third parties, or any purpose beyond improving your experience on Compass.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">We never sell your data</h2>
            <p>We do not sell, rent, license, or trade your personal data to any third party, ever. This is a hard line. Compass is a product people use to figure out their future — that trust is not something we will compromise.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">We never share your data</h2>
            <p>Your individual data is not shared with any third parties. The only exceptions are:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Supabase</strong> — our database provider, where your data is stored securely. Supabase is SOC 2 Type II certified.</li>
              <li><strong>Google AI (Gemini)</strong> — your psychometric answers and profile are sent to generate question content and career path recommendations. This data is processed per Google's API data policies and is not used to train Google's models.</li>
              <li><strong>Google OAuth</strong> — used only to authenticate you. We receive your email and name from Google at login.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">Data storage and security</h2>
            <p>All your data is stored on Supabase's servers with row-level security enabled — meaning only you can access your own records. Data is encrypted in transit (TLS) and at rest. We do not store passwords (authentication is handled entirely by Google OAuth).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">Your rights and data deletion</h2>
            <p>You have the right to access, correct, or delete your data at any time. To request deletion of your account and all associated data, email us at <a href="mailto:mihird5554@gmail.com" className="text-blue-600 hover:underline">mihird5554@gmail.com</a> with the subject line "Data Deletion Request". We will process your request within 7 days.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">India's DPDP Act 2023</h2>
            <p>Compass complies with India's Digital Personal Data Protection Act 2023. We collect only data that is necessary for the service (data minimisation), we process it only for the stated purposes (purpose limitation), and we provide you with a clear mechanism to request deletion. If you have questions about your rights under the DPDP Act, contact us at <a href="mailto:mihird5554@gmail.com" className="text-blue-600 hover:underline">mihird5554@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">AI disclaimer</h2>
            <p>Compass uses artificial intelligence (Google Gemini) to generate psychometric questions, score your responses, and recommend career paths. These results are <strong>for guidance and self-reflection only</strong>. They are not a clinical psychological assessment, not a substitute for professional career counselling, and not a diagnostic tool. AI-generated recommendations can be incomplete, biased, or incorrect. Always verify important career decisions through independent research and, if needed, qualified professionals.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-black">Contact</h2>
            <p>For any privacy-related questions, email <a href="mailto:mihird5554@gmail.com" className="text-blue-600 hover:underline">mihird5554@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
