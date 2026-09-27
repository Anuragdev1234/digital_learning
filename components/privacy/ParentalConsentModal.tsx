'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConsentGiven: () => void;
  onCancel: () => void;
  studentName: string;
  gradeLevel: string;
}

export const ParentalConsentModal: React.FC<Props> = ({
  isOpen,
  onConsentGiven,
  onCancel,
  studentName,
  gradeLevel,
}) => {
  const [agreedCOPPA, setAgreedCOPPA] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedCOPPA) {
      setError('Please certify parental consent to continue.');
      return;
    }
    if (!parentName.trim() || !parentEmail.trim()) {
      setError('Please provide parent/guardian details for compliance records.');
      return;
    }
    onConsentGiven();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              Minor Student Privacy Safeguard ({gradeLevel})
            </div>
            <h2 className="text-lg font-black text-white">Parent / Guardian Consent</h2>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Private Storage & Identity Isolation Guarantee</span>
          </div>
          <p>
            Under educational privacy guidelines for minor students ({studentName}), proof-of-work media (photos of levers, pulleys, or circuit boards) is strictly stored in an isolated, private RLS-restricted storage bucket:
          </p>
          <div className="p-2 rounded-lg bg-slate-900 font-mono text-[11px] text-indigo-300 break-all">
            student-submissions/&#123;student_id&#125;/&#123;submission_id&#125;/...
          </div>
          <p className="text-[11px] text-slate-400">
            • Photos are never posted publicly or shared with third-party advertisers.<br />
            • Accessible only to authenticated community peer reviewers and vetted senior mentors.<br />
            • Parents retain right of immediate revocation and media deletion.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g., Rajesh Sharma"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Parent Email / Contact
              </label>
              <input
                type="email"
                required
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedCOPPA}
              onChange={(e) => setAgreedCOPPA(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-300 leading-snug">
              I certify that I am the parent or legal guardian of {studentName}, and I grant permission for their academic proof-of-work project media to be uploaded into private cloud storage for peer review.
            </span>
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Proceed to Upload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
