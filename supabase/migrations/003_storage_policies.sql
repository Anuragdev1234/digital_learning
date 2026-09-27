-- =============================================================================
-- POTENTIAL AS A PASSPORT: PRIVATE STORAGE BUCKETS & POLICIES
-- Generated in accordance with Master Technical Specification (Section 6 & 13)
-- Path format: student-submissions/{student_uuid}/{submission_id}/{filename}
-- =============================================================================

-- 1. Create Private Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('student-submissions', 'student-submissions', false),
    ('core-curriculum', 'core-curriculum', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Storage Policies for student-submissions (Strict Isolation)
-- Student can only upload into their own authenticated UUID folder
CREATE POLICY "Students can upload to own submission folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'student-submissions'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Student can read their own submission evidence
CREATE POLICY "Students can read own submission evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'student-submissions'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Assigned Reviewer or Admin can read student submission evidence
CREATE POLICY "Assigned reviewers and admins can read student evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'student-submissions'
    AND (
        -- Admin override
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        -- Explicit reviewer assignment
        OR EXISTS (
            SELECT 1 FROM public.submissions
            WHERE reviewer_id = auth.uid()
            AND storage_path = name
        )
    )
);

-- 3. Storage Policies for core-curriculum
-- All authenticated students and mentors can read curriculum media
CREATE POLICY "Authenticated users can read core curriculum"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'core-curriculum');

-- Only admins can upload or mutate core curriculum
CREATE POLICY "Admins can manage core curriculum"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'core-curriculum'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
