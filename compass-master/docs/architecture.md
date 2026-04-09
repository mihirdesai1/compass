# Compass Technical Architecture

## 1. File and Folder Structure

```
/c/Users/mihir/compass/
├── docs/
│   ├── learning-memory.md
│   ├── architecture.md
│   ├── branding.md
│   ├── agent-3-output.md
│   ├── agent-4-output.md
│   ├── agent-5-output.md
│   ├── agent-6-output.md
│   ├── agent-7-output.md
│   ├── agent-8-output.md
│   ├── critic-log.md
│   └── growth-log.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing page
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── onboard/
│   │   │   └── page.tsx
│   │   ├── test/
│   │   │   └── page.tsx
│   │   ├── results/
│   │   │   └── page.tsx
│   │   ├── path/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── callback/
│   │       │       └── route.ts
│   │       ├── profile/
│   │       │   └── route.ts
│   │       ├── test/
│   │       │   ├── start/
│   │       │   │   └── route.ts
│   │       │   ├── next-question/
│   │       │   │   └── route.ts
│   │       │   └── complete/
│   │       │       └── route.ts
│   │       ├── paths/
│   │       │   └── recommend/
│   │       │       └── route.ts
│   │       ├── chat/
│   │       │   └── route.ts
│   │       ├── history/
│   │       │   └── route.ts
│   │       └── learn/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   └── chat-message.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── test/
│   │   │   ├── question-card.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   └── test-container.tsx
│   │   ├── results/
│   │   │   ├── score-card.tsx
│   │   │   ├── dimension-grid.tsx
│   │   │   └── path-card.tsx
│   │   └── chat/
│   │       ├── chat-interface.tsx
│   │       ├── message-list.tsx
│   │       └── chat-input.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── ai/
│   │   │   ├── ollama-client.ts       # Ollama integration
│   │   │   ├── prompts.ts             # All AI prompts
│   │   │   ├── question-generator.ts
│   │   │   ├── scorer.ts
│   │   │   ├── path-recommender.ts
│   │   │   ├── chat-engine.ts
│   │   │   └── learning-loop.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   └── types/
│   │       └── index.ts
│   └── hooks/
│       ├── use-auth.ts
│       ├── use-test.ts
│       ├── use-chat.ts
│       └── use-profile.ts
├── public/
│   └── (static assets)
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 2. Database Schema (Supabase)

### Table: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 26),
  status TEXT NOT NULL CHECK (status IN ('studying', 'graduated', 'dropped', 'working')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_status ON profiles(status);
```

### Table: test_sessions
```sql
CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  confidence_map JSONB DEFAULT '{"iq": 0, "aq": 0, "eq": 0, "sq": 0, "ocean": 0}'::jsonb,
  
  CONSTRAINT valid_confidence CHECK (
    (confidence_map->>'iq')::float BETWEEN 0 AND 1 AND
    (confidence_map->>'aq')::float BETWEEN 0 AND 1 AND
    (confidence_map->>'eq')::float BETWEEN 0 AND 1 AND
    (confidence_map->>'sq')::float BETWEEN 0 AND 1 AND
    (confidence_map->>'ocean')::float BETWEEN 0 AND 1
  )
);

CREATE INDEX idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX idx_test_sessions_status ON test_sessions(status);
```

### Table: questions_log
```sql
CREATE TABLE questions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  answer_chosen TEXT,
  dimension_tags JSONB NOT NULL,
  sequence_number INTEGER NOT NULL,
  predictive_weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questions_log_session_id ON questions_log(session_id);
CREATE INDEX idx_questions_log_user_id ON questions_log(user_id);
```

### Table: psychometric_scores
```sql
CREATE TABLE psychometric_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  iq_score INTEGER NOT NULL CHECK (iq_score BETWEEN 0 AND 100),
  aq_score INTEGER NOT NULL CHECK (aq_score BETWEEN 0 AND 100),
  eq_score INTEGER NOT NULL CHECK (eq_score BETWEEN 0 AND 100),
  sq_score INTEGER NOT NULL CHECK (sq_score BETWEEN 0 AND 100),
  ocean_profile JSONB NOT NULL,
  compass_score INTEGER NOT NULL CHECK (compass_score BETWEEN 0 AND 100),
  interpretations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id)
);

CREATE INDEX idx_psychometric_scores_user_id ON psychometric_scores(user_id);
```

### Table: path_recommendations
```sql
CREATE TABLE path_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  path_1 JSONB NOT NULL,
  path_2 JSONB NOT NULL,
  chosen_path INTEGER CHECK (chosen_path IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id)
);

CREATE INDEX idx_path_recommendations_user_id ON path_recommendations(user_id);
```

### Table: guidance_chats
```sql
CREATE TABLE guidance_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  path_recommendation_id UUID NOT NULL REFERENCES path_recommendations(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guidance_chats_user_id ON guidance_chats(user_id);
CREATE INDEX idx_guidance_chats_path_id ON guidance_chats(path_recommendation_id);
```

### Table: question_performance
```sql
CREATE TABLE question_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash TEXT UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  dimension_tags JSONB NOT NULL,
  times_asked INTEGER DEFAULT 0,
  predictive_score FLOAT DEFAULT 1.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_question_performance_hash ON question_performance(question_hash);
CREATE INDEX idx_question_performance_score ON question_performance(predictive_score);
```

### Table: learning_log
```sql
CREATE TABLE learning_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_count INTEGER NOT NULL,
  insights JSONB NOT NULL,
  strategy_update TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_learning_log_session_count ON learning_log(session_count);
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_log ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own test sessions" ON test_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test sessions" ON test_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test sessions" ON test_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- (Similar policies for all other tables)
```

## 3. API Endpoints

### Authentication
**Google SSO via Supabase Auth**

```typescript
// Route: /api/auth/callback
// Method: GET
// Description: Handle OAuth callback from Supabase

// First login flow: redirect to /onboard
// Returning login flow: redirect to /dashboard
```

### Profile API
```typescript
// Route: /api/profile
// Method: POST
// Input: {
//   name: string,
//   age: number (18-26),
//   status: 'studying' | 'graduated' | 'dropped' | 'working'
// }
// Output: { success: true, profile: Profile }
// Error: 400 (validation), 401 (unauthorized), 409 (already exists)

// Route: /api/profile
// Method: GET
// Output: { profile: Profile }
// Error: 401 (unauthorized), 404 (not found)
```

### Test API
```typescript
// Route: /api/test/start
// Method: POST
// Output: { session_id: string, status: 'in_progress' }
// Error: 401 (unauthorized)

// Route: /api/test/next-question
// Method: POST
// Input: {
//   session_id: string,
//   previous_answers: Array<{question_id, answer, dimension_signals}>
// }
// Output: {
//   action: 'question',
//   question: {
//     id: string,
//     text: string,
//     options: Array<{id, text, dimension_signals}>
//   },
//   dimension_focus: string,
//   confidence_after: {iq, aq, eq, sq, ocean}
// }
// OR Output: {
//   action: 'complete',
//   message: 'Test complete'
// }
// Error: 400 (invalid session), 401 (unauthorized)

// Route: /api/test/complete
// Method: POST
// Input: { session_id: string }
// Output: {
//   scores: {
//     iq: {score, interpretation},
//     aq: {score, interpretation},
//     eq: {score, interpretation},
//     sq: {score, interpretation},
//     ocean: {openness, conscientiousness, extraversion, agreeableness, neuroticism, interpretation},
//     compass_score: number
//   }
// }
// Error: 400 (test incomplete), 401 (unauthorized)
```

### Paths API
```typescript
// Route: /api/paths/recommend
// Method: POST
// Input: { session_id: string }
// Output: {
//   path_1: {
//     name: string,
//     tagline: string,
//     why_it_fits: string,
//     next_30_days: string[],
//     skills_to_build: string[],
//     resources: Array<{name, url, type}>,
//     honest_warning: string
//   },
//   path_2: { ... }
// }
// Error: 400 (no scores), 401 (unauthorized)
```

### Chat API
```typescript
// Route: /api/chat
// Method: POST
// Headers: { 'Content-Type': 'application/json' }
// Input: {
//   path_id: string,
//   message: string,
//   conversation_history: Array<{role, content}>
// }
// Output: Streaming text (SSE)
// Error: 400 (invalid path), 401 (unauthorized)
```

### History API
```typescript
// Route: /api/history
// Method: GET
// Output: {
//   sessions: Array<{
//     session_id: string,
//     date: string,
//     compass_score: number,
//     strongest_dimension: string,
//     paths: Array<{name, tagline}>
//   }>
// }
// Error: 401 (unauthorized)
```

### Learning API
```typescript
// Route: /api/learn
// Method: POST
// Input: { session_id: string }
// Output: {
//   question_updates: Array<{question_hash, new_predictive_weight, reasoning}>,
//   questions_to_retire: string[],
//   new_questions_to_add: Array<{text, options, dimension_tags, rationale}>,
//   strategy_insight: string
// }
// Error: 401 (unauthorized)
// Note: Called asynchronously after test completion
```

## 4. Build Order

| Agent | Task | Dependencies | Input Files | Output Files |
|-------|------|--------------|-------------|--------------|
| 1 | Architect | None | requirements | architecture.md |
| 2 | Branding | 1 | architecture.md | branding.md |
| 3 | Database | 1 | architecture.md | agent-3-output.md |
| 4 | Backend | 1, 3 | architecture.md, agent-3-output.md | agent-4-output.md |
| 5 | Frontend | 1, 2, 4 | architecture.md, branding.md, agent-4-output.md | agent-5-output.md |
| 6 | AI Engine | 1, 3, 4 | architecture.md, agent-3-output.md, agent-4-output.md | agent-6-output.md |
| 7 | QA | 1-6 | all above | agent-7-output.md |
| 8 | DevOps | 1-7 | all above | agent-8-output.md (with live URL) |
| 9 | Marketing | 1, 2, 8 | branding.md | marketing.md |
| 10 | Growth | 1-9 | all above | continuous updates |

## 5. Agent Communication Protocol

### File Format
- All agent outputs saved as Markdown (.md)
- Code outputs saved to specified source directories
- Confirmation outputs saved to /c/Users/mihir/compass/docs/agent-{N}-output.md

### Naming Conventions
- Files: kebab-case.md
- Database tables: snake_case
- API routes: kebab-case
- Components: PascalCase.tsx
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Versioning
- No version numbers needed (greenfield project)
- Git commits after each approved agent
- Each agent appends to learning-memory.md

### Status Indicators
Each agent-*.md file must include:
```markdown
## Completion Checklist
- [ ] All tables created
- [ ] All routes implemented
- [ ] All tests passing
- [ ] RLS enabled
- [ ] No errors in console
```

## 6. Risk Log

| Risk | Probability | Impact | Prevention | Fallback |
|------|------------|--------|------------|----------|
| Ollama not running locally | Medium | High | Document requirement, add health check | Show error message asking user to start Ollama |
| Supabase connection fails | Low | High | Use connection pooling, retry logic | Local SQLite fallback with sync later |
| Test completion rate < 70% | Medium | Medium | Agent 10 monitoring, Agent 2 clear copy | Reduce questions to 10 minimum |
| Path recommendations too generic | Medium | High | Strong AI prompts, real Indian resources | Manual curated paths as fallback |
| Chat streaming fails | Low | Medium | SSE with fallback to polling | Regular HTTP response without streaming |
| Mobile layout breaks | Medium | Medium | Mobile-first CSS, thorough QA | Simplified mobile view |

## 7. AI Integration (Ollama)

All AI calls route through local Ollama at `http://localhost:11434`

### Model Configuration
```typescript
const OLLAMA_CONFIG = {
  baseUrl: 'http://localhost:11434',
  model: 'qwen2.5-coder:14b',
  temperature: 0.7,
  maxTokens: 2048
};
```

### Endpoints Used
- `POST /api/generate` - Single response generation
- `POST /api/chat` - Conversational responses

### Error Handling
- Check Ollama health at app startup
- Graceful degradation if Ollama unavailable
- Retry logic with exponential backoff

## 8. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 (App Router) | React framework |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | Custom | Matching brand |
| Fonts | Google Fonts (DM Sans, Fraunces) | Typography |
| Backend | Next.js API Routes | Server endpoints |
| Database | Supabase (PostgreSQL) | Data persistence |
| Auth | Supabase Auth (Google OAuth) | User authentication |
| AI | Ollama (local) | AI generation |
| Model | qwen2.5-coder:14b | Question/scoring/chat |
| Hosting | Vercel | Deployment |
