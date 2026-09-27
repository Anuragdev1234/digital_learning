'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  Award,
  CalendarDays,
  Users2,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  Video,
} from 'lucide-react';

export default function MentorDashboardPage() {
  const { currentUser, state } = usePassportStore();

  const isMentor = currentUser.role === 'mentor';
  const mentorSlots = state.mentorSlots.filter((s) => s.mentorId === currentUser.id);
  const mentorBookings = state.bookings.filter((b) => b.mentorId === currentUser.id);
  const pendingReviews = state.submissions.filter((s) => s.status === 'ai_approved');

  return (
    <div className="space-y-8">
      {/* Mentor Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                {currentUser.mentorTier || 'Tier 2 Scholar'}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Mentor</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {currentUser.bio || 'Senior scholar providing high-leverage guidance for students proving active effort.'}
            </p>
          </div>
        </div>

        <Link
          href="/mentor/availability"
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <CalendarDays className="w-4 h-4" />
          <span>Publish New Availability</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Slots</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">
            {mentorSlots.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled masterclasses & 1-on-1s</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Bookings</div>
          <div className="text-3xl font-black text-indigo-400 font-mono mt-1">
            {mentorBookings.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed student seats</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review Queue</div>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
            {pendingReviews.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Submissions awaiting grading</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accredited Hours</div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            18.5
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified volunteer leadership</div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Manage Slot Availability</h3>
            <p className="text-xs text-slate-400 mt-1">
              Create 45-minute group masterclass slots (max 20 capacity) or 30-minute 1-on-1 portfolio review slots.
            </p>
          </div>
          <Link
            href="/mentor/availability"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Open Availability Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Upcoming Sessions</h3>
            <p className="text-xs text-slate-400 mt-1">
              View registered students, join meeting room placeholders, and log session completion.
            </p>
          </div>
          <Link
            href="/mentor/sessions"
            className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Peer Review Queue</h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify real-world proof-of-work submitted by students to unlock their Verified Passports.
            </p>
          </div>
          <Link
            href="/mentor/reviews"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Open Review Queue ({pendingReviews.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
