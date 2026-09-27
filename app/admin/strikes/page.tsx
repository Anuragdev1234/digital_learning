'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { ShieldAlert, ArrowLeft, Clock, AlertTriangle, Coins } from 'lucide-react';

export default function AdminStrikesPage() {
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
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Moderation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">The Strike System</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Two-fold penalties for bad behavior: automatic token fines (-50 Tokens) and 48-hour submission suspensions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {state.strikes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl text-xs text-slate-500">
            No active strikes recorded. All platform interactions remain within academic and safety guardrails!
          </div>
        ) : (
          state.strikes.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-white text-sm">{s.studentName}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase">
                    {s.category}
                  </span>
                </div>
                <div className="text-xs font-mono text-rose-400 font-bold">
                  -{s.penaltyTokens} Tokens Fine Applied
                </div>
              </div>

              <p className="text-xs text-slate-300">{s.details}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>48-Hour Submission Timeout active until {new Date(s.expiresAt).toLocaleDateString()}</span>
                </span>
                <span>Logged {new Date(s.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
