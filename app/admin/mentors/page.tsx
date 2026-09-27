'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Users2, ArrowLeft, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminMentorsPage() {
  const { state } = usePassportStore();
  const mentors = state.profiles.filter((p) => p.role === 'mentor');

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
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Users2 className="w-4 h-4" />
            <span>Mentor Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Verified Mentor Network</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Tier 2 Senior Scholars (Masterclasses) and Tier 3 Industry Rankers (1-on-1s).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map((m) => (
          <div key={m.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/50"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {m.mentorTier}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{m.credentialStatus}</span>
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{m.name}</h2>
                  <div className="text-xs text-slate-400">{m.specialization}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">{m.bio}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Account Status: Active</span>
              <span className="font-mono text-amber-400">{m.tokenBalance} Tokens</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
