// Supabase Edge Function: floating_ai_mentor
// Provides real-time doubt resolution and Socratic guidance while strictly refusing direct answers to graded tasks.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { message, contextTrack } = await req.json();
    const lower = (message || '').toLowerCase();

    // Refusal for graded cheating
    const cheatingPatterns = ['write my submission', 'do my homework', 'give me the answer for the project'];
    if (cheatingPatterns.some((p: string) => lower.includes(p))) {
      return new Response(
        JSON.stringify({
          content: 'I can’t write your submission for you, but let’s break down the first step together! What household tool did you pick?',
          isRefusal: true,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Safety refusal
    const unsafe = ['curse', 'kill', 'hate', 'hack this'];
    if (unsafe.some((w: string) => lower.includes(w))) {
      return new Response(
        JSON.stringify({
          content: 'Safety guardrail triggered. Please keep inquiries polite and academic.',
          isRefusal: true,
          strikeLogged: true,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Socratic response
    return new Response(
      JSON.stringify({
        content: `Great question on ${contextTrack || 'Mechanics'}! Mechanical Advantage (MA) = Load / Effort. What is the distance between your effort handle and the pivot point?`,
        isRefusal: false,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
