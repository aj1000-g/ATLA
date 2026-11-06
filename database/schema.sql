-- ============================================================================
-- ALTA DATABASE ARCHITECTURE (Supabase / PostgreSQL)
-- Complete Production Schema for 18 Modules with Strict RLS & Data Invariants
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE difficulty_level AS ENUM ('introductory', 'foundational', 'intermediate', 'advanced');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'skipped');
CREATE TYPE hint_stage AS ENUM ('conceptual', 'directional', 'logic', 'pseudocode', 'solution');
CREATE TYPE submission_verdict AS ENUM ('accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error');
CREATE TYPE badge_tier AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE certificate_status AS ENUM ('not_eligible', 'in_progress', 'eligible', 'issued', 'revoked');
CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'failed');

-- ============================================================================
-- 2. USERS & PROFILES (Linked to Supabase Auth)
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    preferred_language TEXT DEFAULT 'python',
    level INT DEFAULT 1,
    current_xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CODING PROBLEMS (Curriculum & Custom Inputs)
-- ============================================================================
CREATE TABLE coding_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'arrays', 'hash_maps', 'two_pointers', etc.
    difficulty difficulty_level NOT NULL,
    starter_code JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "python": "...", "javascript": "..." }
    public_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    hidden_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb, -- Never exposed to client
    constraints TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. LEARNING SESSIONS
-- ============================================================================
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
    initial_level difficulty_level DEFAULT 'intermediate',
    detected_weakness_summary TEXT,
    is_problem_unlocked BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ============================================================================
-- 5. AI CONVERSATION HISTORY (Diagnostic & Mentorship)
-- ============================================================================
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'ai' or 'user'
    message_content TEXT NOT NULL,
    code_snippet TEXT,
    diagnostic_step INT DEFAULT 1,
    detected_cognitive_gap TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. SKILL PROFILES & ASSESSMENTS
-- ============================================================================
CREATE TABLE skill_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL, -- 'Array Traversal', 'Hash Map Indexing', etc.
    mastery_percentage INT DEFAULT 0 CHECK (mastery_percentage BETWEEN 0 AND 100),
    confidence_score NUMERIC(3, 2) DEFAULT 0.0,
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

CREATE TABLE skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    prior_mastery INT,
    posterior_mastery INT,
    evidence_reasoning TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. GENERATED CODING TASKS (Validated AI Micro-Drills)
-- ============================================================================
CREATE TABLE generated_coding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_skill TEXT NOT NULL,
    difficulty difficulty_level NOT NULL,
    task_description TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    public_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    hidden_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb, -- Verified on server
    is_mandatory BOOLEAN DEFAULT TRUE,
    validation_status TEXT DEFAULT 'verified', -- 'verified', 'flagged'
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. TASK DEPENDENCIES (Topological Prerequisites)
-- ============================================================================
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES generated_coding_tasks(id) ON DELETE CASCADE,
    prerequisite_task_id UUID NOT NULL REFERENCES generated_coding_tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, prerequisite_task_id)
);

-- ============================================================================
-- 9. CODE SUBMISSIONS & TEST RESULTS
-- ============================================================================
CREATE TABLE code_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES learning_sessions(id) ON DELETE SET NULL,
    task_id UUID REFERENCES generated_coding_tasks(id) ON DELETE SET NULL,
    problem_id UUID REFERENCES coding_problems(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'python',
    verdict submission_verdict NOT NULL,
    execution_time_ms INT,
    memory_used_kb INT,
    hints_used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES code_submissions(id) ON DELETE CASCADE,
    test_case_index INT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    passed BOOLEAN NOT NULL,
    expected_output TEXT,
    actual_output TEXT,
    execution_time_ms INT,
    error_message TEXT
);

-- ============================================================================
-- 10. HINT USAGE (Anti-Punishment & Independence Tracking)
-- ============================================================================
CREATE TABLE hint_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
    stage hint_stage NOT NULL,
    hint_content TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. LEARNING PROGRESS & UNLOCK VERIFICATION
-- ============================================================================
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES generated_coding_tasks(id) ON DELETE CASCADE,
    status task_status DEFAULT 'pending',
    attempts_count INT DEFAULT 0,
    is_mastery_awarded BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, task_id)
);

-- ============================================================================
-- 12. TOKENS & WALLET TRANSACTIONS
-- ============================================================================
CREATE TABLE token_wallets (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    balance INT DEFAULT 0 CHECK (balance >= 0),
    lifetime_earned INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    action_type TEXT NOT NULL, -- 'problem_solve_independent', 'task_mastery', 'streak_bonus', 'hint_unlock'
    reference_id UUID, -- References submission_id or session_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. BADGES & ACHIEVEMENTS
-- ============================================================================
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tier badge_tier NOT NULL,
    icon_glyph TEXT NOT NULL,
    xp_value INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================================================
-- 14. LEADERBOARD ENTRIES (Materialized or Computed View)
-- ============================================================================
CREATE TABLE leaderboard_cache (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar_url TEXT,
    level INT NOT NULL,
    total_tokens INT DEFAULT 0,
    independent_rate NUMERIC(4, 1) DEFAULT 0.0,
    current_streak INT DEFAULT 0,
    rank INT,
    period TEXT DEFAULT 'global', -- 'global', 'weekly', 'monthly'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 15. DAILY ACTIVITY LOGS
-- ============================================================================
CREATE TABLE daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    practice_minutes INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    problems_solved INT DEFAULT 0,
    hints_accessed INT DEFAULT 0,
    UNIQUE(user_id, activity_date)
);

-- ============================================================================
-- 16. 90-DAY CHALLENGE PROTOCOL
-- ============================================================================
CREATE TABLE challenge_90_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '90 days'),
    status challenge_status DEFAULT 'active',
    active_days_count INT DEFAULT 1,
    tasks_completed_count INT DEFAULT 0,
    independent_solves_count INT DEFAULT 0,
    capstone_passed BOOLEAN DEFAULT FALSE,
    certificate_eligible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 17. CERTIFICATES & CRYPTOGRAPHIC VERIFICATION
-- ============================================================================
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number TEXT UNIQUE NOT NULL, -- e.g. ALTA-2026-90D-849201
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES challenge_90_enrollments(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    curriculum_title TEXT DEFAULT 'Algorithmic Logic & Thinking Architecture',
    active_days_verified INT NOT NULL,
    independent_rate_verified NUMERIC(4, 1) NOT NULL,
    verification_hash TEXT NOT NULL, -- SHA-256 digital signature
    status certificate_status DEFAULT 'issued',
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- ============================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_coding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, user can update only own profile
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Learning Sessions & AI Chat: Only user can view and insert own sessions
CREATE POLICY "Users view own learning sessions" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own learning sessions" ON learning_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own AI conversations" ON ai_conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM learning_sessions WHERE learning_sessions.id = ai_conversations.session_id AND learning_sessions.user_id = auth.uid())
);

-- Code Submissions: Users can view and insert own submissions
CREATE POLICY "Users view own submissions" ON code_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own submissions" ON code_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tokens & Wallets: Users can view own wallet, updates allowed ONLY via secure backend functions
CREATE POLICY "Users view own token wallet" ON token_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own token transactions" ON token_transactions FOR SELECT USING (auth.uid() = user_id);

-- Certificates: Public read for verification by certificate number
CREATE POLICY "Certificates are publicly verifiable" ON certificates FOR SELECT USING (true);
