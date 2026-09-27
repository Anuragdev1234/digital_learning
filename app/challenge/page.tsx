'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  Flame,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Coins,
  Bot,
} from 'lucide-react';
import { UploadEvidenceModal } from '@/components/challenge/UploadEvidenceModal';
import { PassportBadge } from '@/components/shared/PassportBadge';
import confetti from 'canvas-confetti';

export default function ChallengeWallPage() {
  const { currentUser, state, completeLesson, submitProject } = usePassportStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  // Active track
  const activeTrack =
    state.tracks.find((t) => t.id === currentUser.trackId) || state.tracks[0];

  // Active module & lesson for the consistency challenge
  const activeModule = state.modules[2] || state.modules[0];
  const activeLesson = activeModule.lessons[0] || state.modules[0].lessons[0];

  const hasCompletedStreak = currentUser.streakDays >= 1;
  const latestSubmission = state.submissions.find((s) => s.studentId === currentUser.id);

  const handleCompleteDailyLesson = () => {
    completeLesson(activeLesson.id, activeTrack.id);
    setLessonFinished(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>The Effort Paywall</span>
            </span>
            <PassportBadge status={currentUser.passportStatus} size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            The Challenge Wall
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Instead of a credit card, you unlock the platform by proving dedication. Complete the consistency streak and submit your practical proof-of-work to earn your Passport.
          </p>
        </div>
      </div>

      {/* Two-Part Effort Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PART A: The Consistency Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Part A: The Consistency Streak</h2>
                  <p className="text-xs text-slate-400">15-minute daily foundational study</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-bold font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-xs">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{currentUser.streakDays} Days</span>
              </div>
            </div>

            {/* Lesson Reader Card */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between text-xs text-indigo-400 mb-2">
                <span className="font-semibold">{activeTrack.gradeLevel} • {activeModule.title}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>15 Mins</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{activeLesson.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {activeLesson.content}
              </p>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-xs text-indigo-200">
                <span className="font-semibold text-amber-300">Key Principle:</span>{' '}
                {activeLesson.summary}
              </div>
            </div>
          </div>

          <div>
            {activeLesson.isCompleted || lessonFinished ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Daily Execution Logged! (+10 Tokens Credited)</span>
                </div>
                <span className="text-[11px] text-slate-400">Streak Maintained</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteDailyLesson}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Complete 15-Minute Lesson (+10 Tokens)</span>
              </button>
            )}
          </div>
        </div>

        {/* PART B: The Practical Mini-Project */}
        <div
          className={`bg-slate-900 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl ${
            hasCompletedStreak
              ? 'border-indigo-500/50 shadow-indigo-950/20'
              : 'border-slate-800 opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    hasCompletedStreak
                      ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  B
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Part B: The Practical Mini-Project</h2>
                  <p className="text-xs text-slate-400">Real-world application task</p>
                </div>
              </div>

              {hasCompletedStreak ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>UNLOCKED</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked by Streak</span>
                </span>
              )}
            </div>

            {/* Project Details */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 mb-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-amber-400 mb-1">Target Task</div>
                <h3 className="text-lg font-black text-white">{activeTrack.challengeTitle}</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeTrack.challengeDescription}
              </p>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200">Required Proof-of-Work:</div>
                <div>• {activeTrack.evidenceRequirement}</div>
                <div>• Private Storage upload + 5-sec AI validation check</div>
              </div>
            </div>
          </div>

          <div>
            {latestSubmission ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Submission Status:</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                      latestSubmission.status === 'peer_verified'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : latestSubmission.status === 'ai_approved'
                        ? 'bg-amber-500/20 text-amber-300'
                        : latestSubmission.status === 'ai_rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {latestSubmission.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  &quot;{latestSubmission.explanation}&quot;
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <Link
                    href={`/submissions/${latestSubmission.id}`}
                    className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Submission Evidence & AI Log</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    New Attempt
                  </button>
                </div>
              </div>
            ) : hasCompletedStreak ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>Upload Evidence & Run AI Verification</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                Complete today&apos;s 15-minute lesson in Part A to unlock your practical mini-project!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Evidence Modal */}
      <UploadEvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challengeTitle={activeTrack.challengeTitle}
        gradeLevel={activeTrack.gradeLevel}
        studentId={currentUser.id}
        studentName={currentUser.name}
        onSubmitSuccess={async (data) => {
          return await submitProject({
            challengeTitle: activeTrack.challengeTitle,
            gradeLevel: activeTrack.gradeLevel,
            evidenceUrl: data.evidenceUrl,
            evidenceFilename: data.evidenceFilename,
            explanation: data.explanation,
          });
        }}
      />
    </div>
  );
}
