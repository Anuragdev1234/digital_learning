'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Layers, ArrowLeft, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function AdminCurriculumPage() {
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
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Curriculum Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Academic Tracks & Modules</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage published tracks, 15-minute daily lesson assets, and practical mini-projects.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {state.tracks.map((track) => (
          <div key={track.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-400">{track.gradeLevel}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{track.phase}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{track.title}</h2>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-mono font-bold uppercase ${
                  track.isInteractive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {track.isInteractive ? 'Interactive Demo Track' : 'Published Track'}
              </span>
            </div>

            <p className="text-xs text-slate-300">{track.description}</p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-white">Challenge: {track.challengeTitle}</div>
              <div className="text-slate-400">Requirement: {track.evidenceRequirement}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
