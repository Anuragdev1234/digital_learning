'use client';

import React from 'react';
import { usePassportStore } from '@/lib/db/store';
import { Coins, ArrowUpRight, ArrowDownLeft, X, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenLedgerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, currentUser } = usePassportStore();

  if (!isOpen) return null;

  const userTransactions = state.tokenLedger.filter((t) => t.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Execution Token Ledger</h2>
              <p className="text-xs text-slate-400">Transparent proof-of-effort transaction history</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Current Balance</div>
              <div className="text-xl font-black text-amber-400 font-mono">
                {currentUser.tokenBalance.toLocaleString()} <span className="text-xs font-normal">TOKENS</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ledger List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {userTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Coins className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No transactions yet. Complete lessons or submit mini-projects to earn tokens!</p>
            </div>
          ) : (
            userTransactions.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCredit
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : tx.type === 'strike_fine'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : tx.type === 'strike_fine' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{tx.description}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="uppercase tracking-wider font-mono text-[10px] text-indigo-400">
                          {tx.type.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <span>{new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-mono font-bold text-sm ${
                      isCredit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCredit ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Tokens cannot be purchased. Only earned through verified academic effort.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
