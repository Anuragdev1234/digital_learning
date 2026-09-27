'use client';

import React from 'react';
import { usePassportStore } from '@/lib/db/store';
import { RotateCcw, ShieldAlert, Award, Sparkles, UserCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { state, currentUser, setCurrentUser, resetToSeed } = usePassportStore();

  return (
    <aside aria-label="Demo Testing Controls" className="bg-slate-900 border-b border-indigo-950/80 px-4 py-2 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400 tracking-wide uppercase text-[11px]">
            Demo Testing Mode:
          </span>
          <span className="text-slate-400 hidden sm:inline">Switch personas to test full lifecycle:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {state.profiles.map((p) => {
            const isActive = p.id === currentUser.id;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentUser(p.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`${p.name} (${p.role}) - ${p.passportStatus} passport`}
              >
                {p.role === 'admin' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                ) : p.role === 'mentor' ? (
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                ) : p.role === 'reviewer' ? (
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                )}
                <span>{p.name.split(' ')[0]}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded capitalize ${
                    p.role === 'admin'
                      ? 'bg-rose-950 text-rose-300'
                      : p.role === 'mentor'
                      ? 'bg-amber-950 text-amber-300'
                      : p.role === 'reviewer'
                      ? 'bg-cyan-950 text-cyan-300'
                      : 'bg-indigo-950 text-indigo-300'
                  }`}
                >
                  {p.role}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              if (confirm('Reset demo state to original seed data?')) {
                resetToSeed();
              }
            }}
            className="ml-2 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 transition-colors flex items-center gap-1 text-[11px]"
            title="Reset to fresh initial seed state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Seed</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
