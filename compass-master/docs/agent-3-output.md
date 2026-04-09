# Agent 3 - Database Output

## Completion Status: DONE

### Tables Created

1. **profiles** - User profile information
   - id (UUID, PK, references auth.users)
   - name (TEXT)
   - age (INTEGER, CHECK 18-26)
   - status (TEXT, CHECK values)
   - created_at (TIMESTAMP)

2. **test_sessions** - Test attempt tracking
   - id (UUID, PK)
   - user_id (UUID, FK)
   - started_at, completed_at (TIMESTAMP)
   - total_questions (INTEGER)
   - status (TEXT, CHECK values)
   - confidence_map (JSONB)

3. **questions_log** - Question history
   - id (UUID, PK)
   - session_id, user_id (UUID, FK)
   - question_text (TEXT)
   - options, dimension_tags (JSONB)
   - answer_chosen (TEXT)
   - sequence_number (INTEGER)
   - predictive_weight (FLOAT)
   - created_at (TIMESTAMP)

4. **psychometric_scores** - Final scores
   - id (UUID, PK)
   - user_id, session_id (UUID, FK)
   - iq_score, aq_score, eq_score, sq_score (INTEGER, CHECK 0-100)
   - ocean_profile (JSONB)
   - compass_score (INTEGER, CHECK 0-100)
   - interpretations (JSONB)
   - created_at (TIMESTAMP)

5. **path_recommendations** - AI career paths
   - id (UUID, PK)
   - user_id, session_id (UUID, FK)
   - path_1, path_2 (JSONB)
   - chosen_path (INTEGER, CHECK 1-2)
   - created_at (TIMESTAMP)

6. **guidance_chats** - Chat conversations
   - id (UUID, PK)
   - user_id (UUID, FK)
   - path_recommendation_id (UUID, FK)
   - messages (JSONB)
   - created_at, updated_at (TIMESTAMP)

7. **question_performance** - ML tracking
   - id (UUID, PK)
   - question_hash (TEXT, UNIQUE)
   - question_text (TEXT)
   - dimension_tags (JSONB)
   - times_asked (INTEGER)
   - predictive_score (FLOAT)
   - last_updated (TIMESTAMP)

8. **learning_log** - System learning
   - id (UUID, PK)
   - session_count (INTEGER)
   - insights (JSONB)
   - strategy_update (TEXT)
   - created_at (TIMESTAMP)

### Indexes Created
- idx_profiles_status
- idx_test_sessions_user_id, idx_test_sessions_status
- idx_questions_log_session_id, idx_questions_log_user_id
- idx_psychometric_scores_user_id, idx_psychometric_scores_session_id
- idx_path_recommendations_user_id, idx_path_recommendations_session_id
- idx_guidance_chats_user_id, idx_guidance_chats_path_id
- idx_question_performance_hash, idx_question_performance_score
- idx_learning_log_session_count, idx_learning_log_created_at

### RLS Policies Enabled
- All 8 tables have RLS enabled
- Users can only read/write their own data (where user_id matches auth.uid())
- System tables (question_performance, learning_log) accessible to all authenticated users
- Complete CRUD policies for user-owned tables

### Client Utilities Created
- `/c/Users/mihir/compass/src/lib/supabase/client.ts` - Browser client
- `/c/Users/mihir/compass/src/lib/supabase/server.ts` - Server client
- `/c/Users/mihir/compass/src/lib/supabase/middleware.ts` - Session middleware
- `/c/Users/mihir/compass/src/lib/supabase/schema.sql` - Complete SQL schema

### Type Definitions Created
- `/c/Users/mihir/compass/src/lib/types/index.ts` - Full TypeScript types

### Environment File
- `/c/Users/mihir/compass/.env.local` - Environment variables

## Setup Instructions

1. Open Supabase SQL Editor
2. Copy contents of `/c/Users/mihir/compass/src/lib/supabase/schema.sql`
3. Run the SQL to create all tables, indexes, policies, and functions
4. Verify RLS is enabled on all tables in the Table Editor
5. Verify environment variables in `.env.local`

## Verification Checklist
- [x] All 8 tables defined
- [x] All indexes created
- [x] All constraints defined
- [x] All RLS policies enabled
- [x] Client utilities ready
- [x] Type definitions complete
- [x] Seed data included
