'use client';

import React from 'react';
import Link from 'next/link';
import { usePassportStore } from '@/lib/db/store';
import { Vault, ArrowLeft, Coins, Award, Users2, Bot } from 'lucide-react';

export default function AdminRewardsPage() {
  const { state } = usePassportStore();

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
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Vault className="w-4 h-4" />
            <span>Vault Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tiered Rewards & Token Pricing</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explicit demo pricing: Tier 1 = 100t, Tier 2 = 300t, Tier 3 = 1,000t.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.rewards.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {r.tier}
                </span>
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span>{r.tokenCost} Tokens</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-2">{r.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Claimed: {r.claimedCount} times</span>
              <span className="text-emerald-400 font-medium">Catalog Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
