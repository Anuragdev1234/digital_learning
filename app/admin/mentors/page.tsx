'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  Users2,
  ArrowLeft,
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminMentorsPage() {
  const { state, approveMentor, rejectMentor } = usePassportStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');

  const allMentors = state.profiles.filter((p) => p.role === 'mentor');
  const pendingMentors = allMentors.filter((m) => m.credentialStatus === 'pending');
  const verifiedMentors = allMentors.filter((m) => m.credentialStatus === 'verified');

  const tier2Count = verifiedMentors.filter((m) => m.mentorTier === 'Tier 2').length;
  const tier3Count = verifiedMentors.filter((m) => m.mentorTier === 'Tier 3').length;

  const handleApprove = (id: string) => {
    approveMentor(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

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

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Users2 className="w-4 h-4" />
            <span>Mentor Recruitment & Vetting Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Mentor Accreditation Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review applicant credentials, verify affiliations, and issue Verified Mentor Badges.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <div className="text-xs font-mono text-amber-400 font-bold">{tier2Count}</div>
            <div className="text-[10px] text-slate-400">Tier 2 Scholars</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
            <div className="text-xs font-mono text-indigo-400 font-bold">{tier3Count}</div>
            <div className="text-[10px] text-slate-400">Tier 3 Leaders</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Applications ({pendingMentors.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'verified'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Network ({verifiedMentors.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingMentors.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400/60" />
              <h3 className="text-sm font-bold text-white">All applications reviewed</h3>
              <p className="text-xs text-slate-500 mt-1">
                No pending mentor candidates awaiting accreditation.
              </p>
            </div>
          ) : (
            pendingMentors.map((m) => (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {m.mentorTier}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-medium">
                          {m.email}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-white">{m.name}</h2>
                      <div className="text-xs text-amber-400 font-medium">{m.specialization}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => rejectMentor(m.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(m.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>Approve & Issue Badge</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">Affiliation & Motivation Statement:</div>
                  <p className="leading-relaxed">&quot;{m.bio}&quot;</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedMentors.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400/50"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {m.mentorTier}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Mentor</span>
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white">{m.name}</h2>
                    <div className="text-xs text-slate-400">{m.specialization}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed">{m.bio}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Account Status: Active</span>
                <span className="font-mono text-amber-400">{m.tokenBalance} Tokens</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
