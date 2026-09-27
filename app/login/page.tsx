'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import { LogIn, Sparkles, Award, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { state, setCurrentUser } = usePassportStore();

  const handleSelectRole = (userId: string, targetPath: string) => {
    setCurrentUser(userId);
    router.push(targetPath);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Potential as a Passport</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Select a verified demo account to experience the platform from different roles:
          </p>
        </div>

        <div className="space-y-3">
          {state.profiles.map((profile) => {
            const rolePath =
              profile.role === 'admin'
                ? '/admin'
                : profile.role === 'mentor'
                ? '/mentor'
                : profile.role === 'reviewer'
                ? '/mentor/reviews'
                : '/dashboard';

            return (
              <button
                key={profile.id}
                onClick={() => handleSelectRole(profile.id, rolePath)}
                className="w-full text-left p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all"
                  />
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      <span>{profile.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-mono tracking-wider bg-slate-800 text-slate-400">
                        {profile.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {profile.educationLevel || profile.specialization || 'System Operator'} •{' '}
                      <span className="text-amber-400 font-mono font-semibold">{profile.tokenBalance} Tokens</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <span className="text-xs font-medium hidden sm:inline">Enter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
