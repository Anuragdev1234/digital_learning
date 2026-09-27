'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingAIMentor } from '../ai/FloatingAIMentor';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isPublicPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/how-it-works' ||
    pathname === '/mentor-apply';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Demo Persona Switcher Banner */}
      <RoleSwitcher />

      {/* Main Header */}
      <Header />

      {/* Body Layout */}
      {isPublicPage ? (
        <main className="flex-1 flex flex-col">{children}</main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
        </div>
      )}

      {/* Floating AI Mentor */}
      <FloatingAIMentor />
    </div>
  );
};
