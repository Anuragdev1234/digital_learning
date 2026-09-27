'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  Compass,
  ArrowRight,
  Flame,
  ShieldCheck,
  Coins,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Users2,
  Bot,
  Zap,
} from 'lucide-react';
import { PassportBadge } from '@/components/shared/PassportBadge';

export default function LandingPage() {
  const { currentUser, setCurrentUser } = usePassportStore();

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-800">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Many traditions. One living India.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Effort Is Your <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">Only Currency</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A 100% free student ecosystem where consistency streaks and real-world mini-projects unlock senior scholars, industry mentorship, and verified proof-of-work.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Begin Student Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base transition-all hover:border-slate-600 flex items-center gap-2"
            >
              <span>Open Active Dashboard</span>
            </Link>

            <Link
              href="/mentor-apply"
              className="px-6 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all"
            >
              Apply as Mentor (Tier 2 / 3)
            </Link>
          </div>

          {/* Live Passport Teaser */}
          <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-xs text-slate-400 font-medium">Currently testing as:</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="text-xs text-slate-400">({currentUser.educationLevel || currentUser.role})</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PassportBadge status={currentUser.passportStatus} size="sm" />
              <div className="flex items-center gap-1 text-amber-400 font-mono text-sm font-bold">
                <Coins className="w-4 h-4" />
                <span>{currentUser.tokenBalance}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Effort Journey */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-2">The Execution Loop</h2>
            <p className="text-3xl font-extrabold text-white">How Effort Unlocks Opportunity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Consistency Streak
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in and complete 15-minute daily modules. No money. Demonstrating consistent habit unlocks the practical challenge.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Real-World Mini-Project
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Find household machines, conduct friction audits, or analyze quantum paper abstracts. Upload real photo/video evidence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                AI + Peer Verification
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI executes a 3-point check (Safety, Relevance, Level) for a Temporary Passport, followed by senior peer review for Verified status.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                The Vault & Mentorship
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spend earned Execution Tokens to unlock Tier 1 AI Audits (100t), Tier 2 Scholar Masterclasses (300t), and Tier 3 1-on-1 Mentorship (1,000t).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars: Student, Mentor, Admin */}
      <section className="py-20 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Student Experience</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  From Class 9 Foundation to B.Sc. & competitive exams. Gamified milestones, streak engine, and a floating Socratic AI Co-Pilot that never gives away answers.
                </p>
              </div>
              <Link
                href="/challenge"
                className="text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-1.5"
              >
                <span>Enter Challenge Wall</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mentor Network</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Senior university scholars host 45-min masterclasses. Industry professionals conduct 1-on-1 portfolio audits and mock interviews with pre-vetted, high-effort talent.
                </p>
              </div>
              <Link
                href="/mentor-apply"
                className="text-amber-400 hover:text-amber-300 font-bold text-sm flex items-center gap-1.5"
              >
                <span>Apply as Verified Mentor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Platform Control & Wiki</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Open-source study notes protected by AI auto-filters and community merge requests. Complete token ledger transparency and moderation strike safeguards.
                </p>
              </div>
              <Link
                href="/admin"
                className="text-rose-400 hover:text-rose-300 font-bold text-sm flex items-center gap-1.5"
              >
                <span>Explore Admin Operations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
