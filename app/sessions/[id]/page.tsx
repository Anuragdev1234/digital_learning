'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  Users,
  MessageSquare,
  Award,
} from 'lucide-react';

export default function SessionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { state, currentUser } = usePassportStore();
  const sessionId = params.id as string;

  const session = state.bookings.find((b) => b.id === sessionId) || state.bookings[0];
  const submission = state.submissions.find((s) => s.studentId === session?.studentId) || state.submissions[0];

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'evidence'>('video');

  // Format meeting room name for Jitsi Meet
  const roomName = `potential-passport-${sessionId || 'masterclass'}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(
    currentUser.name
  )}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {session?.tier || 'Tier 2'}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Call Active</span>
              </span>
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">{session?.rewardTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800 font-mono">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Room: {roomName}</span>
          </div>

          <a
            href={`https://meet.jit.si/${roomName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Video Frame + Student Evidence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Embedded Jitsi Video Call */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="w-full h-full border-0 bg-slate-950"
            title="Potential as a Passport Mentorship Video Call"
          />

          {/* Quick Fallback Note */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by 100% Free Open-Source Jitsi Meet WebRTC</span>
            <span>Room ID: {sessionId}</span>
          </div>
        </div>

        {/* Right Column: Student Evidence & Session Information */}
        <div className="lg:col-span-4 space-y-5">
          {/* Session Details Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Session Participant
              </span>
              <span className="font-mono text-xs text-amber-400 font-bold">
                {session?.tokensSpent || 300} Tokens
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                {session?.studentName?.[0] || 'S'}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{session?.studentName}</div>
                <div className="text-xs text-slate-400">
                  Mentor: <strong className="text-slate-200">{session?.mentorName}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{new Date(session?.scheduledTime || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>45-Minute Dedicated Block</span>
              </div>
            </div>
          </div>

          {/* Student Proof-of-Work Project Evidence */}
          {submission && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Student&apos;s Mini-Project Evidence</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  {submission.status.replace('_', ' ')}
                </span>
              </div>

              <img
                src={submission.evidenceUrl}
                alt={submission.evidenceFilename}
                className="w-full h-36 rounded-2xl object-cover border border-slate-800"
              />

              <div>
                <h4 className="text-xs font-bold text-white">{submission.challengeTitle}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed italic">
                  &quot;{submission.explanation}&quot;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Stored in Private RLS Bucket</span>
                <Link
                  href={`/submissions/${submission.id}`}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Full Submission Audit →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
