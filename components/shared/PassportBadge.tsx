'use client';

import React from 'react';
import { PassportStatus } from '@/lib/types';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

interface Props {
  status: PassportStatus;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const PassportBadge: React.FC<Props> = ({ status, size = 'md', showDetails = false }) => {
  const config = {
    none: {
      label: 'Passport Locked',
      color: 'bg-slate-800/80 text-slate-400 border-slate-700',
      badgeColor: 'bg-slate-700 text-slate-300',
      icon: Lock,
      description: 'Complete consistency streak & mini-project to unlock Temporary Passport.',
    },
    temporary: {
      label: 'Temporary Passport',
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: ShieldAlert,
      description: 'AI verification passed. Queued for community peer review.',
    },
    verified: {
      label: 'Verified Passport',
      color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      icon: ShieldCheck,
      description: 'Community peer verified. Full access to Vault and advanced masterclasses.',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  }[size];

  return (
    <div className="inline-flex flex-col">
      <div
        className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${config.color} ${sizeClasses}`}
      >
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        <span>{config.label}</span>
        {status === 'verified' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
      </div>
      {showDetails && (
        <span className="text-[11px] text-slate-400 mt-1 max-w-xs">{config.description}</span>
      )}
    </div>
  );
};
