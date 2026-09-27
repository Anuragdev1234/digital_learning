'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Milestone, CheckCircle2, Lock, Clock, ArrowRight, BookOpen, Flame, FlaskConical } from 'lucide-react';
import { FrictionVectorSimulator } from '@/components/simulators/FrictionVectorSimulator';

export default function MilestonesPage() {
  const { currentUser, state } = usePassportStore();
  const [showSim, setShowSim] = React.useState(true);

  const activeTrack =
    state.tracks.find((t) => t.id === currentUser.trackId) || state.tracks[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Milestone className="w-4 h-4" />
            <span>Academic Execution Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{activeTrack.title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {activeTrack.description} Every lesson is calibrated to 15 minutes of disciplined execution.
          </p>
        </div>

        <button
          onClick={() => setShowSim(!showSim)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FlaskConical className="w-4 h-4" />
          <span>{showSim ? 'Hide Mechanics Lab' : 'Launch Mechanics Lab'}</span>
        </button>
      </div>

      {/* High-Stakes Interactive Simulator */}
      {showSim && <FrictionVectorSimulator />}

      {/* Modules Roadmap */}
      <div className="space-y-6">
        {state.modules.map((mod, idx) => (
          <div
            key={mod.id}
            className={`rounded-3xl border p-6 sm:p-8 transition-all ${
              mod.status === 'completed'
                ? 'bg-slate-900/60 border-emerald-500/30'
                : mod.status === 'available'
                ? 'bg-slate-900 border-indigo-500/50 shadow-xl'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    mod.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : mod.status === 'available'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {mod.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : mod.status === 'available' ? (
                    idx + 1
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{mod.title}</h2>
                  <p className="text-xs text-slate-400">{mod.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase font-mono ${
                    mod.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : mod.status === 'available'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mod.status}
                </span>
              </div>
            </div>

            {/* Lessons List in Module */}
            <div className="space-y-3">
              {mod.lessons.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
                  Advanced lessons locked until Module 3 is verified.
                </div>
              ) : (
                mod.lessons.map((les) => (
                  <div
                    key={les.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-white mb-1">
                        {les.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        )}
                        <span className="font-bold">{les.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{les.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {les.keyConcepts.map((kc, kIdx) => (
                          <span
                            key={kIdx}
                            className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/challenge"
                        className="px-4 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{les.isCompleted ? 'Review' : 'Start 15-Min'}</span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
