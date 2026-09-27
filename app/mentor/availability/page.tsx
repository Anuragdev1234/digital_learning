'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { CalendarDays, Plus, Clock, Users2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MentorAvailabilityPage() {
  const { currentUser, state, addMentorSlot } = usePassportStore();
  const [title, setTitle] = useState('Mechanics Masterclass: Force Multiplication in Real Systems');
  const [slotType, setSlotType] = useState<'masterclass' | 'one_on_one'>('masterclass');
  const [startDate, setStartDate] = useState('2026-10-05T18:00');
  const [isCreated, setIsCreated] = useState(false);

  const mySlots = state.mentorSlots.filter((s) => s.mentorId === currentUser.id);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = slotType === 'masterclass' ? 20 : 1;
    const startIso = new Date(startDate).toISOString();
    const endIso = new Date(new Date(startDate).getTime() + (slotType === 'masterclass' ? 45 : 30) * 60000).toISOString();

    addMentorSlot({
      title,
      startAt: startIso,
      endAt: endIso,
      capacity,
    });

    setIsCreated(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setIsCreated(false), 3000);
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
            <CalendarDays className="w-4 h-4" />
            <span>Schedule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Mentor Availability & Slots</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish session slots for students who have earned required Execution Tokens.
          </p>
        </div>
      </div>

      {/* Create New Slot Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-400" />
          <span>Publish New Session Slot</span>
        </h2>

        {isCreated && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>New slot published to The Vault catalog!</span>
          </div>
        )}

        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Session Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Session Format
              </label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="masterclass">Tier 2: Group Masterclass (45 mins, Cap 20)</option>
                <option value="one_on_one">Tier 3: 1-on-1 Portfolio / Mock (30 mins, Cap 1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
          >
            Publish Slot to Platform
          </button>
        </form>
      </div>

      {/* Existing Slots List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white">Your Scheduled Slots</h3>
        {mySlots.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No slots published yet. Use the form above to add a slot.
          </div>
        ) : (
          mySlots.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-bold">
                    {s.mentorTier}
                  </span>
                  <span className="text-sm font-bold text-white">{s.title}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(s.startAt).toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5" />
                    <span>
                      {s.bookedCount} / {s.capacity} seats booked
                    </span>
                  </span>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase font-mono ${
                  s.status === 'open'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
