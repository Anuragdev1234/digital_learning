'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePassportStore } from '@/lib/db/store';
import {
  LayoutDashboard,
  Flame,
  Milestone,
  FileCheck2,
  BookOpen,
  Vault,
  Bot,
  CalendarDays,
  Users2,
  Settings2,
  Award,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = usePassportStore();

  const studentNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Challenge Wall', href: '/challenge', icon: Flame },
    { label: 'My Milestones', href: '/milestones', icon: Milestone },
    { label: 'My Submissions', href: '/submissions', icon: FileCheck2 },
    { label: 'Community Wiki', href: '/wiki', icon: BookOpen },
    { label: 'The Vault', href: '/vault', icon: Vault },
    { label: 'AI Co-Pilot', href: '/ai-mentor', icon: Bot },
  ];

  const mentorNavItems = [
    { label: 'Mentor Hub', href: '/mentor', icon: Award },
    { label: 'Slot Availability', href: '/mentor/availability', icon: CalendarDays },
    { label: 'My Sessions', href: '/mentor/sessions', icon: Users2 },
    { label: 'Peer Review Queue', href: '/mentor/reviews', icon: FileCheck2 },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', href: '/admin', icon: Settings2 },
    { label: 'Curriculum Manager', href: '/admin/curriculum', icon: Layers },
    { label: 'Submission Queue', href: '/admin/submissions', icon: FileCheck2 },
    { label: 'Mentor Center', href: '/admin/mentors', icon: Users2 },
    { label: 'Wiki Moderation', href: '/admin/wiki', icon: BookOpen },
    { label: 'Rewards & Pricing', href: '/admin/rewards', icon: Vault },
    { label: 'Strike Moderation', href: '/admin/strikes', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Student Navigation */}
      <div className="p-4 flex-1 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Student Ecosystem
          </div>
          <nav className="space-y-1">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mentor / Reviewer Section */}
        {(currentUser.role === 'mentor' || currentUser.role === 'reviewer' || currentUser.role === 'admin') && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center justify-between">
              <span>Mentorship Engine</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                {currentUser.mentorTier || (currentUser.role === 'reviewer' ? 'Reviewer' : 'Admin')}
              </span>
            </div>
            <nav className="space-y-1">
              {mentorNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Admin Section */}
        {currentUser.role === 'admin' && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-rose-400/90 uppercase tracking-wider flex items-center justify-between">
              <span>Admin Control Center</span>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                P0 Control
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Effort Guarantee Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-900/40 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Cost Ecosystem</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Access is never bought. Demonstrated consistency and practical proof-of-work unlock every milestone.
          </p>
        </div>
      </div>
    </aside>
  );
};
