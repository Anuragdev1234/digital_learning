'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Flame,
  Zap,
  Bot,
  UserCheck,
  Coins,
  Award,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white">
      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-slate-800 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>The Effort-Driven Educational Paradigm</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            How <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">Potential as a Passport</span> Works
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            By removing financial barriers, active execution—not family capital—is the only requirement for accessing elite mentorship, verified credentials, and real opportunities.
          </p>
        </div>
      </section>

      {/* 5-Step Deep Dive */}
      <section className="py-20 max-w-5xl mx-auto px-4 space-y-12">
        {/* Step 1 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            01
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase mb-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>Step 1: The Consistency Streak</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Build the Daily Habit of Discipline</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every student begins on the Challenge Wall. Instead of a paywall, you log in daily and complete a calibrated 15-minute foundational learning module. Each completed lesson earns <strong>+10 Execution Tokens</strong> and builds your streak.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            02
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Step 2: Practical Mini-Project</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Execute Real-World Proof-of-Work</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Once your streak demonstrates consistency, your academic track unlocks a hands-on mini-project:
              <br />• <strong>Class 10</strong>: The Mechanical Advantage Hunt (scissors, bottle opener, ramp).
              <br />• <strong>Class 11</strong>: The Friction Audit & Free-Body Diagram.
              <br />• <strong>Class 12 / B.Sc.</strong>: Photoelectric Sensors & Classical Physics Abstract Translations.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            03
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Step 3: Instant AI Verification & Temporary Passport</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Automated 5-Second Contextual Check</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our AI pre-check instantly evaluates your evidence and explanation against three strict criteria: <strong>Safety</strong>, <strong>Factual Relevance</strong>, and <strong>Grade-Level Calibration</strong>. Passing unlocks your <strong>Temporary Passport</strong> immediately.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            04
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Community Peer Review & Verified Passport</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Senior Scholars Validate Your Proof-of-Work</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              An older student reviewer inspects your submission and provides constructive feedback. Once approved, you are awarded your <strong>Verified Passport</strong> and a <strong>+50 Starting Token Bonus</strong>, while the reviewer earns <strong>+25 Tokens</strong>.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl flex-shrink-0">
            05
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Step 5: The Vault & Mentorship Redemptions</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Redeem Effort Currency for High-Value Milestones</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Spend Execution Tokens in The Vault:
              <br />• <strong>Tier 1 (100 Tokens)</strong>: AI Skill Gap Diagnostic Report.
              <br />• <strong>Tier 2 (300 Tokens)</strong>: 45-min small-group masterclass with senior university scholars.
              <br />• <strong>Tier 3 (1,000 Tokens)</strong>: 30-min 1-on-1 portfolio audit and mock interview with industry leaders.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>Begin Your Effort Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
