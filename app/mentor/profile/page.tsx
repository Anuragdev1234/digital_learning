'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Award, ShieldCheck, ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MentorProfilePage() {
  const { currentUser } = usePassportStore();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(
    currentUser.bio ||
      'Senior scholar and researcher dedicated to guiding students through intuitive mechanics and practical engineering.'
  );
  const [specialization, setSpecialization] = useState(
    currentUser.specialization || 'Classical Mechanics & Competitive Exam Strategy'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          href="/mentor"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mentor Hub</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Mentor Credentialing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Mentor Profile & Credentials</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your verified leadership profile, accredited volunteer hours, and subject specialization.
          </p>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>{currentUser.credentialStatus || 'Verified'}</span>
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {isSaved && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile credentials updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400/50"
            />
            <div>
              <div className="text-sm font-bold text-white">{currentUser.name}</div>
              <div className="text-xs text-amber-400 font-mono mt-0.5">
                {currentUser.mentorTier || 'Tier 2 Scholar'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">18.5 Accredited Volunteer Hours Logged</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Specialization
              </label>
              <input
                type="text"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Mentor Biography & Pedagogy Philosophy
            </label>
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Verified Mentor Badge appears on all student masterclasses and 1-on-1 bookings
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
