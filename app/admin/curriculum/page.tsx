'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Layers, ArrowLeft, Plus, CheckCircle2, Clock, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminCurriculumPage() {
  const { state, addTrack } = usePassportStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Class 11');
  const [phase, setPhase] = useState<'School Foundation' | 'Higher Ed & Govt Exams'>('School Foundation');
  const [description, setDescription] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [evidenceRequirement, setEvidenceRequirement] = useState('');
  const [isInteractive, setIsInteractive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrack({
      title,
      gradeLevel,
      phase,
      description,
      challengeTitle,
      challengeDescription,
      evidenceRequirement,
      isInteractive,
      totalModules: 4,
    });
    setIsModalOpen(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    // Reset form
    setTitle('');
    setDescription('');
    setChallengeTitle('');
    setChallengeDescription('');
    setEvidenceRequirement('');
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

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Curriculum Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Academic Tracks & Modules</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage published tracks, 15-minute daily lesson assets, and practical mini-projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Track</span>
        </button>
      </div>

      <div className="space-y-6">
        {state.tracks.map((track) => (
          <div key={track.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-400">{track.gradeLevel}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{track.phase}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{track.title}</h2>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-mono font-bold uppercase ${
                  track.isInteractive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {track.isInteractive ? 'Interactive Demo Track' : 'Published Track'}
              </span>
            </div>

            <p className="text-xs text-slate-300">{track.description}</p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-white">Challenge: {track.challengeTitle}</div>
              <div className="text-slate-400">Requirement: {track.evidenceRequirement}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Track Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1">
                  Curriculum Engine
                </div>
                <h2 className="text-lg font-black text-white">Publish New Academic Track</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Track Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Class 11 - Optics & Wave Theory"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Grade Level</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Degree / Govt Exams">Degree / Govt Exams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Academic Phase</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="School Foundation">School Foundation</option>
                    <option value="Higher Ed & Govt Exams">Higher Ed & Govt Exams</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="interactive"
                    checked={isInteractive}
                    onChange={(e) => setIsInteractive(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="interactive" className="font-bold text-slate-300 cursor-pointer">
                    Enable Interactive Physics Simulator
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Track Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core conceptual goals of this learning track..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Challenge Title</label>
                  <input
                    type="text"
                    required
                    value={challengeTitle}
                    onChange={(e) => setChallengeTitle(e.target.value)}
                    placeholder="e.g. The Pinhole Camera Experiment"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Evidence Requirement</label>
                  <input
                    type="text"
                    required
                    value={evidenceRequirement}
                    onChange={(e) => setEvidenceRequirement(e.target.value)}
                    placeholder="e.g. Photo of inverted ray image + 3 sentences"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Mini-Project Instructions</label>
                <textarea
                  rows={2}
                  required
                  value={challengeDescription}
                  onChange={(e) => setChallengeDescription(e.target.value)}
                  placeholder="Detail the exact steps and observations the student must complete..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Curriculum Track</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
