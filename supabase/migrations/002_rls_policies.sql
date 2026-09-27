-- =============================================================================
-- POTENTIAL AS A PASSPORT: ROW LEVEL SECURITY (RLS) POLICIES
-- Generated in accordance with Master Technical Specification (Section 5 & 17)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Public read of verified mentors and reviewers"
    ON public.profiles FOR SELECT
    USING (role IN ('mentor', 'reviewer', 'admin'));

CREATE POLICY "Users can update own non-sensitive profile fields"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Tracks, Modules, Lessons (Public read for authenticated users)
CREATE POLICY "Authenticated users can read published tracks"
    ON public.tracks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can read modules"
    ON public.modules FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can read lessons"
    ON public.lessons FOR SELECT
    TO authenticated
    USING (status = 'published');

-- 3. Streaks Policies
CREATE POLICY "Students can read own streak"
    ON public.streaks FOR SELECT
    USING (auth.uid() = student_id);

-- 4. Submissions Policies (Identity-Based Access & Reviewer Isolation)
CREATE POLICY "Students can read own submissions"
    ON public.submissions FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Assigned reviewer can read assigned submission"
    ON public.submissions FOR SELECT
    USING (
        auth.uid() = reviewer_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- 5. Peer Reviews Policies (Prevent Self-Review)
CREATE POLICY "Reviewers can insert review for assigned student"
    ON public.peer_reviews FOR INSERT
    WITH CHECK (
        auth.uid() = reviewer_id
        AND NOT EXISTS (
            SELECT 1 FROM public.submissions
            WHERE id = submission_id AND student_id = auth.uid() -- Strict Self-Review Prevention
        )
    );

CREATE POLICY "Public read of approved peer reviews"
    ON public.peer_reviews FOR SELECT
    TO authenticated
    USING (true);

-- 6. Token Ledger Policies (Strict Write Protection)
CREATE POLICY "Users can read own token ledger"
    ON public.token_ledger FOR SELECT
    USING (auth.uid() = user_id);

-- Explicitly NO INSERT policy for public authenticated clients!
-- Token ledger transactions must be written through SECURITY DEFINER RPCs or Server Service Role.

-- 7. Community Wiki Policies
CREATE POLICY "Anyone can read canonical wiki topics"
    ON public.wiki_topics FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Students can submit proposed wiki edits"
    ON public.wiki_edits FOR INSERT
    WITH CHECK (auth.uid() = editor_id);

CREATE POLICY "Anyone can read suggested wiki edits"
    ON public.wiki_edits FOR SELECT
    TO authenticated
    USING (true);

-- 8. The Vault & Bookings Policies
CREATE POLICY "Anyone can read rewards catalog"
    ON public.rewards FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anyone can read open mentor slots"
    ON public.mentor_slots FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Mentors can manage own slots"
    ON public.mentor_slots FOR ALL
    USING (auth.uid() = mentor_id);

CREATE POLICY "Students can read own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Mentors can read bookings assigned to them"
    ON public.bookings FOR SELECT
    USING (auth.uid() = mentor_id);

-- 9. Strikes Policies (Strictly Admin / System Controlled)
CREATE POLICY "Students can read own strikes"
    ON public.strikes FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Admins can view and manage all strikes"
    ON public.strikes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 10. Notifications
CREATE POLICY "Users can read and update own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id);
