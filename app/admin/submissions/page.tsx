'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { FileCheck2, ArrowLeft, Bot, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function AdminSubmissionsPage() {
  const { state } = usePassportStore();

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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <FileCheck2 className="w-4 h-4" />
            <span>Submission Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Proof-of-Work Pipeline</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit student submissions across AI verification and peer review stages.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {state.submissions.map((sub) => (
          <div
            key={sub.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <img
                src={sub.evidenceUrl}
                alt={sub.evidenceFilename}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-400">{sub.gradeLevel}</span>
                  <span className="text-xs text-slate-400">Student: <strong className="text-white">{sub.studentName}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-slate-400">{sub.id}</span>
                </div>
                <h3 className="text-base font-bold text-white">{sub.challengeTitle}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">&quot;{sub.explanation}&quot;</p>
                {sub.aiResult && (
                  <div className="text-[10px] text-amber-400 mt-1.5 font-mono">
                    AI Decision: {sub.aiResult.status} ({sub.aiResult.reason})
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase font-mono ${
                  sub.status === 'peer_verified'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : sub.status === 'ai_approved'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sub.status.replace('_', ' ')}
              </span>

              <Link
                href={`/submissions/${sub.id}`}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                Audit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
