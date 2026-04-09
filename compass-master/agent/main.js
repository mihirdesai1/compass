/**
 * Compass Autonomous Agent
 * Runs 3 loops forever: stress testing, health checks, growth reports.
 * Designed to deploy on Railway as a Node.js worker.
 */

const APP_URL = process.env.APP_URL || 'https://compass-ashen.vercel.app';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Profiles ---

const PROFILES = {
  Analytical: {
    bias: { iq: 0.8, aq: 0.4, eq: 0.2, sq: 0.2, openness: 0.3, conscientiousness: 0.6, extraversion: 0.2, agreeableness: 0.3, neuroticism: 0.4 },
  },
  Creative: {
    bias: { iq: 0.4, aq: 0.8, eq: 0.5, sq: 0.3, openness: 0.9, conscientiousness: 0.2, extraversion: 0.5, agreeableness: 0.4, neuroticism: 0.5 },
  },
  Social: {
    bias: { iq: 0.3, aq: 0.4, eq: 0.8, sq: 0.8, openness: 0.5, conscientiousness: 0.4, extraversion: 0.8, agreeableness: 0.7, neuroticism: 0.3 },
  },
  Structured: {
    bias: { iq: 0.5, aq: 0.2, eq: 0.4, sq: 0.5, openness: 0.2, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.5, neuroticism: 0.3 },
  },
  Balanced: {
    bias: { iq: 0.5, aq: 0.5, eq: 0.5, sq: 0.5, openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5 },
  },
  Lost: {
    bias: { iq: 0.2, aq: 0.2, eq: 0.2, sq: 0.2, openness: 0.3, conscientiousness: 0.2, extraversion: 0.3, agreeableness: 0.3, neuroticism: 0.7 },
  },
};

const PROFILE_NAMES = Object.keys(PROFILES);

const SITUATIONS = [
  "Your JEE results just came out and they're below expectations.",
  "Your group project deadline is tomorrow and nobody has started.",
  "Your parents want you to take engineering but you want design.",
  "Your senior at your internship is clearly wrong about something.",
  "Your friend group wants to do something you disagree with.",
  "You've spent 3 months on a course that feels completely wrong.",
  "You got a safe job offer but have a risky passion project.",
  "You need to move to Mumbai alone for a great opportunity.",
  "You failed publicly at something you cared about.",
  "Your creative idea got rejected by your entire family.",
  "Your family depends on you financially and you're stressed.",
  "Social media shows all your peers succeeding while you struggle.",
  "A classmate is cheating and wants you to help them.",
  "You got into a college you didn't want but your parents are happy.",
  "Your best friend got the opportunity you wanted.",
  "You're asked to lead a team but you've never managed anyone.",
  "Your startup idea failed after 6 months of work.",
  "A recruiter offers you a job that pays well but sounds boring.",
  "You discover your dream company has toxic work culture.",
  "You have to choose between studying abroad and staying for family.",
];

const OPTIONS = [
  { id: 'a', text: 'Analyze the situation logically and make a plan', dimension_signals: { iq: 1, aq: 0, eq: 0, sq: 0, conscientiousness: 1 } },
  { id: 'b', text: 'Talk to people around you and get different perspectives', dimension_signals: { iq: 0, aq: 0, eq: 1, sq: 1, extraversion: 1, agreeableness: 1 } },
  { id: 'c', text: 'Try something completely different and unconventional', dimension_signals: { iq: 0, aq: 1, eq: 0, sq: 0, openness: 1 } },
  { id: 'd', text: 'Follow the established path and stay disciplined', dimension_signals: { iq: 0, aq: -1, eq: 0, sq: 0, conscientiousness: 1, openness: -1 } },
];

const STATUSES = ['student', 'graduate', 'working', 'gap_year', 'dropout'];

// --- Helpers ---

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  console.log(`[${ts}] ${msg}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function scoreOption(option, bias) {
  const signals = option.dimension_signals || {};
  const keys = Object.keys(signals);
  if (keys.length === 0) return Math.random();

  let total = 0;
  let count = 0;
  for (const dim of keys) {
    if (dim in bias) {
      const val = signals[dim];
      if (val === 1) total += bias[dim];
      else if (val === -1) total += (1.0 - bias[dim]);
      else total += 0.5;
      count++;
    }
  }
  if (count === 0) return Math.random();
  return (total / count) + (Math.random() * 0.3 - 0.15);
}

function pickOption(options, bias) {
  let best = options[0];
  let bestScore = -Infinity;
  for (const opt of options) {
    const s = scoreOption(opt, bias);
    if (s > bestScore) { bestScore = s; best = opt; }
  }
  return best;
}

async function supabasePost(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data: Array.isArray(data) ? data[0] : data };
}

async function supabasePatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return { status: res.status };
}

async function supabaseGet(path, extraHeaders = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      ...extraHeaders,
    },
  });
  const contentRange = res.headers.get('content-range') || '0/0';
  const data = await res.json();
  return { status: res.status, data, contentRange };
}

// --- Loop 1: Stress Test ---

async function runStressTest() {
  const profileName = pick(PROFILE_NAMES);
  const bias = PROFILES[profileName].bias;

  log(`STRESS TEST: Starting — Profile: ${profileName}`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log('STRESS TEST: SKIP — SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    return;
  }

  try {
    // Generate a synthetic user_id (not a real auth user — service role bypasses RLS)
    const syntheticUserId = uuid();
    const syntheticName = `Synthetic_${profileName}_${randInt(1000, 9999)}`;

    // Insert profile directly via Supabase REST with service role key
    const profileRes = await supabasePost('profiles', {
      id: syntheticUserId,
      user_id: syntheticUserId,
      name: syntheticName,
      age: randInt(18, 26),
      status: pick(STATUSES),
      education: 'synthetic',
      city: 'Mumbai',
    });

    if (profileRes.status !== 200 && profileRes.status !== 201) {
      log(`STRESS TEST: Failed to create profile — ${profileRes.status} — ${JSON.stringify(profileRes.data).substring(0, 200)}`);
      return;
    }

    const profileId = profileRes.data.id || syntheticUserId;
    const userId = syntheticUserId;

    // Insert test session directly via Supabase REST
    const sessionRes = await supabasePost('test_sessions', {
      id: uuid(),
      user_id: userId,
      profile_id: profileId,
      status: 'in_progress',
      total_questions: 0,
    });

    if (sessionRes.status !== 200 && sessionRes.status !== 201) {
      log(`STRESS TEST: Failed to create session — ${sessionRes.status}`);
      return;
    }

    const sessionId = sessionRes.data.id;
    const questionCount = randInt(10, 20);
    log(`STRESS TEST: Session ${sessionId.substring(0, 8)}... — answering ${questionCount} questions`);

    // Answer questions
    for (let i = 0; i < questionCount; i++) {
      const situation = SITUATIONS[i % SITUATIONS.length];
      const chosen = pickOption(OPTIONS, bias);

      await supabasePost('questions_log', {
        session_id: sessionId,
        user_id: userId,
        question_text: `You are in this situation: ${situation} What do you do?`,
        options: OPTIONS,
        answer_chosen: chosen.text,
        dimension_tags: chosen.dimension_signals,
        sequence_number: i + 1,
      });
    }

    // Complete session
    await supabasePatch(`test_sessions?id=eq.${sessionId}`, {
      total_questions: questionCount,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    // Trigger learning loop
    try {
      const learnRes = await fetch(`${APP_URL}/api/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
        signal: AbortSignal.timeout(30000),
      });
      log(`STRESS TEST: Learn triggered — ${learnRes.status}`);
    } catch (e) {
      log(`STRESS TEST: Learn trigger failed — ${e.message}`);
    }

    log(`STRESS TEST: Complete — Profile: ${profileName} — Questions: ${questionCount} — Session: ${sessionId.substring(0, 8)}...`);
  } catch (e) {
    log(`STRESS TEST: ERROR — ${e.message}`);
  }
}

// --- Loop 2: Health Check ---

async function runHealthCheck() {
  const endpoints = [
    { name: 'Homepage', url: APP_URL, method: 'GET' },
    { name: 'Test Start', url: `${APP_URL}/api/test/start`, method: 'POST' },
  ];

  for (const ep of endpoints) {
    try {
      const res = ep.method === 'GET'
        ? await fetch(ep.url, { signal: AbortSignal.timeout(15000) })
        : await fetch(ep.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
            signal: AbortSignal.timeout(15000),
          });

      if (res.status < 500) {
        log(`HEALTH: ${ep.name} — ${res.status} OK`);
      } else {
        const text = await res.text();
        log(`HEALTH: ALERT — ${ep.name} — ${res.status} — ${text.substring(0, 100)}`);
      }
    } catch (e) {
      log(`HEALTH: ALERT — ${ep.name} — UNREACHABLE — ${e.message}`);
    }
  }
}

// --- Loop 3: Growth Report ---

async function runGrowthReport() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log('GROWTH: SKIP — no Supabase credentials');
    return;
  }

  try {
    const profilesRes = await supabaseGet('profiles?select=id', { 'Prefer': 'count=exact', 'Range': '0-0' });
    const totalProfiles = profilesRes.contentRange.split('/').pop();

    const sessionsRes = await supabaseGet('test_sessions?status=eq.completed&select=id', { 'Prefer': 'count=exact', 'Range': '0-0' });
    const totalSessions = sessionsRes.contentRange.split('/').pop();

    const scoresRes = await supabaseGet('psychometric_scores?select=compass_score', { 'Range': '0-999' });
    const scoresData = Array.isArray(scoresRes.data) ? scoresRes.data : [];
    const compassScores = scoresData.filter(s => s.compass_score).map(s => s.compass_score);
    const avgScore = compassScores.length > 0
      ? (compassScores.reduce((a, b) => a + b, 0) / compassScores.length).toFixed(1)
      : '0.0';

    log('==================================================');
    log('GROWTH REPORT');
    log(`  Total profiles:          ${totalProfiles}`);
    log(`  Completed sessions:      ${totalSessions}`);
    log(`  Average compass score:   ${avgScore}`);
    log(`  Scores recorded:         ${scoresData.length}`);
    log('==================================================');
  } catch (e) {
    log(`GROWTH: ERROR — ${e.message}`);
  }
}

// --- Main ---

async function loopForever(name, fn, intervalMs) {
  while (true) {
    try {
      await fn();
    } catch (e) {
      log(`${name} LOOP ERROR: ${e.message}`);
    }
    await sleep(intervalMs);
  }
}

async function main() {
  log('==================================================');
  log('COMPASS AUTONOMOUS AGENT STARTING (Node.js)');
  log(`  APP_URL:      ${APP_URL}`);
  log(`  SUPABASE_URL: ${SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET'}`);
  log(`  SERVICE_KEY:  ${SUPABASE_KEY ? 'SET' : 'NOT SET'}`);
  log('==================================================');

  // Initial health check
  await runHealthCheck();

  // Start all loops concurrently
  log('All loops started. Running forever...');
  Promise.all([
    loopForever('STRESS', runStressTest, 120000),    // 2 minutes
    loopForever('HEALTH', runHealthCheck, 300000),    // 5 minutes
    loopForever('GROWTH', runGrowthReport, 86400000), // 24 hours
  ]);
}

main().catch(e => {
  log(`FATAL: ${e.message}`);
  process.exit(1);
});
