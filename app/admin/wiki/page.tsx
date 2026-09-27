'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { BookOpen, ArrowLeft, GitPullRequest, Bot, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminWikiPage() {
  const { state, mergeWikiEdit } = usePassportStore();

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
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Open Educational Commons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Community Wiki Moderation</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit AI auto-filter decisions, peer merge reviews, and content revisions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {state.wikiEdits.map((edit) => (
          <div
            key={edit.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold">{edit.topicTitle}</span>
                <div className="text-xs text-slate-400 mt-0.5">
                  Proposed by: <strong className="text-white">{edit.editorName}</strong>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                  edit.peerStatus === 'merged'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : edit.peerStatus === 'rejected'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {edit.peerStatus}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-rose-400 line-through">- {edit.originalText}</div>
              <div className="text-emerald-400">+ {edit.proposedText}</div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>AI Filter: {edit.aiStatus} ({edit.aiReason || 'none'})</span>
              </div>

              {edit.peerStatus === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => mergeWikiEdit(edit.id, true)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Admin Merge (+15t / +10t)
                  </button>
                  <button
                    onClick={() => mergeWikiEdit(edit.id, false)}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
