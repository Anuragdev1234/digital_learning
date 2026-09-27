'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { TrendingUp, ArrowLeft, Users2, Flame, Award, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { state } = usePassportStore();

  const totalStudents = state.profiles.filter((p) => p.role === 'student').length;
  const activeStreakCount = state.profiles.filter((p) => p.streakDays > 0).length;
  const totalSubmissions = state.submissions.length;
  const verifiedCount = state.submissions.filter((s) => s.status === 'peer_verified').length;
  const totalTokensEarned = state.tokenLedger.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
  const totalTokensSpent = Math.abs(
    state.tokenLedger.reduce((sum, tx) => sum + (tx.amount < 0 ? tx.amount : 0), 0)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Overview</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Analytics & Throughput</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry on student dedication, proof-of-work velocity, and mentor engagement.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion to Streak</div>
          <div className="text-3xl font-black text-orange-400 font-mono mt-1">
            {Math.round((activeStreakCount / Math.max(1, totalStudents)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active daily learners</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Approval Rate</div>
          <div className="text-3xl font-black text-indigo-400 font-mono mt-1">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">Contextual check throughput</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peer Verification Rate</div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {Math.round((verifiedCount / Math.max(1, totalSubmissions)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Senior scholar audit pass</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Velocity Ratio</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">
            {((totalTokensSpent / Math.max(1, totalTokensEarned)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Earn-to-redemption burn</div>
        </div>
      </div>

      {/* Funnel Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white">Full Student Lifecycle Funnel</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
              <span>Step 1: Onboarded & Registered</span>
              <span>100% ({totalStudents} students)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div className="bg-indigo-600 h-full w-full rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
              <span>Step 2: 15-Minute Daily Streak Active</span>
              <span>80% ({activeStreakCount} students)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div className="bg-orange-500 h-full w-[80%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
              <span>Step 3: Practical Mini-Project Submitted</span>
              <span>75% ({totalSubmissions} submissions)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div className="bg-cyan-500 h-full w-[75%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
              <span>Step 4: AI Context Passed (Temporary Passport)</span>
              <span>68% ({state.submissions.filter((s) => s.status !== 'pending').length} passes)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div className="bg-amber-400 h-full w-[68%] rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
              <span>Step 5: Peer Verified (Full Verified Passport)</span>
              <span>55% ({verifiedCount} students)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[55%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
