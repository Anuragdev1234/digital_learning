'use client';

import React, { useState } from 'react';
import { usePassportStore } from '@/lib/db/store';
import {
  Vault,
  Coins,
  Bot,
  Users2,
  Award,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Video,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TokenLedgerModal } from '@/components/shared/TokenLedgerModal';

export default function VaultPage() {
  const { currentUser, state, redeemReward } = usePassportStore();
  const [selectedReward, setSelectedReward] = useState<any | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<any | null>(null);
  const [showLedger, setShowLedger] = useState(false);

  const userBookings = state.bookings.filter((b) => b.studentId === currentUser.id);

  const handleOpenRedemption = (reward: any) => {
    setSelectedReward(reward);
    setErrorMsg(null);
    setCompletedBooking(null);

    // Pick first available slot for Tier 2 or Tier 3
    if (reward.tier === 'Tier 2') {
      const slot = state.mentorSlots.find((s) => s.mentorTier === 'Tier 2' && s.status === 'open');
      setSelectedSlotId(slot ? slot.id : '');
    } else if (reward.tier === 'Tier 3') {
      const slot = state.mentorSlots.find((s) => s.mentorTier === 'Tier 3' && s.status === 'open');
      setSelectedSlotId(slot ? slot.id : '');
    } else {
      setSelectedSlotId('');
    }
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    setIsRedeeming(true);
    setErrorMsg(null);

    try {
      const booking = redeemReward(selectedReward.id, selectedSlotId || undefined);
      setCompletedBooking(booking);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Redemption failed');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Vault className="w-4 h-4" />
            <span>Effort Currency Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">The Vault</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
            Tokens cannot be bought with money. Spend your earned Execution Tokens to unlock AI diagnostic audits, senior scholar masterclasses, and 1-on-1 industry mentorship.
          </p>
        </div>

        {/* Current Balance */}
        <div
          onClick={() => setShowLedger(true)}
          className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all self-start sm:self-auto text-right group"
        >
          <div className="text-xs text-slate-400">Available Balance</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">
            {currentUser.tokenBalance}{' '}
            <span className="text-xs text-slate-400 font-normal">TOKENS</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 group-hover:underline">
            View Ledger History →
          </div>
        </div>
      </div>

      {/* Tiered Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.rewards.map((rew) => {
          const canAfford = currentUser.tokenBalance >= rew.tokenCost;
          const isTier1 = rew.tier === 'Tier 1';
          const isTier2 = rew.tier === 'Tier 2';

          return (
            <div
              key={rew.id}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                isTier1
                  ? 'bg-slate-900 border-indigo-500/30 shadow-lg'
                  : isTier2
                  ? 'bg-slate-900 border-amber-500/30 shadow-lg'
                  : 'bg-slate-900 border-cyan-500/30 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono ${
                      isTier1
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : isTier2
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {rew.tier} • {rew.badge}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-base text-amber-400">
                    <Coins className="w-4 h-4" />
                    <span>{rew.tokenCost}</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-slate-950 border border-slate-800">
                  {isTier1 ? (
                    <Bot className="w-6 h-6 text-indigo-400" />
                  ) : isTier2 ? (
                    <Users2 className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Award className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{rew.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {rew.description}
                </p>

                {rew.capacity && (
                  <div className="text-[11px] text-slate-400 mb-4 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Capacity: Max {rew.capacity} seats per session</span>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => handleOpenRedemption(rew)}
                  disabled={!canAfford}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Redeem ({rew.tokenCost} Tokens)</span>
                    </>
                  ) : (
                    <span>Need {rew.tokenCost - currentUser.tokenBalance} More Tokens</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Redemptions & Bookings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">My Unlocked Rewards & Bookings</h2>
            <p className="text-xs text-slate-400">Proof of effort redemption history</p>
          </div>
          <span className="text-xs font-mono text-indigo-400">{userBookings.length} Active</span>
        </div>

        {userBookings.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No redemptions yet. Complete consistency streaks to redeem Tier 1, 2, or 3 rewards!
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                      {b.tier}
                    </span>
                    <span className="text-xs font-bold text-white">{b.rewardTitle}</span>
                  </div>

                  {b.mentorName && (
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>Mentor: {b.mentorName}</span>
                      <span>•</span>
                      <span>Scheduled: {new Date(b.scheduledTime || '').toLocaleString()}</span>
                    </div>
                  )}

                  {b.reportContent && (
                    <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200 whitespace-pre-line">
                      {b.reportContent}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {b.meetingUrl ? (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Room</span>
                    </a>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redemption Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Redeem {selectedReward.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReward(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {completedBooking ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white">Redemption Confirmed!</h4>
                <p className="text-xs text-slate-300">
                  {completedBooking.tier === 'Tier 1'
                    ? 'Your AI Skill Gap Diagnostic Audit has been generated below.'
                    : `Your slot with ${completedBooking.mentorName} has been booked! Meeting details generated.`}
                </p>

                {completedBooking.reportContent && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-200 whitespace-pre-line">
                    {completedBooking.reportContent}
                  </div>
                )}

                {completedBooking.meetingUrl && (
                  <a
                    href={completedBooking.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Demo Meeting Link</span>
                  </a>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Reward Cost:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      -{selectedReward.tokenCost} Tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Current Balance:</span>
                    <span className="font-bold text-white font-mono">
                      {currentUser.tokenBalance} Tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800 font-semibold">
                    <span>Remaining After:</span>
                    <span className="font-mono text-emerald-400">
                      {currentUser.tokenBalance - selectedReward.tokenCost} Tokens
                    </span>
                  </div>
                </div>

                {/* Slot Selection for Tier 2 and Tier 3 */}
                {selectedReward.tier !== 'Tier 1' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Select Available Session Slot
                    </label>
                    <div className="space-y-2">
                      {state.mentorSlots
                        .filter((s) => s.mentorTier === selectedReward.tier && s.status === 'open')
                        .map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedSlotId === slot.id
                                ? 'bg-indigo-950/40 border-indigo-500 text-white'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="font-bold text-white flex items-center justify-between">
                              <span>{slot.title}</span>
                              <span className="text-[10px] text-amber-400">
                                {slot.bookedCount}/{slot.capacity} Seats
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              Mentor: {slot.mentorName} • {new Date(slot.startAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRedeem}
                    disabled={isRedeeming}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                  >
                    {isRedeeming ? 'Debit & Fulfilling...' : 'Confirm Atomic Redemption'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <TokenLedgerModal isOpen={showLedger} onClose={() => setShowLedger(false)} />
    </div>
  );
}
