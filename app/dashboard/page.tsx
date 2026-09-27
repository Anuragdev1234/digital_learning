'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import {
  Flame,
  Coins,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Milestone,
  FileCheck2,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PassportBadge } from '@/components/shared/PassportBadge';
import { TokenLedgerModal } from '@/components/shared/TokenLedgerModal';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { currentUser, state } = usePassportStore();
  const [showLedger, setShowLedger] = useState(false);

  const activeTrack =
    state.tracks.find((t) => t.id === currentUser.trackId) || state.tracks[0];
  const activeModule = state.modules[2] || state.modules[0];
  const activeLesson = activeModule.lessons[0] || state.modules[0].lessons[0];

  // Calculate tokens needed for next reward milestone
  const nextMilestoneReward = state.rewards[1]; // Tier 2 Masterclass (300 tokens)
  const tokensNeeded = Math.max(0, nextMilestoneReward.tokenCost - currentUser.tokenBalance);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Passport Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>{currentUser.educationLevel || 'Class 10'} Track</span>
            <span>•</span>
            <span className="capitalize">{currentUser.workflowState.replace('_', ' ')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Good day, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {currentUser.goal || 'Demonstrating daily effort to unlock senior mentorship and real opportunities.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PassportBadge status={currentUser.passportStatus} size="md" showDetails />
        </div>
      </div>

      {/* 1. THE EXECUTION ENGINE CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Counter */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency Streak</div>
            <div className="text-3xl font-black text-orange-400 mt-1 flex items-baseline gap-1.5">
              <span>{currentUser.streakDays}</span>
              <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[11px] text-orange-400/80 mt-1 flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>Active habit streak</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500 animate-pulse" />
          </div>
        </div>

        {/* Total Execution Tokens */}
        <div
          onClick={() => setShowLedger(true)}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-md cursor-pointer transition-all flex items-center justify-between group"
          title="Click to view auditable ledger"
        >
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Execution Tokens</div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1">
              {currentUser.tokenBalance}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1 font-medium group-hover:underline">
              Click to view ledger →
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Modules */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Modules</div>
            <div className="text-3xl font-black text-indigo-400 mt-1">
              2 <span className="text-xs font-normal text-slate-400">/ 4</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Class 10 Machines</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Milestone className="w-6 h-6" />
          </div>
        </div>

        {/* Verified Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passport Stage</div>
            <div className="text-lg font-black text-white capitalize mt-1">
              {currentUser.passportStatus}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{currentUser.passportStatus === 'verified' ? 'Peer Certified' : 'AI Cleared'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Up Next, Milestone Map, and Opportunity Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): UP NEXT ACTION CARD + MILESTONE MAP */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. UP NEXT / ACTION CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                Up Next • Active Task
              </span>
              <span className="text-xs text-slate-400 font-mono">Module 3</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Physics: The Mechanical Advantage Hunt
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Resume your practical proof-of-work submission. Photograph a simple household lever, label load vs. effort, and formulate your 3-sentence mechanical analysis.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/challenge"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4" />
                <span>Resume Execution</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/submissions"
                className="px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-slate-400" />
                <span>View Submissions History</span>
              </Link>
            </div>
          </div>

          {/* 3. MILESTONE MAP */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Milestone Journey Map</h3>
                <p className="text-xs text-slate-400">Class 10 Machines & Mechanics</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-400 font-mono">72%</span>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden mb-6 p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: '72%' }}
              />
            </div>

            {/* Module Stepper */}
            <div className="space-y-3">
              {state.modules.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    m.status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                      : m.status === 'available'
                      ? 'bg-indigo-950/20 border-indigo-500/50 text-white font-semibold'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : m.status === 'available'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {m.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : m.status === 'available' ? (
                        idx + 1
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span>{m.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {m.status === 'completed' ? '100%' : m.status === 'available' ? '72%' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): OPPORTUNITY TEASER & QUICK LINKS */}
        <div className="space-y-8">
          {/* 4. THE OPPORTUNITY TEASER */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Opportunity Teaser</span>
            </div>

            <h3 className="text-xl font-black text-white">
              {nextMilestoneReward.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {nextMilestoneReward.description}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Required Tokens:</span>
                <span className="font-bold font-mono text-amber-400">{nextMilestoneReward.tokenCost}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Your Current Balance:</span>
                <span className="font-bold font-mono text-white">{currentUser.tokenBalance}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-semibold text-amber-400">
                {tokensNeeded === 0
                  ? 'Ready to unlock in The Vault!'
                  : `Earn ${tokensNeeded} more tokens to unlock!`}
              </div>
            </div>

            <Link
              href="/vault"
              className="mt-6 w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Community Wiki Quick Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Open-Source Wiki</h4>
                <p className="text-xs text-slate-400">Propose edits, earn +15 tokens</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Help younger peers understand difficult physics concepts. Edits are pre-checked by AI and merged by older scholars.
            </p>
            <Link
              href="/wiki"
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Browse Study Notes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <TokenLedgerModal isOpen={showLedger} onClose={() => setShowLedger(false)} />
    </div>
  );
}
