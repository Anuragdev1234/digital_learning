'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Flame, Coins, Bell, Compass, ShieldCheck } from 'lucide-react';
import { TokenLedgerModal } from '../shared/TokenLedgerModal';
import { PassportBadge } from '../shared/PassportBadge';

export const Header: React.FC = () => {
  const { currentUser, state } = usePassportStore();
  const [showLedger, setShowLedger] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadNotifs = state.notifications.filter((n) => n.userId === currentUser.id && !n.read);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                  Potential <span className="text-amber-400 font-light">as a</span> Passport
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide">
                  Many traditions. One living India.
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Center */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"
              title="Consecutive Days of Active Study"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{currentUser.streakDays} Day Streak</span>
            </div>

            {/* Token Balance Button (Opens Ledger) */}
            <button
              onClick={() => setShowLedger(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all shadow-sm group"
              title="Click to view auditable Execution Token Ledger"
            >
              <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-mono text-sm">{currentUser.tokenBalance}</span>
              <span className="text-[10px] text-amber-500/80 font-normal hidden sm:inline">Tokens</span>
            </button>

            {/* Passport Badge Pill */}
            <div className="hidden md:block">
              <PassportBadge status={currentUser.passportStatus} size="sm" />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-white">Notifications</span>
                    <span className="text-[11px] text-slate-500">{unreadNotifs.length} unread</span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                    {state.notifications.filter((n) => n.userId === currentUser.id).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">No notifications yet</div>
                    ) : (
                      state.notifications
                        .filter((n) => n.userId === currentUser.id)
                        .slice(0, 5)
                        .map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                          >
                            <div className="font-semibold text-slate-200">{notif.title}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5">{notif.message}</div>
                            <div className="text-[10px] text-slate-600 mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40 object-cover"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-indigo-400 capitalize">{currentUser.role}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <TokenLedgerModal isOpen={showLedger} onClose={() => setShowLedger(false)} />
    </>
  );
};
