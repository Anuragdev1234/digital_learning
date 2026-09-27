'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = usePassportStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to the Aarav Gupta new-student persona
    setCurrentUser('user-student-new');
    router.push('/onboarding');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free • Effort As Currency</span>
          </div>
          <h1 className="text-2xl font-black text-white">Create Student Account</h1>
          <p className="text-xs text-slate-400 mt-2">
            No credit card, no subscription fees. You will pay with consistent study and practical proof-of-work.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Gupta"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@domain.edu"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-6"
          >
            <span>Proceed to Academic Track Selection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          Already have a passport in progress?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign In with Demo Role
          </button>
        </div>
      </div>
    </div>
  );
}
