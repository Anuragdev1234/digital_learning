'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  FileCheck2,
  Bot,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Clock,
  UserCheck,
  MessageSquare,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { state, currentUser, reviewSubmission } = usePassportStore();

  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject'>('approve');
  const [feedback, setFeedback] = useState(
    'Clear and precise identification of fulcrum and load arms. Your mathematical calculation of Mechanical Advantage matches experimental values. Approved for Verified Passport!'
  );
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const submission = state.submissions.find((s) => s.id === id);

  if (!submission) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">Submission Not Found</h2>
        <Link href="/submissions" className="text-indigo-400 mt-2 inline-block">
          ← Back to submissions
        </Link>
      </div>
    );
  }

  const isEligibleReviewer =
    currentUser.role === 'reviewer' || currentUser.role === 'mentor' || currentUser.role === 'admin';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    reviewSubmission({
      submissionId: submission.id,
      decision: reviewDecision,
      feedback,
    });

    setIsSubmittingReview(false);

    if (reviewDecision === 'approve') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          href="/submissions"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-indigo-400 font-semibold">
                {submission.gradeLevel}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Student: {submission.studentName}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{submission.challengeTitle}</h1>
            <div className="mt-1 text-[11px] font-mono text-slate-400">
              Storage Path: <span className="text-amber-400">student-submissions/{submission.studentId}/{submission.id}/{submission.evidenceFilename}</span>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold font-mono uppercase self-start sm:self-auto ${
              submission.status === 'peer_verified'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : submission.status === 'ai_approved'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : submission.status === 'ai_rejected'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {submission.status.replace('_', ' ')}
          </span>
        </div>

        {/* Evidence Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Uploaded Proof-of-Work
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
              <img
                src={submission.evidenceUrl}
                alt={submission.evidenceFilename}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span>{submission.evidenceFilename}</span>
              <span>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Student&apos;s Scientific Explanation
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[140px] flex flex-col justify-between">
              <p>&quot;{submission.explanation}&quot;</p>
              <div className="text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-900">
                Verified against physics syllabus criteria.
              </div>
            </div>
          </div>
        </div>

        {/* AI Gate Decision Result */}
        {submission.aiResult && (
          <div
            className={`p-5 rounded-2xl border ${
              submission.aiResult.status === 'approved'
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>Instant AI Gate Decision (Automated Contextual Check)</span>
              </div>
              <span className="text-[11px] font-mono opacity-80">
                Reason: {submission.aiResult.reason}
              </span>
            </div>
            <p className="text-xs sm:text-sm">{submission.aiResult.message}</p>
          </div>
        )}

        {/* Peer Review Status / Result */}
        {submission.status === 'peer_verified' ? (
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verified by Community Peer: {submission.reviewerName}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">+50 Tokens Awarded</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              &quot;{submission.reviewerFeedback}&quot;
            </p>
          </div>
        ) : submission.status === 'ai_approved' && !isEligibleReviewer ? (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white">Pending Community Peer Review:</span> This submission is currently in the review queue. Switch to the <strong>Vikram (Reviewer)</strong> demo persona in the top toolbar to simulate grading this project!
            </div>
          </div>
        ) : null}

        {/* Peer Review Form for Reviewers */}
        {submission.status === 'ai_approved' && isEligibleReviewer && (
          <div className="p-6 rounded-3xl bg-slate-950 border border-indigo-500/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Senior Peer Review Evaluation</h3>
                <p className="text-xs text-slate-400">
                  Reviewing as: <strong>{currentUser.name}</strong> • Earn +25 Execution Tokens upon completion
                </p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Review Decision
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('approve')}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      reviewDecision === 'approve'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Approve (Issue Verified Passport)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('reject')}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      reviewDecision === 'reject'
                        ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Request Revision
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Constructive Peer Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Submit Peer Review (+25 Tokens for Reviewer)</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
