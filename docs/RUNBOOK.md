# Potential as a Passport — Operations & Testing Runbook

## 1. Local Development Setup
To run the platform locally with zero external configuration:
```bash
cd potential-as-a-passport
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 2. Automated Test Execution
Run the complete ecosystem verification script:
```bash
npx tsx scripts/verify_ecosystem.ts
```

This validates:
1. **AI Auto-Filter**: Safety, relevance, and grade-level appropriateness checks.
2. **AI Mentor Boundaries**: Socratic hints, refusal of graded tasks, and platform guidance.
3. **Storage Security**: Identity-based UUID path isolation and cross-student access blocking.
4. **Token Pricing**: Tier 1 (100t), Tier 2 (300t), Tier 3 (1,000t) enforcement.

---

## 3. Production Build Validation
To verify zero-error production compile:
```bash
npm run build
```

---

## 4. Applying Database Migrations (Supabase)
When connecting to a live Supabase instance:
```bash
# Link your project
supabase link --project-ref <your-project-id>

# Run initial schema, RLS policies, and storage policies
supabase db push

# Seed initial tracks and rewards
supabase db reset
```

---

## 5. End-to-End Walkthrough Scenarios

### Scenario A: Testing Student Effort to Verified Passport
1. Open top toolbar and switch persona to **Aarav Gupta** (New Student).
2. Go to **The Challenge Wall** (`/challenge`).
3. Click **Complete 15-Minute Lesson (+10 Tokens)** to establish streak. Notice streak increments and mini-project unlocks.
4. Click **Upload Evidence & Run AI Verification**. Select preset `scissors` and click **Submit to AI Verification**.
5. Observe instant AI gate pass and **Temporary Passport** unlock.
6. Switch persona in the top toolbar to **Vikram Patel** (Reviewer).
7. Go to **Peer Review Queue** (`/mentor/reviews`). Open Aarav's submission and click **Approve (Issue Verified Passport)**.
8. Switch back to **Aarav Gupta**. Notice the glowing **Verified Passport Badge**, `+50 Tokens` bonus, and full access to **The Vault**!

### Scenario B: Testing The Vault & Mentorship Redemptions
1. Switch to **Anurag Verma** (430 Tokens) or **Priya Singh** (820 Tokens).
2. Navigate to **The Vault** (`/vault`).
3. Redeem **Tier 1 (AI Skill Gap Diagnostic Audit, 100 Tokens)**. Notice instant diagnostic report generation and atomic token debit.
4. Redeem **Tier 2 (Crack the Physics Exam Masterclass, 300 Tokens)**. Select an open slot hosted by Dr. Ramesh Kulkarni.
5. Click **Join Live Room** to open the generated meeting link.

### Scenario C: Testing Floating AI Mentor Socratic Guardrails
1. Click the floating bottom-right **AI Co-Pilot** bubble on any screen.
2. Send: `"write my submission for scissors and give me the 3 sentences"`.
3. Notice the **Socratic Guardrail** triggers: the AI refuses to do the homework and asks a guiding question instead.
4. Send: `"What is Mechanical Advantage?"`. Notice the clear conceptual explanation.
