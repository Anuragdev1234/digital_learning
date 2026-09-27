-- =============================================================================
-- POTENTIAL AS A PASSPORT: DATABASE SEED SCRIPT
-- =============================================================================

-- Seed Academic Tracks
INSERT INTO public.tracks (id, title, grade_level, phase, description, is_interactive, challenge_title, challenge_description, evidence_requirement)
VALUES 
    (
        'track-class10-machines', 
        'Class 10 - Machines & Mechanical Advantage', 
        'Class 10', 
        'School Foundation', 
        'Master force multiplication, leverage, simple and compound tools in daily life.', 
        TRUE, 
        'The Mechanical Advantage Hunt', 
        'Find a simple machine (scissors, bottle opener, ramp). Photograph it, label effort and load, and explain how it multiplies force.', 
        'Photo with effort/load labels + 3-sentence explanation'
    ),
    (
        'track-class9-sound', 
        'Class 9 - Sound & Vibration Mechanics', 
        'Class 9', 
        'School Foundation', 
        'Explore the nature of wave motion, frequency, amplitude, and acoustics in real objects.', 
        FALSE, 
        'The Household Acoustic Investigation', 
        'Find an object producing unique pitch. Explain how vibrations relate to pitch.', 
        'Audio/Video clip or photo + frequency explanation'
    ),
    (
        'track-class11-newton', 
        'Class 11 - Newton''s Laws & Dynamics', 
        'Class 11', 
        'Higher Ed & Govt Exams', 
        'Rigorous vector analysis, friction audits, and free-body diagrams for complex systems.', 
        FALSE, 
        'The Environmental Friction Audit', 
        'Identify where friction is deliberately increased and decreased. Draw a free-body diagram.', 
        'Hand-drawn FBD photo + 3-point dynamic analysis'
    ),
    (
        'track-class12-photoelectric', 
        'Class 12 - Dual Nature of Radiation & Matter', 
        'Class 12', 
        'Higher Ed & Govt Exams', 
        'Photon theory, work function, stopping potential, and modern quantum technologies.', 
        FALSE, 
        'The Photoelectric Effect in Your Pocket', 
        'Photograph a solar device or camera sensor. Explain quantum photon excitation.', 
        'Photo of sensor + quantum excitation explanation'
    ),
    (
        'track-bsc-quantum', 
        'B.Sc. - Advanced Quantum & Applied Physics', 
        'B.Sc.', 
        'Higher Ed & Govt Exams', 
        'Literature analysis, quantum semiconductor behavior, and research translation.', 
        FALSE, 
        'Classic Physics Abstract Translation', 
        'Summarize Einstein''s 1905 paper abstract and connect to modern CMOS imaging.', 
        '3-sentence synthesis + modern application tie-in'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Rewards
INSERT INTO public.rewards (id, tier, title, token_cost, description, type, capacity, claimed_count, badge)
VALUES
    (
        'rew-tier1-audit',
        'Tier 1',
        'AI Skill Gap Diagnostic Audit',
        100,
        'Instant, deep AI evaluation of completed mini-projects and conceptual weaknesses with a tailored 30-day study trajectory.',
        'ai_audit',
        NULL,
        42,
        'Foundational Milestone'
    ),
    (
        'rew-tier2-masterclass',
        'Tier 2',
        'Physics Mechanics Masterclass (Senior Scholar)',
        300,
        'Interactive 45-minute small-group masterclass hosted by university scholar Dr. Ramesh Kulkarni.',
        'masterclass',
        20,
        14,
        'Intermediate Milestone'
    ),
    (
        'rew-tier3-mentorship',
        'Tier 3',
        '1-on-1 Engineering Portfolio & Live Mock Interview',
        1000,
        'Private 30-minute one-on-one session with Senior Robotics Engineer Anita Sharma.',
        'one_on_one',
        5,
        2,
        'High-Stakes Milestone'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Wiki Topics
INSERT INTO public.wiki_topics (id, title, grade_level, subject, content, version, suggested_edits_count)
VALUES
    (
        'wiki-machines-class10',
        'Class 10: Mechanical Advantage in Simple Machines',
        '10th Grade',
        'Physics',
        '# Mechanical Advantage in Everyday Simple Machines\n\nA simple machine provides a Mechanical Advantage (MA) by trading distance for force: MA = Load / Effort.\n\n### Class 1 Levers (Fulcrum in the Middle)\nExamples: Pliers, scissors, seesaws.\n\n### Class 2 Levers (Load in the Middle)\nExamples: Nutcrackers, bottle openers. MA is always > 1.',
        3,
        1
    ),
    (
        'wiki-sound-class9',
        'Class 9: Sound Propagation & Resonance',
        '9th Grade',
        'Physics',
        '# Sound Waves and Vibration Mechanics\n\nSound is a mechanical wave produced by vibrations. Pitch is governed by frequency (Hz), while loudness depends on amplitude.',
        1,
        0
    ),
    (
        'wiki-friction-class11',
        'Class 11: Static vs Kinetic Friction & Free-Body Analysis',
        '11th Grade',
        'Physics',
        '# Friction: Nature, Laws, and FBD Representation\n\nStatic friction self-adjusts up to limiting friction: fs <= mus * N. Kinetic friction operates during active sliding: fk = muk * N.',
        2,
        0
    )
ON CONFLICT (id) DO NOTHING;
