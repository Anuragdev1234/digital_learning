'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import { GraduationCap, Target, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, state, completeOnboarding } = usePassportStore();

  const [selectedLevel, setSelectedLevel] = useState('Class 10');
  const [selectedTrack, setSelectedTrack] = useState('track-class10-machines');
  const [selectedGoal, setSelectedGoal] = useState('Class 10 Board Distinction & Practical Engineering Aptitude');

  const gradeLevels = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'B.Sc.'];

  const goals = [
    { title: 'Class 10 Board Distinction & Practical Engineering Aptitude', desc: 'Focus on intuition, force multiplication, and school syllabus mastery' },
    { title: 'JEE / NEET Competitive Exam Foundation', desc: 'Rigorous problem solving, free-body diagrams, and vector physics' },
    { title: 'Research & Advanced Science Olympiad', desc: 'Paper summaries, scientific method, and quantum abstractions' },
    { title: 'Practical Engineering & Project Portfolio', desc: 'Building physical prototypes and earning verified mentor recommendations' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      gradeLevel: selectedLevel,
      trackId: selectedTrack,
      goal: selectedGoal,
    });
    router.push('/challenge');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Step 1: Academic Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, {currentUser.name}! Shape Your Passport.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            The platform adapts its roadmaps, challenges, and AI mentor tone based on your academic phase.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Academic Level */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Select Your Academic Phase</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {gradeLevels.map((lvl) => {
                const isSelected = selectedLevel === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl);
                      if (lvl === 'Class 10') setSelectedTrack('track-class10-machines');
                      else if (lvl === 'Class 9') setSelectedTrack('track-class9-sound');
                      else if (lvl === 'Class 11') setSelectedTrack('track-class11-newton');
                      else if (lvl === 'Class 12') setSelectedTrack('track-class12-photoelectric');
                      else setSelectedTrack('track-bsc-quantum');
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Track Confirmation */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Active Focus Track
            </label>
            <div className="space-y-3">
              {state.tracks.map((track) => {
                const isSelected = selectedTrack === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                        : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{track.title}</span>
                        {track.isInteractive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                            Interactive Track
                          </span>
                        )}
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{track.description}</p>
                    <div className="mt-2 text-[11px] text-amber-400/90 font-medium">
                      Challenge: {track.challengeTitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Primary Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Define Your North Star Goal</span>
            </label>
            <div className="space-y-2.5">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.title;
                return (
                  <div
                    key={g.title}
                    onClick={() => setSelectedGoal(g.title)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{g.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-normal">{g.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Next: The Challenge Wall (Consistency Streak)</span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Unlock Challenge Wall</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
