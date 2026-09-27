'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MentorApplyPage() {
  const router = useRouter();
  const [tier, setTier] = useState<'Tier 2' | 'Tier 3'>('Tier 2');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('Classical Mechanics & Exam Strategy');
  const [intent, setIntent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Mentor Recruitment & Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Apply to Become a Verified Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Give back to dedicated students who have proven their effort through consistency streaks. Earn verified leadership credentials, accredited volunteer hours, and direct access to top-tier talent.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-white">Application Received!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for volunteering with Potential as a Passport. Our admin team will review your credentials and schedule a brief 5-minute alignment call before issuing your Verified Mentor Badge.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => router.push('/mentor')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all"
              >
                Preview Mentor Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mentor Tier Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Select Mentor Tier & Value Proposition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setTier('Tier 2')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    tier === 'Tier 2'
                      ? 'bg-amber-950/30 border-amber-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">Tier 2: Senior University Scholar</span>
                    {tier === 'Tier 2' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400">
                    Host 45-minute small-group masterclasses (cap: 20) focused on exam strategy and subject mastery.
                  </p>
                  <div className="mt-3 text-[11px] text-amber-300 font-medium">
                    Reward: Verified leadership certificate & private scholar networking hub.
                  </div>
                </div>

                <div
                  onClick={() => setTier('Tier 3')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    tier === 'Tier 3'
                      ? 'bg-amber-950/30 border-amber-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">Tier 3: Industry Ranker / Leader</span>
                    {tier === 'Tier 3' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400">
                    Conduct 30-minute 1-on-1 portfolio audits, resume reviews, or mock interview panels.
                  </p>
                  <div className="mt-3 text-[11px] text-amber-300 font-medium">
                    Reward: Early access to pre-vetted, high-dedication talent pipeline.
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kulkarni"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email / LinkedIn URL
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="linkedin.com/in/yourprofile or email"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  University / Company & Rank
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. IISc Bangalore / GATE AIR 14"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject Expertise
                </label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Why do you want to mentor on Potential as a Passport?
              </label>
              <textarea
                rows={3}
                required
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Share your passion for democratizing higher education and guiding dedicated youth..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-500">
                5-min alignment call required before badge issuance
              </span>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Submit Mentor Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
