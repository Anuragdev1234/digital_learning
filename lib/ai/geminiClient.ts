/**
 * Google Gemini Live Integration Layer
 * Provides real-time multimodal evaluation and Socratic reasoning using Gemini 1.5 Flash.
 * Falls back transparently to the verified local engine if no API key is configured.
 */

import { AIVerificationResult } from '../types';
import { evaluateSubmissionOrEdit } from './autoFilter';
import { processMentorChatMessage, MentorChatResponse } from './mentorPrompt';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_GATE_API_KEY;

export async function evaluateWithGemini(params: {
  topicTitle: string;
  gradeLevel: string;
  submissionText: string;
  evidenceUrl?: string;
}): Promise<AIVerificationResult> {
  if (!GEMINI_API_KEY) {
    // Graceful fallback to verified deterministic engine
    return await evaluateSubmissionOrEdit({
      topicTitle: params.topicTitle,
      gradeLevel: params.gradeLevel,
      submissionText: params.submissionText,
    });
  }

  try {
    const prompt = `You are an encouraging but strict Teaching Assistant for the educational platform "Potential as a Passport".
You are evaluating a student-submitted practical mini-project for the topic: "${params.topicTitle}" aimed at target audience: "${params.gradeLevel}".

Rules:
1. Safety Check: If the text contains any vulgarity, bullying, hate speech, or inappropriate language, reject immediately.
2. Relevance Check: Is the explanation factually accurate and directly related to the current topic? If it goes off-topic or contains false info, reject.
3. Level Check: Is the explanation appropriate for the target grade level? If the student uses concepts that are too advanced (e.g. university calculus for 9th/10th grade), reject and ask to simplify.

Student Explanation:
"""${params.submissionText}"""

Output ONLY valid JSON matching this exact schema:
{
  "status": "approved" | "rejected",
  "reason": "safety" | "relevance" | "level" | "none",
  "message": "1-2 sentence friendly response to the student explaining approval or exact remediation steps"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(candidateText);

    return {
      status: parsed.status,
      reason: parsed.reason,
      message: parsed.message,
      analyzedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Gemini live call fallback:', err);
    return await evaluateSubmissionOrEdit({
      topicTitle: params.topicTitle,
      gradeLevel: params.gradeLevel,
      submissionText: params.submissionText,
    });
  }
}

export async function chatWithGeminiMentor(params: {
  message: string;
  contextTrack?: string;
  userState?: string;
}): Promise<MentorChatResponse> {
  if (!GEMINI_API_KEY) {
    return processMentorChatMessage(params.message, params.contextTrack, params.userState);
  }

  // Pre-filter with local boundaries
  const localCheck = processMentorChatMessage(params.message, params.contextTrack, params.userState);
  if (localCheck.isRefusal) {
    return localCheck;
  }

  try {
    const systemInstruction = `You are the persistent Floating AI Mentor on "Potential as a Passport".
You are helping a student studying: ${params.contextTrack || 'General Science'}.
Rules:
- NEVER write complete solutions, homework code, or mini-project submissions for the student.
- ALWAYS use Socratic questioning: offer hints, analogies, and step-by-step thinking strategies.
- Keep responses concise (2-4 sentences max) and inspiring.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: params.message }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      content: content || localCheck.content,
      isRefusal: false,
    };
  } catch (err) {
    console.warn('Gemini chat fallback:', err);
    return localCheck;
  }
}
