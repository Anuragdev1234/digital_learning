# Potential as a Passport — Executive Brief & Platform Architecture

> **"Many traditions. One living India."**  
> *A free student ecosystem where demonstrated effort unlocks mentorship, resources, and real-world opportunities.*

---

## 1. The Problem: The Capital Paywall in Education
In conventional EdTech and competitive exam ecosystems (IIT-JEE, NEET, GATE, Civil Services), premium masterclasses, 1-on-1 career audits, and elite mentorship are restricted behind steep subscription paywalls. Students with raw intellect and relentless dedication from rural or tier-2/3 institutions are systematically excluded simply due to economic circumstance.

## 2. The Solution: Potential as a Passport
**Potential as a Passport** replaces the credit card with an **Effort Paywall**:
- **Baseline Discipline**: Students must log in and complete 15-minute daily modules to build a **Consistency Streak**.
- **Practical Aptitude**: Students complete hands-on **Mini-Projects** using objects in their immediate environment (e.g. household scissors, ramps, friction audits, optical sensors).
- **Two-Tier Verification**:
  1. **Instant AI Gate**: Server-side contextual check evaluates *Safety*, *Relevance*, and *Grade-Level Appropriateness* to issue a **Temporary Passport**.
  2. **Community Peer Review**: Older students evaluate the work to award a **Verified Passport** and starting token bonus.
- **Effort Currency (Execution Tokens)**:
  - Lessons: `+10 Tokens`
  - Verified Projects: `+50 Tokens`
  - Peer Reviews: `+25 Tokens`
  - Wiki Contributions: `+15 Tokens`

---

## 3. The Mentorship Engine (The Vault)
Students redeem their hard-earned tokens for high-leverage milestones that can never be bought with money:
- **Tier 1 (100 Tokens)**: Instant AI Skill Gap Diagnostic Audit.
- **Tier 2 (300 Tokens)**: 45-minute live scholar masterclasses hosted by senior university scholars (e.g., IISc / IIT researchers).
- **Tier 3 (1,000 Tokens)**: 30-minute 1-on-1 portfolio audits and mock interview panels with industry leaders and exam rankers.

---

## 4. Architectural Pillars
1. **Zero-Cost Serverless Deployment**: Built with Next.js 16 App Router on Vercel/Cloudflare CDN, backed by Supabase PostgreSQL and private object storage.
2. **Private Storage Security**: Strict identity isolation (`student-submissions/{student_uuid}/{submission_id}/{filename}`) ensuring photos/videos from students' homes remain private to the owner and assigned reviewers.
3. **Socratic AI Guardrails**: The Floating AI Co-Pilot answers conceptual doubts and offers roadmap guidance, but strictly refuses to write answers to graded tasks or homework.
4. **The Strike System**: Automatic 50-token fines and 48-hour timeouts for inappropriate inputs or vulgarity.

---

## 5. Key Impact Metrics
- **Democratized Access**: 100% free; access is earned through sweat equity.
- **Sustainable Peer Network**: Seniors earn tokens and leadership credentials by mentoring juniors.
- **Verified Talent Pipeline**: Employers and universities gain direct access to pre-vetted, high-dedication candidates.
