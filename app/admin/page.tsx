'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  Settings2,
  TrendingUp,
  Users2,
  FileCheck2,
  Award,
  Coins,
  ShieldAlert,
  ArrowRight,
  Layers,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { state } = usePassportStore();

  const totalStudents = state.profiles.filter((p) => p.role === 'student').length;
  const totalMentors = state.profiles.filter((p) => p.role === 'mentor').length;
  const totalSubmissions = state.submissions.length;
  const verifiedSubmissions = state.submissions.filter((s) => s.status === 'peer_verified').length;
  const totalRedemptions = state.bookings.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Settings2 className="w-4 h-4" />
            <span>Mission Control • P0 Admin Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Health & Governance</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor ecosystem execution velocity, review queues, mentor availability, curriculum assets, and fraud/strike guardrails.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-right">
          <div className="text-xs text-slate-400">Total Tokens in Circulation</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
            {state.tokenLedger.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Conversion Funnel Analytics (Section 33 in Spec) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Ecosystem Progression Funnel</h2>
            <p className="text-xs text-slate-400">Student advancement from registration to verified mentorship</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
            Live Stream
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">1. Registered</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{totalStudents}</div>
            <div className="text-[10px] text-slate-500 mt-1">100% Entry</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">2. Streak Active</div>
            <div className="text-2xl font-black text-orange-400 font-mono mt-1">
              {state.profiles.filter((p) => p.streakDays > 0).length}
            </div>
            <div className="text-[10px] text-orange-400/80 mt-1">Habit Forming</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">3. Submitted</div>
            <div className="text-2xl font-black text-indigo-400 font-mono mt-1">{totalSubmissions}</div>
            <div className="text-[10px] text-indigo-400/80 mt-1">Proof-of-Work</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">4. AI Approved</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {state.submissions.filter((s) => s.status !== 'pending' && s.status !== 'ai_rejected').length}
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1">Temp Passport</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">5. Peer Verified</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{verifiedSubmissions}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Full Passport</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">6. Redeemed</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{totalRedemptions}</div>
            <div className="text-[10px] text-cyan-400/80 mt-1">Vault Rewards</div>
          </div>
        </div>
      </div>

      {/* Admin Modules Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Curriculum Management</h3>
            <p className="text-xs text-slate-400 mt-1">
              Publish or edit 15-minute lessons, manage academic tracks, and calibrate mini-project requirements.
            </p>
          </div>
          <Link
            href="/admin/curriculum"
            className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Open Curriculum Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Submission Moderation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspect pending, AI-approved, verified, and flagged proof-of-work. Perform overrides where needed.
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Audit Submissions ({state.submissions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mentor Verification</h3>
            <p className="text-xs text-slate-400 mt-1">
              Review scholar applications, verify academic credentials, and assign Tier 2 or Tier 3 badges.
            </p>
          </div>
          <Link
            href="/admin/mentors"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Mentors ({totalMentors})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Wiki Merge Queue</h3>
            <p className="text-xs text-slate-400 mt-1">
              Audit suggested wiki edits that passed AI auto-filtering and maintain open-source syllabus notes.
            </p>
          </div>
          <Link
            href="/admin/wiki"
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open Wiki Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Vault Rewards & Pricing</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure Tier 1/2/3 catalog pricing (100, 300, 1,000 tokens) and monitor reward fulfillment.
            </p>
          </div>
          <Link
            href="/admin/rewards"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Rewards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strike Moderation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enforce two-fold penalties: 50-token automatic fines and 48-hour timeouts for inappropriate inputs.
            </p>
          </div>
          <Link
            href="/admin/strikes"
            className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>View Strike Log ({state.strikes.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
