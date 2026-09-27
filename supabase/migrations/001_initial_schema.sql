-- =============================================================================
-- POTENTIAL AS A PASSPORT: FULL PRODUCTION DATABASE SCHEMA
-- Generated in accordance with Master Technical Specification (Section 3)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'reviewer', 'mentor', 'admin')),
    avatar_url TEXT,
    education_level TEXT, -- Class 9, 10, 11, 12, B.Sc.
    track_id TEXT,
    goal TEXT,
    passport_status TEXT NOT NULL DEFAULT 'none' CHECK (passport_status IN ('none', 'temporary', 'verified')),
    workflow_state TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (
        workflow_state IN (
            'REGISTERED', 'ONBOARDING', 'CHALLENGE_ACTIVE', 'STREAK_COMPLETE',
            'PROJECT_UNLOCKED', 'PROJECT_SUBMITTED', 'AI_REJECTED',
            'TEMPORARY_PASSPORT', 'PEER_REJECTED', 'VERIFIED_PASSPORT', 'ACTIVE_LEARNING'
        )
    ),
    streak_days INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    token_balance INTEGER NOT NULL DEFAULT 0,
    bio TEXT,
    specialization TEXT,
    mentor_tier TEXT CHECK (mentor_tier IN ('Tier 2', 'Tier 3')),
    credential_status TEXT DEFAULT 'pending' CHECK (credential_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    phase TEXT NOT NULL CHECK (phase IN ('School Foundation', 'Higher Ed & Govt Exams')),
    description TEXT NOT NULL,
    is_interactive BOOLEAN NOT NULL DEFAULT FALSE,
    challenge_title TEXT NOT NULL,
    challenge_description TEXT NOT NULL,
    evidence_requirement TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 15,
    order_index INTEGER NOT NULL,
    summary TEXT NOT NULL,
    key_concepts TEXT[] NOT NULL DEFAULT '{}',
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Streaks Table
CREATE TABLE IF NOT EXISTS public.streaks (
    student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Token Ledger Table (Immutable Double-Entry Audit Trail)
CREATE TABLE IF NOT EXISTS public.token_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Positive for credits, negative for debits
    type TEXT NOT NULL CHECK (
        type IN ('daily_lesson', 'submission_bonus', 'peer_review', 'wiki_contribution', 'vault_redemption', 'strike_fine', 'starting_bonus')
    ),
    reference_type TEXT NOT NULL CHECK (
        reference_type IN ('lesson', 'submission', 'peer_review', 'wiki_edit', 'reward', 'strike')
    ),
    reference_id TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Submissions Table (Proof-of-Work Pipeline)
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL REFERENCES public.tracks(id),
    challenge_title TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- student-submissions/{student_uuid}/{submission_id}/{filename}
    evidence_filename TEXT NOT NULL,
    evidence_url TEXT NOT NULL,
    explanation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'ai_approved', 'ai_rejected', 'peer_verified', 'peer_rejected', 'flagged')
    ),
    ai_status TEXT CHECK (ai_status IN ('approved', 'rejected')),
    ai_reason TEXT CHECK (ai_reason IN ('safety', 'relevance', 'level', 'none')),
    ai_message TEXT,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewer_feedback TEXT,
    attempts_count INTEGER NOT NULL DEFAULT 1,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 8. Peer Reviews Table
CREATE TABLE IF NOT EXISTS public.peer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id TEXT NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('approve', 'reject')),
    feedback TEXT NOT NULL,
    tokens_awarded INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Wiki Topics & Edits Tables
CREATE TABLE IF NOT EXISTS public.wiki_topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    suggested_edits_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wiki_edits (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.wiki_topics(id) ON DELETE CASCADE,
    editor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    proposed_text TEXT NOT NULL,
    change_explanation TEXT NOT NULL,
    ai_status TEXT NOT NULL CHECK (ai_status IN ('approved', 'rejected')),
    ai_reason TEXT,
    ai_message TEXT,
    peer_status TEXT NOT NULL DEFAULT 'pending' CHECK (peer_status IN ('pending', 'merged', 'rejected')),
    peer_reviewer_id UUID REFERENCES public.profiles(id),
    peer_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    merged_at TIMESTAMPTZ
);

-- 10. Mentor Slots & Bookings
CREATE TABLE IF NOT EXISTS public.mentor_slots (
    id TEXT PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_tier TEXT NOT NULL CHECK (mentor_tier IN ('Tier 2', 'Tier 3')),
    title TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    booked_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rewards (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL CHECK (tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
    title TEXT NOT NULL,
    token_cost INTEGER NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ai_audit', 'masterclass', 'one_on_one')),
    capacity INTEGER,
    claimed_count INTEGER NOT NULL DEFAULT 0,
    badge TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    slot_id TEXT REFERENCES public.mentor_slots(id),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id TEXT NOT NULL REFERENCES public.rewards(id),
    reward_title TEXT NOT NULL,
    tier TEXT NOT NULL,
    mentor_id UUID REFERENCES public.profiles(id),
    scheduled_time TIMESTAMPTZ,
    meeting_url TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
    tokens_spent INTEGER NOT NULL,
    report_content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Strikes Table (Behavior & Moderation Guardrails)
CREATE TABLE IF NOT EXISTS public.strikes (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('safety', 'irrelevance', 'inappropriate', 'spam')),
    details TEXT NOT NULL,
    penalty_tokens INTEGER NOT NULL DEFAULT 50,
    timeout_hours INTEGER NOT NULL DEFAULT 48,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 12. In-App Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('streak', 'ai_verification', 'peer_review', 'passport', 'booking', 'strike', 'token')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Indexes for High-Velocity Queries
CREATE INDEX IF NOT EXISTS idx_token_ledger_user ON public.token_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_wiki_edits_topic ON public.wiki_edits(topic_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON public.bookings(mentor_id);
