# Potential as a Passport — Complete Full-Stack Web Application

> **"Many traditions. One living India."**  
> A completely free, effort-driven student educational ecosystem where demonstrated effort replaces traditional financial paywalls to unlock elite mentorship, verified status, and real-world opportunities.

---

## 🌟 Overview & Key Architectural Features

Built in strict accordance with the master design documents, screen flows, database schemas, and AI specifications:
1. **The Effort Paywall & Challenge Wall**:
   - **Consistency Streak**: 15-minute daily foundational learning modules (`+10 Execution Tokens` per day, streak counter increment).
   - **Practical Mini-Project**: Real-world application tasks (e.g. *Class 10 - The Mechanical Advantage Hunt*, *Class 11 - The Friction Audit*).
2. **Private Storage Architecture**:
   - Strictly validates storage paths conforming to `student-submissions/{student_uuid}/{submission_id}/{filename}`.
   - Enforces identity-based RLS: Students can only upload to and read their own folders, while assigned reviewers and admins receive authorized access.
3. **AI Verification Gate & Auto-Filter**:
   - Enforces a 3-point check (**Safety**, **Relevance**, and **Grade-Level Appropriateness**).
   - Instant AI pass grants a **Temporary Passport** and queues the submission for senior peer review.
4. **Community Peer Review**:
   - Senior scholars (e.g., *Vikram Patel, Class 12*) evaluate junior submissions, awarding the **Verified Passport**, granting `+50 Tokens` to the student and `+25 Tokens` to the reviewer.
5. **The Vault (Effort Marketplace)**:
   - **Tier 1 (100 Tokens)**: Instant personalized AI Skill Gap Diagnostic Audit report.
   - **Tier 2 (300 Tokens)**: 45-minute live scholar masterclass seat reservation (max capacity 20).
   - **Tier 3 (1,000 Tokens)**: 30-minute 1-on-1 portfolio audit and mock interview with industry leaders.
6. **Persistent Floating AI Mentor**:
   - Bottom-right floating assistant with strict Socratic boundaries: explains concepts and provides hints, but strictly refuses to write answers to graded homework/submissions.
7. **Open-Source Community Wiki**:
   - Open-source study notes with AI pre-checked edit proposals and peer merge review (`+15 Tokens` to editor, `+10 Tokens` to reviewer).
8. **Admin Control Center**:
   - P0 governance: Full funnel analytics, curriculum management, submission moderation, mentor credential verification, and Strike System enforcement (50-token fines & 48-hr suspension timeouts).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd potential-as-a-passport
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated End-to-End Verification Suite
```bash
npm run build
npx tsx scripts/verify_ecosystem.ts
```

---

## 🎭 Instant Persona / Role Switcher

Use the top toolbar to switch between personas without logging in or out:
- 🎓 **Aarav Gupta** (`Student - Day 0`): Fresh registration, streak 0, passport locked.
- ⚡ **Anurag Verma** (`Student - Class 10`): Streak 7, 430 tokens, Temporary Passport.
- 🏆 **Priya Singh** (`Student - Class 11`): Streak 14, 820 tokens, Verified Passport.
- 🔍 **Vikram Patel** (`Class 12 Reviewer`): Senior student reviewer grading pending submissions.
- 👨‍🏫 **Dr. Ramesh Kulkarni** (`Tier 2 Mentor`): Senior physics scholar hosting 45-min masterclasses.
- 🚀 **Anita Sharma** (`Tier 3 Mentor`): Robotics engineering lead conducting 1-on-1 portfolio audits.
- 🛡️ **System Administrator** (`Admin`): Complete platform oversight, strike logs, and funnel metrics.
