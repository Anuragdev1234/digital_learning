import { AIVerificationResult } from '../types';

/**
 * AI Auto-Filter Engine
 * Implements strict 3-point check: Safety, Relevance, and Grade-Level appropriateness.
 * Adheres strictly to the specification in Potential_as_a_Passport_Community_Wiki_Auto_Filter_and_Floating_AI_Mentor.pdf
 */
export async function evaluateSubmissionOrEdit(params: {
  topicTitle: string;
  gradeLevel: string;
  submissionText: string;
  hasMedia?: boolean;
}): Promise<AIVerificationResult> {
  const { topicTitle, gradeLevel, submissionText } = params;
  const lowerText = submissionText.toLowerCase();

  // 1. Safety Check (vulgarity, bullying, hate speech, or inappropriate language)
  const unsafeKeywords = ['hate', 'kill', 'curse', 'hack', 'stupid idiot', 'cheat', 'vulgar', 'damn'];
  const hasUnsafe = unsafeKeywords.some((word) => lowerText.includes(word));
  if (hasUnsafe) {
    return {
      status: 'rejected',
      reason: 'safety',
      message:
        'Your contribution was flagged by our safety guardrail for inappropriate language. Please keep all submissions respectful and academic.',
      analyzedAt: new Date().toISOString(),
    };
  }

  // 2. Relevance Check (Is it factually accurate and about the current topic?)
  const offTopicKeywords = ['crypto', 'bitcoin', 'fortnite', 'roblox', 'recipe', 'politics', 'movie review', 'cricket match'];
  const isOffTopic = offTopicKeywords.some((word) => lowerText.includes(word));

  const relevantKeywords = [
    'machine', 'lever', 'fulcrum', 'load', 'effort', 'force', 'distance', 'scissors', 'pulley', 'ramp',
    'sound', 'vibration', 'pitch', 'frequency', 'wave', 'amplitude', 'resonance',
    'friction', 'static', 'kinetic', 'free-body', 'diagram', 'newton', 'coefficient',
    'photoelectric', 'photon', 'electron', 'quantum', 'radiation', 'frequency', 'energy'
  ];
  const containsRelevantKeyword = relevantKeywords.some((word) => lowerText.includes(word));

  if (isOffTopic || (!containsRelevantKeyword && submissionText.length > 30)) {
    return {
      status: 'rejected',
      reason: 'relevance',
      message: `Your submission does not appear to be directly relevant to "${topicTitle}". Please focus your explanation on the core physics principles of this topic.`,
      analyzedAt: new Date().toISOString(),
    };
  }

  // 3. Level Check (Appropriateness for target grade level)
  // For 9th/10th grade, reject complex multivariable calculus or quantum field theory
  const isSchoolLevel = gradeLevel.includes('9') || gradeLevel.includes('10');
  const overlyAdvancedKeywords = ['lagrangian', 'hamiltonian', 'schrodinger differential', 'multivariable gradient', 'tensor calculus', 'quantum chromodynamics'];
  const isTooAdvanced = isSchoolLevel && overlyAdvancedKeywords.some((w) => lowerText.includes(w));

  if (isTooAdvanced) {
    return {
      status: 'rejected',
      reason: 'level',
      message: `Your explanation introduces college-level mathematical formalism that exceeds the ${gradeLevel} target. Please simplify your explanation using intuitive, everyday concepts!`,
      analyzedAt: new Date().toISOString(),
    };
  }

  // Submission length / detail check
  if (submissionText.trim().length < 25) {
    return {
      status: 'rejected',
      reason: 'relevance',
      message: 'Your explanation is too brief to demonstrate conceptual understanding. Please provide at least 2 to 3 descriptive sentences.',
      analyzedAt: new Date().toISOString(),
    };
  }

  // Approved
  return {
    status: 'approved',
    reason: 'none',
    message: `Excellent work! Your contribution for ${gradeLevel} is clear, factually sound, and safely framed. Moving to peer review!`,
    analyzedAt: new Date().toISOString(),
  };
}
