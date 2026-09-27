'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { FileCheck2, ArrowRight, ShieldCheck, ShieldAlert, Clock, ExternalLink } from 'lucide-react';
import { PassportBadge } from '@/components/shared/PassportBadge';

export default function SubmissionsPage() {
  const { currentUser, state } = usePassportStore();

  const userSubmissions = state.submissions.filter((s) => s.studentId === currentUser.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <FileCheck2 className="w-4 h-4" />
            <span>Proof-of-Work Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">My Submissions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every submission is checked by our AI gate for safety & level, then validated by community peer reviewers.
          </p>
        </div>

        <Link
          href="/challenge"
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <span>Submit New Evidence</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {userSubmissions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <FileCheck2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <h3 className="text-base font-bold text-white">No submissions yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete your daily streak on the Challenge Wall to unlock your first practical mini-project!
            </p>
            <Link
              href="/challenge"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Go to Challenge Wall
            </Link>
          </div>
        ) : (
          userSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={sub.evidenceUrl}
                  alt={sub.evidenceFilename}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-indigo-400 font-semibold">
                      {sub.gradeLevel}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono uppercase ${
                        sub.status === 'peer_verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sub.status === 'ai_approved'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : sub.status === 'ai_rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{sub.challengeTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xl">
                    &quot;{sub.explanation}&quot;
                  </p>

                  <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-3">
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    {sub.reviewerName && (
                      <span>• Reviewer: {sub.reviewerName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link
                  href={`/submissions/${sub.id}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
