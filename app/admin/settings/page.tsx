'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings2, ArrowLeft, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminSettingsPage() {
  const [tier1Cost, setTier1Cost] = useState(100);
  const [tier2Cost, setTier2Cost] = useState(300);
  const [tier3Cost, setTier3Cost] = useState(1000);
  const [lessonReward, setLessonReward] = useState(10);
  const [submissionReward, setSubmissionReward] = useState(50);
  const [reviewReward, setReviewReward] = useState(25);
  const [wikiReward, setWikiReward] = useState(15);
  const [strikeFine, setStrikeFine] = useState(50);
  const [timeoutHours, setTimeoutHours] = useState(48);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
            <Settings2 className="w-4 h-4" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">System Settings & Policies</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure token economy pricing, reward thresholds, and moderation strike policies.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {isSaved && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Platform configuration updated across ecosystem!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Token Earning Parameters */}
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Token Earning Rates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Daily 15-Min Lesson</label>
                <input
                  type="number"
                  value={lessonReward}
                  onChange={(e) => setLessonReward(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mini-Project Verification</label>
                <input
                  type="number"
                  value={submissionReward}
                  onChange={(e) => setSubmissionReward(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Peer Review Compensation</label>
                <input
                  type="number"
                  value={reviewReward}
                  onChange={(e) => setReviewReward(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Wiki Edit Merge Reward</label>
                <input
                  type="number"
                  value={wikiReward}
                  onChange={(e) => setWikiReward(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Vault Redemption Pricing */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              The Vault Canonical Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tier 1: AI Diagnostic Audit</label>
                <input
                  type="number"
                  value={tier1Cost}
                  onChange={(e) => setTier1Cost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tier 2: Scholar Masterclass</label>
                <input
                  type="number"
                  value={tier2Cost}
                  onChange={(e) => setTier2Cost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tier 3: 1-on-1 Mentorship</label>
                <input
                  type="number"
                  value={tier3Cost}
                  onChange={(e) => setTier3Cost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Strike Moderation Policy */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Strike Policy Penalties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Strike Automatic Fine (Tokens)</label>
                <input
                  type="number"
                  value={strikeFine}
                  onChange={(e) => setStrikeFine(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Timeout Suspension Duration (Hours)</label>
                <input
                  type="number"
                  value={timeoutHours}
                  onChange={(e) => setTimeoutHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-slate-500">Atomic ledger constraints strictly enforced</span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save System Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
