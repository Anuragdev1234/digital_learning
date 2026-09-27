'use client';

import React, { useState } from 'react';
import { usePassportStore } from '@/lib/db/store';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Bot,
  Coins,
  ShieldAlert,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, currentUser } = usePassportStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const userNotifications = state.notifications.filter((n) => n.userId === currentUser.id);
  const displayList = filter === 'unread' ? userNotifications.filter((n) => !n.read) : userNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'ai_verification':
        return <Bot className="w-4 h-4 text-cyan-400" />;
      case 'peer_review':
        return <Award className="w-4 h-4 text-indigo-400" />;
      case 'passport':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'strike':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Coins className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Notifications Center</h2>
              <p className="text-xs text-slate-400">Real-time alerts & lifecycle triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({userNotifications.filter((n) => !n.read).length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {displayList.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No notifications to display right now.</p>
            </div>
          ) : (
            displayList.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-950 border-indigo-500/30 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="mt-2 text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                      {notif.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500">
            Connected to real-time notification engine • Recipient: {currentUser.name}
          </span>
        </div>
      </div>
    </div>
  );
};
