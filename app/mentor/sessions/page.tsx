'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Users2, Video, Clock, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';

export default function MentorSessionsPage() {
  const { currentUser, state } = usePassportStore();

  const sessions = state.bookings.filter(
    (b) => b.mentorId === currentUser.id || currentUser.role === 'admin'
  );

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
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Users2 className="w-4 h-4" />
            <span>Interactive Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Booked Mentor Sessions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conduct 45-minute scholar masterclasses and 30-minute 1-on-1 portfolio audits.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl text-xs text-slate-500">
            No student bookings yet for your scheduled slots.
          </div>
        ) : (
          sessions.map((ses) => (
            <div
              key={ses.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                    {ses.tier}
                  </span>
                  <span className="text-sm font-bold text-white">{ses.rewardTitle}</span>
                </div>

                <div className="text-xs text-slate-300">
                  Student: <strong className="text-white">{ses.studentName}</strong>
                </div>

                <div className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ses.scheduledTime || '').toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                    <span>{ses.tokensSpent} Tokens Redeemed</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {ses.meetingUrl ? (
                  <Link
                    href={`/sessions/${ses.id}`}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Video Room</span>
                  </Link>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
