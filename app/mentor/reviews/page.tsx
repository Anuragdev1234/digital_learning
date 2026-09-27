'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { FileCheck2, UserCheck, ArrowRight, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function PeerReviewQueuePage() {
  const { currentUser, state } = usePassportStore();

  const pendingSubmissions = state.submissions.filter((s) => s.status === 'ai_approved');
  const completedSubmissions = state.submissions.filter((s) => s.status === 'peer_verified' || s.status === 'peer_rejected');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Community Peer Review Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Peer Verification Queue</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate junior student submissions that passed the AI pre-check. Reviewers earn +25 Execution Tokens per completed audit!
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 font-mono">
          Reviewer: {currentUser.name}
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Submissions Awaiting Audit ({pendingSubmissions.length})</span>
        </h2>

        {pendingSubmissions.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-xs text-slate-500">
            All submitted projects are currently verified! Check back when new students complete their streaks.
          </div>
        ) : (
          pendingSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={sub.evidenceUrl}
                  alt={sub.evidenceFilename}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-400">{sub.gradeLevel}</span>
                    <span className="text-xs text-slate-400">• Student: <strong className="text-white">{sub.studentName}</strong></span>
                  </div>
                  <h3 className="text-base font-bold text-white">{sub.challengeTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">&quot;{sub.explanation}&quot;</p>
                  <div className="text-[10px] text-emerald-400 mt-2 font-mono">
                    ✓ AI Pre-Check: {sub.aiResult?.message.slice(0, 60)}...
                  </div>
                </div>
              </div>

              <Link
                href={`/submissions/${sub.id}`}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-end sm:self-center"
              >
                <span>Evaluate & Grade (+25t)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Completed Peer Reviews */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-base font-bold text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Recently Verified by Community ({completedSubmissions.length})</span>
        </h2>

        <div className="space-y-3">
          {completedSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white">{sub.studentName}</span>
                <span className="text-slate-400"> — {sub.challengeTitle}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Verified by {sub.reviewerName} • {sub.reviewerFeedback}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                Verified Passport Issued
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
