'use client';

import React, { useState } from 'react';
import { usePassportStore } from '@/lib/db/store';
import { processMentorChatMessage } from '@/lib/ai/mentorPrompt';
import { Bot, Send, Sparkles, BookOpen, ShieldCheck, AlertCircle, Compass } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'mentor';
  text: string;
  time: string;
  isRefusal?: boolean;
}

export default function AIMentorPage() {
  const { currentUser, addStrike } = usePassportStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'mentor',
      text: `Welcome to the full-screen AI Co-Pilot, ${currentUser.name}! I am calibrated for ${currentUser.educationLevel || 'Class 10 Physics'}. How can I assist your study today?`,
      time: '10:00 AM',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processMentorChatMessage(text, currentUser.trackId, currentUser.workflowState);

      if (response.strikeLogged) {
        addStrike(currentUser.id, 'inappropriate', `Flagged language in AI Co-Pilot: "${text.slice(0, 30)}..."`);
      }

      const mentorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: response.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRefusal: response.isRefusal,
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>AI Co-Pilot Knowledge Base</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Socratic Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Context: {currentUser.educationLevel || 'Class 10'} • {currentUser.streakDays} Day Streak Active
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Cheating Guardrail</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => {
            const isStudent = m.sender === 'student';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isStudent
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : m.isRefusal
                      ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200 rounded-bl-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {m.isRefusal && (
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Socratic Guardrail Triggered</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            );
          })}
          {isTyping && (
            <div className="text-xs text-slate-400 flex items-center gap-2 py-2">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Co-Pilot is formulating guidance...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a conceptual doubt, challenge question, or explain where you are stuck..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
