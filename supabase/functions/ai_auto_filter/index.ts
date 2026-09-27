// Supabase Edge Function: ai_auto_filter
// Evaluates submissions and proposed wiki edits against Safety, Relevance, and Level checks.
// Returns strict JSON: { status: 'approved' | 'rejected', reason: string, message: string }

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
    const { topicTitle, gradeLevel, submissionText } = await req.json();

    const lower = (submissionText || '').toLowerCase();

    // 1. Safety check
    const unsafeWords = ['hate', 'kill', 'curse', 'hack', 'stupid idiot', 'cheat', 'vulgar', 'damn'];
    if (unsafeWords.some((w: string) => lower.includes(w))) {
      return new Response(
        JSON.stringify({
          status: 'rejected',
          reason: 'safety',
          message: 'Inappropriate language detected. Submissions must remain respectful and academic.',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Relevance check
    const offTopic = ['crypto', 'bitcoin', 'fortnite', 'roblox', 'politics', 'movie review'];
    if (offTopic.some((w: string) => lower.includes(w))) {
      return new Response(
        JSON.stringify({
          status: 'rejected',
          reason: 'relevance',
          message: `Your submission is off-topic. Please focus on the physics principles of ${topicTitle}.`,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Level check
    const isSchool = (gradeLevel || '').includes('9') || (gradeLevel || '').includes('10');
    const advanced = ['lagrangian', 'tensor calculus', 'schrodinger differential'];
    if (isSchool && advanced.some((w: string) => lower.includes(w))) {
      return new Response(
        JSON.stringify({
          status: 'rejected',
          reason: 'level',
          message: `Your explanation introduces college-level formalism that exceeds ${gradeLevel}. Please simplify.`,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        status: 'approved',
        reason: 'none',
        message: 'Submission passed AI verification check! Moving to peer review queue.',
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
