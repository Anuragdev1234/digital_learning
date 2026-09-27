'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import {
  BookOpen,
  GitPullRequest,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  UserCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WikiTopicDetailPage() {
  const params = useParams();
  const { topicId } = params;
  const { state, currentUser, proposeWikiEdit, mergeWikiEdit } = usePassportStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [proposedText, setProposedText] = useState('');
  const [changeExplanation, setChangeExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editResult, setEditResult] = useState<any | null>(null);

  const topic = state.wikiTopics.find((t) => t.id === topicId);
  const edits = state.wikiEdits.filter((e) => e.topicId === topicId);

  if (!topic) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">Wiki Topic Not Found</h2>
        <Link href="/wiki" className="text-indigo-400 mt-2 inline-block">
          ← Back to Wiki
        </Link>
      </div>
    );
  }

  const isEligibleMerger =
    currentUser.role === 'reviewer' || currentUser.role === 'mentor' || currentUser.role === 'admin';

  const handleOpenEdit = () => {
    setProposedText(
      'Common examples: Pliers, scissors, seesaws, and crowbars. In hedge shears, the handles are much longer than the blades to maximize force, whereas in tailor shears for fabric, blades are longer to maximize cutting speed.'
    );
    setChangeExplanation('Clarify difference between force multiplication in hedge shears vs speed in tailor shears.');
    setEditResult(null);
    setIsEditModalOpen(true);
  };

  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await proposeWikiEdit({
        topicId: topic.id,
        originalText: 'Common examples: Pliers, scissors, seesaws.',
        proposedText,
        changeExplanation,
      });
      setEditResult(res);
      if (res.aiStatus === 'approved') {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error proposing edit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMergeAction = (editId: string, approve: boolean) => {
    mergeWikiEdit(editId, approve, approve ? 'Clear and accurate contribution.' : 'Did not meet syllabus standards.');
    if (approve) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link
          href="/wiki"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Notes</span>
        </Link>
      </div>

      {/* Main Content & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Live Canonical Notes */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
                <span>{topic.gradeLevel}</span>
                <span>•</span>
                <span>Version {topic.version}.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{topic.title}</h1>
            </div>

            <button
              onClick={handleOpenEdit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Suggest Improvement</span>
            </button>
          </div>

          {/* Render Markdown Notes */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {topic.content}
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Last updated: {new Date(topic.lastUpdated).toLocaleDateString()}</span>
            <span>Audited under Open Educational Commons</span>
          </div>
        </div>

        {/* Right Column (1 col): Suggested Edits & Merge Requests */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Suggested Edits Queue</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{edits.length} Edits</span>
            </div>

            {edits.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No open suggested edits. Click &quot;Suggest Improvement&quot; to propose one!
              </div>
            ) : (
              <div className="space-y-4">
                {edits.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{e.editorName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
                          e.peerStatus === 'merged'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : e.peerStatus === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {e.peerStatus}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] italic">
                      &quot;{e.changeExplanation}&quot;
                    </div>

                    {/* Diff Preview */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[10px]">
                      <div className="text-rose-400 line-through truncate">- {e.originalText}</div>
                      <div className="text-emerald-400 truncate">+ {e.proposedText}</div>
                    </div>

                    {/* AI Pre-Check Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                      <Bot className="w-3 h-3" />
                      <span>AI Pre-Check: {e.aiStatus === 'approved' ? 'Passed' : e.aiReason}</span>
                    </div>

                    {/* Merge action for Reviewers */}
                    {e.peerStatus === 'pending' && isEligibleMerger && (
                      <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleMergeAction(e.id, true)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Merge (+10t)
                        </button>
                        <button
                          onClick={() => handleMergeAction(e.id, false)}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggest Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Suggest Wiki Edit</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editResult ? (
              <div className="text-center py-4 space-y-4">
                <div
                  className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                    editResult.aiStatus === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {editResult.aiStatus === 'approved' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>

                <h4 className="text-xl font-bold text-white">
                  {editResult.aiStatus === 'approved'
                    ? 'AI Pre-Check Passed!'
                    : 'Edit Flagged by AI Gate'}
                </h4>

                <div
                  className={`p-4 rounded-xl text-left text-xs ${
                    editResult.aiStatus === 'approved'
                      ? 'bg-emerald-950/30 border border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/30 border border-rose-800 text-rose-200'
                  }`}
                >
                  <div className="font-bold mb-1">AI Teacher Assistant:</div>
                  <p>{editResult.aiMessage}</p>
                </div>

                {editResult.aiStatus === 'approved' && (
                  <p className="text-xs text-slate-400">
                    Your edit has moved to the Suggested Edits Queue for peer review. You will receive +15 Tokens once an older scholar merges it!
                  </p>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProposeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Proposed Replacement Text
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposedText}
                    onChange={(e) => setProposedText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Why does this make the notes better?
                  </label>
                  <input
                    type="text"
                    required
                    value={changeExplanation}
                    onChange={(e) => setChangeExplanation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  ⚡ Evaluated by AI Auto-Filter for: Safety, Fact Relevance, and {topic.gradeLevel} appropriateness.
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
                  >
                    {isSubmitting ? 'Checking AI Filter...' : 'Submit Proposed Edit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
