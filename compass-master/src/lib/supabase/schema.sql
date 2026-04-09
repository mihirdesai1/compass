-- Compass Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- ============================================
-- Table: profiles
-- User profile information linked to auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 26),
  status TEXT NOT NULL CHECK (status IN ('studying', 'graduated', 'dropped', 'working')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- ============================================
-- Table: test_sessions
-- Tracks each test attempt by a user
-- ============================================
CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  confidence_map JSONB DEFAULT '{"iq": 0, "aq": 0, "eq": 0, "sq": 0, "ocean": 0}'::jsonb,

  CONSTRAINT valid_confidence CHECK (
    (COALESCE((confidence_map->>'iq')::float, 0)) BETWEEN 0 AND 1 AND
    (COALESCE((confidence_map->>'aq')::float, 0)) BETWEEN 0 AND 1 AND
    (COALESCE((confidence_map->>'eq')::float, 0)) BETWEEN 0 AND 1 AND
    (COALESCE((confidence_map->>'sq')::float, 0)) BETWEEN 0 AND 1 AND
    (COALESCE((confidence_map->>'ocean')::float, 0)) BETWEEN 0 AND 1
  )
);

CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);

-- ============================================
-- Table: questions_log
-- Logs every question asked during a test session
-- ============================================
CREATE TABLE IF NOT EXISTS questions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer_chosen TEXT,
  dimension_tags JSONB NOT NULL DEFAULT '{}'::jsonb,
  sequence_number INTEGER NOT NULL,
  predictive_weight FLOAT DEFAULT 1.0 CHECK (predictive_weight > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_log_session_id ON questions_log(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_log_user_id ON questions_log(user_id);

-- ============================================
-- Table: psychometric_scores
-- Stores final scores after test completion
-- ============================================
CREATE TABLE IF NOT EXISTS psychometric_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  iq_score INTEGER NOT NULL CHECK (iq_score BETWEEN 0 AND 100),
  aq_score INTEGER NOT NULL CHECK (aq_score BETWEEN 0 AND 100),
  eq_score INTEGER NOT NULL CHECK (eq_score BETWEEN 0 AND 100),
  sq_score INTEGER NOT NULL CHECK (sq_score BETWEEN 0 AND 100),
  ocean_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  compass_score INTEGER NOT NULL CHECK (compass_score BETWEEN 0 AND 100),
  interpretations JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(session_id)
);

CREATE INDEX IF NOT EXISTS idx_psychometric_scores_user_id ON psychometric_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_psychometric_scores_session_id ON psychometric_scores(session_id);

-- ============================================
-- Table: path_recommendations
-- AI-generated career path recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS path_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  path_1 JSONB NOT NULL DEFAULT '{}'::jsonb,
  path_2 JSONB NOT NULL DEFAULT '{}'::jsonb,
  chosen_path INTEGER CHECK (chosen_path IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(session_id)
);

CREATE INDEX IF NOT EXISTS idx_path_recommendations_user_id ON path_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_path_recommendations_session_id ON path_recommendations(session_id);

-- ============================================
-- Table: guidance_chats
-- Chat conversations for each path
-- ============================================
CREATE TABLE IF NOT EXISTS guidance_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  path_recommendation_id UUID NOT NULL REFERENCES path_recommendations(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guidance_chats_user_id ON guidance_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_guidance_chats_path_id ON guidance_chats(path_recommendation_id);

-- ============================================
-- Table: question_performance
-- Tracks question effectiveness for ML improvement
-- ============================================
CREATE TABLE IF NOT EXISTS question_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash TEXT UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  dimension_tags JSONB NOT NULL DEFAULT '{}'::jsonb,
  times_asked INTEGER DEFAULT 0 CHECK (times_asked >= 0),
  predictive_score FLOAT DEFAULT 1.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_question_performance_hash ON question_performance(question_hash);
CREATE INDEX IF NOT EXISTS idx_question_performance_score ON question_performance(predictive_score);

-- ============================================
-- Table: learning_log
-- Tracks system learning and strategy updates
-- ============================================
CREATE TABLE IF NOT EXISTS learning_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_count INTEGER NOT NULL CHECK (session_count >= 0),
  insights JSONB NOT NULL DEFAULT '{}'::jsonb,
  strategy_update TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_log_session_count ON learning_log(session_count);
CREATE INDEX IF NOT EXISTS idx_learning_log_created_at ON learning_log(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Test Sessions: Users can CRUD their own sessions
DROP POLICY IF EXISTS "Users can read own sessions" ON test_sessions;
CREATE POLICY "Users can read own sessions" ON test_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON test_sessions;
CREATE POLICY "Users can insert own sessions" ON test_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON test_sessions;
CREATE POLICY "Users can update own sessions" ON test_sessions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own sessions" ON test_sessions;
CREATE POLICY "Users can delete own sessions" ON test_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Questions Log: Users can CRUD their own logs
DROP POLICY IF EXISTS "Users can read own questions" ON questions_log;
CREATE POLICY "Users can read own questions" ON questions_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own questions" ON questions_log;
CREATE POLICY "Users can insert own questions" ON questions_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own questions" ON questions_log;
CREATE POLICY "Users can update own questions" ON questions_log
  FOR UPDATE USING (auth.uid() = user_id);

-- Psychometric Scores: Users can read their own scores
DROP POLICY IF EXISTS "Users can read own scores" ON psychometric_scores;
CREATE POLICY "Users can read own scores" ON psychometric_scores
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scores" ON psychometric_scores;
CREATE POLICY "Users can insert own scores" ON psychometric_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Path Recommendations: Users can read their own recommendations
DROP POLICY IF EXISTS "Users can read own paths" ON path_recommendations;
CREATE POLICY "Users can read own paths" ON path_recommendations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own paths" ON path_recommendations;
CREATE POLICY "Users can insert own paths" ON path_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own paths" ON path_recommendations;
CREATE POLICY "Users can update own paths" ON path_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Guidance Chats: Users can CRUD their own chats
DROP POLICY IF EXISTS "Users can read own chats" ON guidance_chats;
CREATE POLICY "Users can read own chats" ON guidance_chats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chats" ON guidance_chats;
CREATE POLICY "Users can insert own chats" ON guidance_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own chats" ON guidance_chats;
CREATE POLICY "Users can update own chats" ON guidance_chats
  FOR UPDATE USING (auth.uid() = user_id);

-- Question Performance: Read-only for all authenticated users (system table)
DROP POLICY IF EXISTS "Authenticated users can read question performance" ON question_performance;
CREATE POLICY "Authenticated users can read question performance" ON question_performance
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert question performance" ON question_performance;
CREATE POLICY "Authenticated users can insert question performance" ON question_performance
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update question performance" ON question_performance;
CREATE POLICY "Authenticated users can update question performance" ON question_performance
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Learning Log: Read-only for all authenticated users (system table)
DROP POLICY IF EXISTS "Authenticated users can read learning log" ON learning_log;
CREATE POLICY "Authenticated users can read learning log" ON learning_log
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert learning log" ON learning_log;
CREATE POLICY "Authenticated users can insert learning log" ON learning_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- Helper functions for database operations
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for guidance_chats updated_at
DROP TRIGGER IF EXISTS update_guidance_chats_updated_at ON guidance_chats;
CREATE TRIGGER update_guidance_chats_updated_at
  BEFORE UPDATE ON guidance_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update question performance last_updated
CREATE OR REPLACE FUNCTION update_question_performance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_question_performance_updated_at ON question_performance;
CREATE TRIGGER update_question_performance_updated_at
  BEFORE UPDATE ON question_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_question_performance_timestamp();

-- ============================================
-- SEED DATA
-- Initial data for the system
-- ============================================

-- Insert some starter questions for question_performance
INSERT INTO question_performance (question_hash, question_text, dimension_tags, times_asked, predictive_score)
VALUES
  ('starter_q1', 'Your friend is struggling with their studies and asks for help, but you have an important exam tomorrow. What do you do?', '{"eq": 0.4, "sq": 0.6}', 0, 1.0),
  ('starter_q2', 'You discover a more efficient way to complete a group project, but it means changing everything last minute. What do you do?', '{"iq": 0.3, "aq": 0.7}', 0, 1.0),
  ('starter_q3', 'You have some savings. A new online course could help your career, but your family needs money for an emergency. What do you do?', '{"ocean": 0.5, "aq": 0.5}', 0, 1.0)
ON CONFLICT (question_hash) DO NOTHING;
