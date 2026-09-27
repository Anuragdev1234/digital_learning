'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { BookOpen, GitPullRequest, ArrowRight, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function WikiDirectoryPage() {
  const { state } = usePassportStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Open-Source Educational Wiki</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Community Study Notes</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            We treat study notes like open-source code. Propose clearer analogies or better real-world examples. AI filters out spam, while older students review and merge changes.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/40 text-xs text-indigo-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contribution Rewards</span>
          </div>
          <div>• +15 Tokens for merged wiki edits</div>
          <div>• +10 Tokens for peer merge review</div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.wikiTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-400 mb-3">
                <span className="font-mono font-semibold">{topic.gradeLevel}</span>
                <span className="text-slate-500 font-mono">v{topic.version}.0</span>
              </div>

              <h2 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {topic.title}
              </h2>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                {topic.content.replace(/#|\*|_/g, '').slice(0, 150)}...
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                <span>{topic.suggestedEditsCount} suggested edits</span>
              </div>

              <Link
                href={`/wiki/${topic.id}`}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 font-bold text-xs flex items-center gap-1 transition-colors border border-slate-800"
              >
                <span>Read & Edit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
