# Potential as a Passport — System Architecture Specification

## 1. System Vision & Paradigm Shift
Traditional online education uses financial subscription paywalls that restrict quality mentorship to students with capital. **Potential as a Passport** replaces the financial paywall with an **Effort Paywall**:
1. Students prove dedication by maintaining a **Consistency Streak** (15 minutes/day of disciplined study).
2. Students prove practical aptitude by submitting real-world **Mini-Projects** (hands-on mechanical hunts, friction audits, quantum abstracts).
3. The platform verifies potential using a two-tier gate: **Instant AI Verification** (Temporary Passport) followed by **Community Peer Review** (Verified Passport).
4. Verified effort earns **Execution Tokens**, which students redeem in **The Vault** for high-stakes mentorship (Tier 1 AI audits, Tier 2 Scholar masterclasses, and Tier 3 1-on-1 industry mentorship).

---

## 2. Component Topology

```
+-------------------------------------------------------------------------------+
|                           CLIENT TIER (Next.js 16)                            |
|                                                                               |
|  [ Student Hub ]          [ Mentor Engine ]          [ Admin Governance ]     |
|   - Challenge Wall         - Availability Slots       - Curriculum Manager    |
|   - Dynamic Dashboard      - Sessions & Attendance    - Submissions Pipeline  |
|   - Milestones Roadmap     - Review Queue             - Mentor Approvals      |
|   - Proof-of-Work          - Profile & Badges         - Wiki Moderation       |
|   - The Vault                                         - Strike System         |
|   - Open Wiki                                         - Funnel Analytics      |
|                                                                               |
|                   [ Persistent Floating AI Mentor Bubble ]                    |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       API & EDGE LAYER (Next.js / Deno)                       |
|                                                                               |
|   /api/me                     /api/submissions            /api/redeem         |
|   /api/dashboard              /api/submissions/:id/verify /api/mentors        |
|   /api/lesson/complete        /api/submissions/:id/review /api/bookings       |
|   /api/wiki/edits             /api/ai/chat                                    |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                     PERSISTENCE & SECURITY LAYER (Supabase)                   |
|                                                                               |
|  [ PostgreSQL Tables ]                                                        |
|   - profiles, tracks, modules, lessons, streaks, token_ledger                 |
|   - submissions, peer_reviews, wiki_topics, wiki_edits                        |
|   - mentors, mentor_slots, bookings, rewards, strikes, notifications          |
|                                                                               |
|  [ Private Object Storage ]                                                   |
|   - student-submissions/ {student_uuid} / {submission_id} / {filename}        |
|   - core-curriculum/                                                          |
|                                                                               |
|  [ Security Engine ]                                                          |
|   - Row Level Security (RLS) identity isolation (auth.uid())                  |
|   - Immutable Token Ledger (Double-Entry, Write-Protected)                    |
|   - Strike Moderation & Timeout Guardrails                                    |
+-------------------------------------------------------------------------------+
```

---

## 3. Data Models & Token Economics

### Token Values & Invariants
- **Daily Lesson (15 mins)**: `+10 Tokens` (award once per calendar day).
- **Mini-Project Milestone**: `+50 Tokens` (credited upon peer review approval).
- **Peer Review Audit**: `+25 Tokens` (credited to reviewer upon completing a constructive audit).
- **Community Wiki Edit**: `+15 Tokens` to author and `+10 Tokens` to reviewer upon merge.
- **Tier 1 Vault (AI Skill Gap Audit)**: `-100 Tokens` (instant personalized diagnostic).
- **Tier 2 Vault (Scholar Masterclass)**: `-300 Tokens` (45-min group masterclass, cap 20).
- **Tier 3 Vault (1-on-1 Mentorship)**: `-1,000 Tokens` (30-min private session with ranker).
- **Strike Violation**: `-50 Tokens` fine + 48-hour submission suspension.
