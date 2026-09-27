'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePassportStore } from '@/lib/db/store';
import { processMentorChatMessage } from '@/lib/ai/mentorPrompt';
import { Bot, X, Send, Sparkles, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'mentor';
  text: string;
  timestamp: string;
  isRefusal?: boolean;
}

export const FloatingAIMentor: React.FC = () => {
  const { currentUser, addStrike } = usePassportStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am your AI Co-Pilot on Potential as a Passport. I am here to help you unpack difficult concepts, provide Socratic hints when you get stuck, and guide your roadmap. What are we exploring today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processMentorChatMessage(text, currentUser.trackId, currentUser.workflowState);

      if (response.strikeLogged) {
        addStrike(currentUser.id, 'inappropriate', `Flagged language in AI Mentor chat: "${text.slice(0, 30)}..."`);
      }

      const mentorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRefusal: response.isRefusal,
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    'How do I earn execution tokens?',
    'What is Mechanical Advantage = Load / Effort?',
    'Write my submission for scissors', // test graded task refusal!
    'Give me a Socratic hint on Levers',
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 text-white shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Open AI Mentor"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                <span>AI Co-Pilot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-white/80 font-normal">Socratic Guidance & Doubts</div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-3rem)] h-[580px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Persistent AI Mentor</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Context: {currentUser.educationLevel || 'Class 10 Mechanics'}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex-shrink-0">Suggestions:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-indigo-900/60 text-slate-300 hover:text-indigo-200 px-2.5 py-1 rounded-full border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/30">
            {messages.map((m) => {
              const isStudent = m.sender === 'student';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isStudent
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : m.isRefusal
                        ? 'bg-amber-950/40 border border-amber-800/50 text-amber-200 rounded-bl-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    {m.isRefusal && (
                      <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Socratic Guardrail Active</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1 px-2">
                <Bot className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                <span>AI Mentor is thinking Socratic hints...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask doubt, request hint, or explore roadmap..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 text-[10px] text-center text-slate-500">
              Guiding questions only • Direct answers to graded work are refused
            </div>
          </div>
        </div>
      )}
    </>
  );
};
