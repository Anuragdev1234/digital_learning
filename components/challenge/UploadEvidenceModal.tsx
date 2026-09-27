'use client';

import React, { useState } from 'react';
import { uploadSubmissionFile } from '@/lib/storage/mockStorage';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertTriangle, X, Bot, ShieldCheck } from 'lucide-react';
import { ParentalConsentModal } from '../privacy/ParentalConsentModal';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
  gradeLevel: string;
  studentId: string;
  studentName: string;
  onSubmitSuccess: (data: {
    evidenceUrl: string;
    evidenceFilename: string;
    explanation: string;
  }) => Promise<any>;
}

export const UploadEvidenceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  challengeTitle,
  gradeLevel,
  studentId,
  studentName,
  onSubmitSuccess,
}) => {
  const isMinorStudent = gradeLevel.toLowerCase().includes('class 9') || gradeLevel.toLowerCase().includes('class 10');
  const [hasParentalConsent, setHasParentalConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [explanation, setExplanation] = useState(
    'I inspected a pair of metal kitchen scissors. The central pivot pin acts as the Fulcrum. My fingers exert Effort on the plastic looped handles, and the steel blades exert the cutting Load on cardboard. Because the handle length is greater than the blade cutting span, force is multiplied with a Mechanical Advantage > 1.'
  );
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
    size: number;
  }>({
    name: 'scissors_mechanical_advantage_hunt.jpg',
    url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600',
    size: 245000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile({
          name: file.name,
          url: reader.result as string,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetEvidence = (preset: 'scissors' | 'opener' | 'ramp') => {
    if (preset === 'scissors') {
      setSelectedFile({
        name: 'kitchen_scissors_leverage.jpg',
        url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600',
        size: 320000,
      });
      setExplanation(
        'I selected a pair of stainless steel kitchen shears. The fulcrum is at the center pivot hinge. The input effort is exerted on the handles by my fingers, while the output load cuts through thick cardstock. Because the effort arm is significantly longer than the load arm, the shear force is magnified, demonstrating a Class 1 lever.'
      );
    } else if (preset === 'opener') {
      setSelectedFile({
        name: 'bottle_opener_fulcrum.jpg',
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
        size: 198000,
      });
      setExplanation(
        'I tested a crown bottle opener. The fulcrum is the top lip resting on the bottle cap center, the load is the bottom teeth prying the bottle cap rim, and effort is lifted at the end of the long handle. This is a Class 2 lever where the load is between fulcrum and effort, yielding a mechanical advantage much greater than 1.'
      );
    } else {
      setSelectedFile({
        name: 'frictionless_inclined_ramp.jpg',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
        size: 412000,
      });
      setExplanation(
        'I built a 30-degree inclined ramp to roll a heavy toolbox onto a workbench. Instead of lifting 200 Newtons vertically against gravity, pushing up the slope requires only Effort = Load * sin(30) = 100 Newtons, trading increased distance for halved input force.'
      );
    }
  };

  const executeUploadAndVerify = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Emulate Private Storage Upload
      const fakeSubmissionId = `sub-${Date.now()}`;
      await uploadSubmissionFile({
        studentId,
        submissionId: fakeSubmissionId,
        file: {
          name: selectedFile.name,
          type: 'image/jpeg',
          size: selectedFile.size,
          base64: selectedFile.url,
        },
        currentUserId: studentId,
      });

      // 2. Call Store Submission & AI Verification
      const res = await onSubmitSuccess({
        evidenceUrl: selectedFile.url,
        evidenceFilename: selectedFile.name,
        explanation,
      });

      setAiResult(res.aiResult);

      if (res.aiResult?.status === 'approved') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMinorStudent && !hasParentalConsent) {
      setShowConsentModal(true);
      return;
    }
    await executeUploadAndVerify();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1">
              Private Storage Upload • {gradeLevel}
            </div>
            <h2 className="text-xl font-black text-white">{challengeTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form or Result */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {aiResult ? (
            /* AI Verification Result Screen */
            <div className="space-y-6 text-center py-4">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                  aiResult.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {aiResult.status === 'approved' ? (
                  <ShieldCheck className="w-9 h-9" />
                ) : (
                  <AlertTriangle className="w-9 h-9" />
                )}
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">
                  Instant AI Gate Decision (5-second contextual check)
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {aiResult.status === 'approved'
                    ? 'Temporary Passport Unlocked!'
                    : 'Revision Required Before Peer Review'}
                </h3>
                <div
                  className={`mt-4 p-4 rounded-2xl border text-sm text-left ${
                    aiResult.status === 'approved'
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                    <Bot className="w-4 h-4" />
                    <span>AI Feedback ({aiResult.reason === 'none' ? 'Passed' : `Flag: ${aiResult.reason}`})</span>
                  </div>
                  <p>{aiResult.message}</p>
                </div>
              </div>

              {aiResult.status === 'approved' ? (
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-left text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>What happens next?</span>
                  </div>
                  <p>
                    1. You now have immediate <strong>Temporary Passport</strong> access to your dashboard and full roadmap.
                  </p>
                  <p>
                    2. Your evidence has entered the <strong>Community Peer Review Queue</strong>. An older student will evaluate your work to award your <strong>Verified Passport</strong> and <strong>+50 Starting Tokens</strong>!
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Fix your explanation based on the AI feedback above and resubmit.
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-3">
                {aiResult.status === 'approved' ? (
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
                  >
                    Enter Dynamic Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => setAiResult(null)}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                  >
                    Edit & Resubmit
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Upload & Explanation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Evidence Presets / Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Step 1: Upload Photo / Video Proof-of-Work
                </label>

                {/* Quick Presets for Demo */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] text-slate-400">Demo Presets:</span>
                  <button
                    type="button"
                    onClick={() => handlePresetEvidence('scissors')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    ✂️ Kitchen Scissors (Class 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetEvidence('opener')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    🍾 Bottle Opener (Class 2)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetEvidence('ramp')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    📐 Inclined Ramp
                  </button>
                </div>

                {/* File Drop Area */}
                <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-4 bg-slate-950/40 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex items-center gap-4 text-left">
                      <img
                        src={selectedFile.url}
                        alt="Evidence Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{selectedFile.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Target: <span className="font-mono text-[11px] text-indigo-400">student-submissions/{studentId}/...</span>
                        </div>
                        <div className="text-[11px] text-indigo-400 mt-1 font-semibold">
                          Click to replace with your own photo
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6">
                      <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <div className="text-xs font-bold text-white">Click or drag photo / video evidence here</div>
                      <div className="text-[11px] text-slate-500 mt-1">PNG, JPG, MP4 up to 50MB (Stored in private bucket)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Step 2: Practical Scientific Explanation (3-5 Sentences)
                </label>
                <textarea
                  rows={4}
                  required
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Identify where the fulcrum, effort, and load are located. Explain how the mechanical advantage is calculated and why it makes work easier..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Must identify: Fulcrum (F), Load (L), Effort (E), and MA ratio.</span>
                  <span>{explanation.length} characters</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Private RLS upload + Server-side AI verification
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !explanation.trim()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>{isSubmitting ? 'Evaluating AI Gate...' : 'Submit to AI Verification'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ParentalConsentModal
        isOpen={showConsentModal}
        onConsentGiven={async () => {
          setHasParentalConsent(true);
          setShowConsentModal(false);
          await executeUploadAndVerify();
        }}
        onCancel={() => setShowConsentModal(false)}
        studentName={studentName}
        gradeLevel={gradeLevel}
      />
    </div>
  );
};
