'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  AcademicTrack,
  Module,
  ProjectSubmission,
  TokenTransaction,
  Reward,
  MentorSlot,
  Booking,
  WikiTopic,
  WikiEdit,
  StrikeViolation,
  AppNotification,
  AIVerificationResult,
  PassportStatus,
  StudentWorkflowState,
} from '../types';
import {
  SEED_PROFILES,
  SEED_TRACKS,
  SEED_MODULES,
  SEED_SUBMISSIONS,
  SEED_TOKEN_LEDGER,
  SEED_REWARDS,
  SEED_MENTOR_SLOTS,
  SEED_BOOKINGS,
  SEED_WIKI_TOPICS,
  SEED_WIKI_EDITS,
  SEED_STRIKES,
  SEED_NOTIFICATIONS,
} from './seedData';
import { evaluateSubmissionOrEdit } from '../ai/autoFilter';

const STORE_KEY_PREFIX = 'potential_passport_state_';

interface StoreState {
  currentUserId: string;
  profiles: UserProfile[];
  tracks: AcademicTrack[];
  modules: Module[];
  submissions: ProjectSubmission[];
  tokenLedger: TokenTransaction[];
  rewards: Reward[];
  mentorSlots: MentorSlot[];
  bookings: Booking[];
  wikiTopics: WikiTopic[];
  wikiEdits: WikiEdit[];
  strikes: StrikeViolation[];
  notifications: AppNotification[];
}

function getInitialState(): StoreState {
  if (typeof window === 'undefined') {
    return {
      currentUserId: 'user-student-anurag',
      profiles: SEED_PROFILES,
      tracks: SEED_TRACKS,
      modules: SEED_MODULES,
      submissions: SEED_SUBMISSIONS,
      tokenLedger: SEED_TOKEN_LEDGER,
      rewards: SEED_REWARDS,
      mentorSlots: SEED_MENTOR_SLOTS,
      bookings: SEED_BOOKINGS,
      wikiTopics: SEED_WIKI_TOPICS,
      wikiEdits: SEED_WIKI_EDITS,
      strikes: SEED_STRIKES,
      notifications: SEED_NOTIFICATIONS,
    };
  }

  try {
    const raw = localStorage.getItem(`${STORE_KEY_PREFIX}data_v3`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading stored state:', e);
  }

  return {
    currentUserId: 'user-student-anurag',
    profiles: SEED_PROFILES,
    tracks: SEED_TRACKS,
    modules: SEED_MODULES,
    submissions: SEED_SUBMISSIONS,
    tokenLedger: SEED_TOKEN_LEDGER,
    rewards: SEED_REWARDS,
    mentorSlots: SEED_MENTOR_SLOTS,
    bookings: SEED_BOOKINGS,
    wikiTopics: SEED_WIKI_TOPICS,
    wikiEdits: SEED_WIKI_EDITS,
    strikes: SEED_STRIKES,
    notifications: SEED_NOTIFICATIONS,
  };
}

// Global subscribers for multi-component reactivity
type Listener = () => void;
let globalState = getInitialState();
const listeners = new Set<Listener>();

function notifyListeners() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORE_KEY_PREFIX}data_v3`, JSON.stringify(globalState));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
  listeners.forEach((listener) => listener());
}

export function usePassportStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const currentUser =
    globalState.profiles.find((p) => p.id === globalState.currentUserId) || globalState.profiles[1];

  const setCurrentUser = useCallback((userId: string) => {
    globalState = { ...globalState, currentUserId: userId };
    notifyListeners();
  }, []);

  const resetToSeed = useCallback(() => {
    globalState = {
      currentUserId: 'user-student-anurag',
      profiles: SEED_PROFILES,
      tracks: SEED_TRACKS,
      modules: SEED_MODULES,
      submissions: SEED_SUBMISSIONS,
      tokenLedger: SEED_TOKEN_LEDGER,
      rewards: SEED_REWARDS,
      mentorSlots: SEED_MENTOR_SLOTS,
      bookings: SEED_BOOKINGS,
      wikiTopics: SEED_WIKI_TOPICS,
      wikiEdits: SEED_WIKI_EDITS,
      strikes: SEED_STRIKES,
      notifications: SEED_NOTIFICATIONS,
    };
    notifyListeners();
  }, []);

  // Complete a 15-minute lesson & update streak
  const completeLesson = useCallback((lessonId: string, trackId: string) => {
    const user = globalState.profiles.find((p) => p.id === globalState.currentUserId);
    if (!user) return;

    // Check if lesson was already awarded tokens today
    const alreadyCredited = globalState.tokenLedger.some(
      (tx) => tx.userId === user.id && tx.referenceType === 'lesson' && tx.referenceId === lessonId
    );

    let newLedger = [...globalState.tokenLedger];
    let newBalance = user.tokenBalance;

    if (!alreadyCredited) {
      const tx: TokenTransaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        amount: 10,
        type: 'daily_lesson',
        referenceType: 'lesson',
        referenceId: lessonId,
        description: 'Completed 15-minute daily lesson (+10 Tokens)',
        createdAt: new Date().toISOString(),
      };
      newLedger.unshift(tx);
      newBalance += 10;
    }

    const newStreak = user.streakDays + 1;
    let nextWorkflowState: StudentWorkflowState = user.workflowState;

    // If streak reaches threshold (1 or more for demo, or 7), unlock mini-project
    if (newStreak >= 1 && user.workflowState === 'CHALLENGE_ACTIVE') {
      nextWorkflowState = 'PROJECT_UNLOCKED';
    }

    const updatedProfiles = globalState.profiles.map((p) =>
      p.id === user.id
        ? {
            ...p,
            streakDays: newStreak,
            tokenBalance: newBalance,
            lastActivityDate: new Date().toISOString().split('T')[0],
            workflowState: nextWorkflowState,
          }
        : p
    );

    // Mark lesson completed in module
    const updatedModules = globalState.modules.map((m) => {
      const updatedLessons = m.lessons.map((l) => (l.id === lessonId ? { ...l, isCompleted: true } : l));
      return { ...m, lessons: updatedLessons };
    });

    // Add in-app notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: 'streak',
      title: 'Streak Incremented!',
      message: `You completed today's lesson. Current streak: ${newStreak} days! +10 Tokens awarded.`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    globalState = {
      ...globalState,
      profiles: updatedProfiles,
      modules: updatedModules,
      tokenLedger: newLedger,
      notifications: [notif, ...globalState.notifications],
    };
    notifyListeners();
  }, []);

  // Submit Mini-Project
  const submitProject = useCallback(
    async (params: {
      challengeTitle: string;
      gradeLevel: string;
      evidenceUrl: string;
      evidenceFilename: string;
      explanation: string;
    }) => {
      const user = globalState.profiles.find((p) => p.id === globalState.currentUserId);
      if (!user) throw new Error('Not authenticated');

      const submissionId = `sub-${Date.now()}`;
      const newSubmission: ProjectSubmission = {
        id: submissionId,
        studentId: user.id,
        studentName: user.name,
        trackId: user.trackId || 'track-class10-machines',
        challengeTitle: params.challengeTitle,
        gradeLevel: params.gradeLevel,
        evidenceType: 'image',
        evidenceUrl: params.evidenceUrl,
        evidenceFilename: params.evidenceFilename,
        explanation: params.explanation,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        attemptsCount: 1,
      };

      // Add to state in pending status
      globalState = {
        ...globalState,
        submissions: [newSubmission, ...globalState.submissions],
        profiles: globalState.profiles.map((p) =>
          p.id === user.id ? { ...p, workflowState: 'PROJECT_SUBMITTED' } : p
        ),
      };
      notifyListeners();

      // Trigger AI Verification Check
      const aiResult: AIVerificationResult = await evaluateSubmissionOrEdit({
        topicTitle: params.challengeTitle,
        gradeLevel: params.gradeLevel,
        submissionText: params.explanation,
      });

      let updatedStatus = newSubmission.status;
      let newPassportStatus: PassportStatus = user.passportStatus;
      let nextState: StudentWorkflowState = user.workflowState;

      if (aiResult.status === 'approved') {
        updatedStatus = 'ai_approved';
        newPassportStatus = 'temporary';
        nextState = 'TEMPORARY_PASSPORT';
      } else {
        updatedStatus = 'ai_rejected';
        nextState = 'AI_REJECTED';
      }

      const verifiedSubmissions = globalState.submissions.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: updatedStatus,
              aiResult,
              reviewerId: 'user-reviewer-vikram',
              reviewerName: 'Vikram Patel',
            }
          : s
      );

      const updatedProfiles = globalState.profiles.map((p) =>
        p.id === user.id
          ? {
              ...p,
              passportStatus: newPassportStatus,
              workflowState: nextState,
            }
        : p
      );

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: user.id,
        type: 'ai_verification',
        title: aiResult.status === 'approved' ? 'AI Verification Passed!' : 'AI Revision Requested',
        message: aiResult.message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      globalState = {
        ...globalState,
        submissions: verifiedSubmissions,
        profiles: updatedProfiles,
        notifications: [notif, ...globalState.notifications],
      };
      notifyListeners();

      return { submissionId, aiResult };
    },
    []
  );

  // Peer Review Action (By older student / reviewer)
  const reviewSubmission = useCallback(
    (params: {
      submissionId: string;
      decision: 'approve' | 'reject';
      feedback: string;
    }) => {
      const reviewer = globalState.profiles.find((p) => p.id === globalState.currentUserId);
      if (!reviewer) return;

      const sub = globalState.submissions.find((s) => s.id === params.submissionId);
      if (!sub) return;

      const isApproved = params.decision === 'approve';
      const newStatus = isApproved ? 'peer_verified' : 'peer_rejected';

      let newLedger = [...globalState.tokenLedger];
      let studentBonusTokens = 0;
      let reviewerRewardTokens = 25;

      // Update student profile
      const student = globalState.profiles.find((p) => p.id === sub.studentId);
      if (student && isApproved) {
        studentBonusTokens = 50;
        // Credit student +50
        newLedger.unshift({
          id: `tx-${Date.now()}-student`,
          userId: student.id,
          amount: studentBonusTokens,
          type: 'submission_bonus',
          referenceType: 'submission',
          referenceId: sub.id,
          description: `Mini-Project Verified: ${sub.challengeTitle} (+50 Tokens)`,
          createdAt: new Date().toISOString(),
        });
      }

      // Credit reviewer +25
      newLedger.unshift({
        id: `tx-${Date.now()}-rev`,
        userId: reviewer.id,
        amount: reviewerRewardTokens,
        type: 'peer_review',
        referenceType: 'peer_review',
        referenceId: sub.id,
        description: `Peer Review completed for ${sub.studentName} (+25 Tokens)`,
        createdAt: new Date().toISOString(),
      });

      const updatedProfiles = globalState.profiles.map((p) => {
        if (p.id === sub.studentId && isApproved) {
          return {
            ...p,
            passportStatus: 'verified' as PassportStatus,
            workflowState: 'VERIFIED_PASSPORT' as StudentWorkflowState,
            tokenBalance: p.tokenBalance + studentBonusTokens,
          };
        }
        if (p.id === reviewer.id) {
          return {
            ...p,
            tokenBalance: p.tokenBalance + reviewerRewardTokens,
          };
        }
        return p;
      });

      const updatedSubmissions = globalState.submissions.map((s) =>
        s.id === params.submissionId
          ? {
              ...s,
              status: newStatus as any,
              reviewerFeedback: params.feedback,
              reviewedAt: new Date().toISOString(),
              reviewerId: reviewer.id,
              reviewerName: reviewer.name,
            }
          : s
      );

      const notifStudent: AppNotification = {
        id: `notif-${Date.now()}-st`,
        userId: sub.studentId,
        type: 'passport',
        title: isApproved ? 'Verified Passport Unlocked!' : 'Peer Revision Requested',
        message: isApproved
          ? `Your project was verified by ${reviewer.name}! You earned +50 Tokens and full ecosystem access.`
          : `Peer reviewer ${reviewer.name} requested adjustments: "${params.feedback}"`,
        read: false,
        createdAt: new Date().toISOString(),
      };

      globalState = {
        ...globalState,
        profiles: updatedProfiles,
        submissions: updatedSubmissions,
        tokenLedger: newLedger,
        notifications: [notifStudent, ...globalState.notifications],
      };
      notifyListeners();
    },
    []
  );

  // Redeem Reward in The Vault
  const redeemReward = useCallback(
    (rewardId: string, slotId?: string) => {
      const user = globalState.profiles.find((p) => p.id === globalState.currentUserId);
      if (!user) throw new Error('Not authenticated');

      const reward = globalState.rewards.find((r) => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      if (user.tokenBalance < reward.tokenCost) {
        throw new Error(`Insufficient tokens! You have ${user.tokenBalance}, but need ${reward.tokenCost}.`);
      }

      let bookedSlot: MentorSlot | undefined;
      if (slotId) {
        bookedSlot = globalState.mentorSlots.find((s) => s.id === slotId);
        if (bookedSlot && bookedSlot.bookedCount >= bookedSlot.capacity) {
          throw new Error('This session slot is already at full capacity!');
        }
      }

      // Debit ledger atomically
      const tx: TokenTransaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        amount: -reward.tokenCost,
        type: 'vault_redemption',
        referenceType: 'reward',
        referenceId: reward.id,
        description: `Redeemed ${reward.tier}: ${reward.title} (-${reward.tokenCost} Tokens)`,
        createdAt: new Date().toISOString(),
      };

      // Create Booking
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        studentId: user.id,
        studentName: user.name,
        rewardId: reward.id,
        rewardTitle: reward.title,
        tier: reward.tier,
        slotId: bookedSlot?.id,
        mentorId: bookedSlot?.mentorId,
        mentorName: bookedSlot?.mentorName,
        scheduledTime: bookedSlot?.startAt,
        meetingUrl: bookedSlot ? `https://meet.potentialpassport.org/room-${Date.now().toString(36)}` : undefined,
        status: 'confirmed',
        tokensSpent: reward.tokenCost,
        createdAt: new Date().toISOString(),
        reportContent:
          reward.type === 'ai_audit'
            ? `Comprehensive Diagnostic Report for ${user.name} (${user.educationLevel || 'General Track'}):\n- Core Strength: Diligent consistency and practical physics intuition.\n- Optimization Opportunity: Practice numerical calculation of Mechanical Advantage in non-ideal frictionless scenarios.\n- Next Milestone: Explore Tier 2 Masterclasses with senior scholars.`
            : undefined,
      };

      const updatedProfiles = globalState.profiles.map((p) =>
        p.id === user.id ? { ...p, tokenBalance: p.tokenBalance - reward.tokenCost } : p
      );

      const updatedRewards = globalState.rewards.map((r) =>
        r.id === reward.id ? { ...r, claimedCount: r.claimedCount + 1 } : r
      );

      const updatedSlots = globalState.mentorSlots.map((s) => {
        if (bookedSlot && s.id === bookedSlot.id) {
          const newCount = s.bookedCount + 1;
          return {
            ...s,
            bookedCount: newCount,
            status: newCount >= s.capacity ? ('full' as const) : ('open' as const),
          };
        }
        return s;
      });

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: user.id,
        type: 'booking',
        title: 'Reward Unlocked!',
        message: `You successfully redeemed ${reward.title}. Details added to your bookings.`,
        read: false,
        createdAt: new Date().toISOString(),
      };

      globalState = {
        ...globalState,
        profiles: updatedProfiles,
        rewards: updatedRewards,
        mentorSlots: updatedSlots,
        bookings: [newBooking, ...globalState.bookings],
        tokenLedger: [tx, ...globalState.tokenLedger],
        notifications: [notif, ...globalState.notifications],
      };
      notifyListeners();

      return newBooking;
    },
    []
  );

  // Propose a Wiki Edit
  const proposeWikiEdit = useCallback(
    async (params: {
      topicId: string;
      originalText: string;
      proposedText: string;
      changeExplanation: string;
    }) => {
      const user = globalState.profiles.find((p) => p.id === globalState.currentUserId);
      if (!user) throw new Error('Not authenticated');

      const topic = globalState.wikiTopics.find((t) => t.id === params.topicId);
      if (!topic) throw new Error('Topic not found');

      // AI Pre-Check
      const aiResult = await evaluateSubmissionOrEdit({
        topicTitle: topic.title,
        gradeLevel: topic.gradeLevel,
        submissionText: params.proposedText,
      });

      const newEdit: WikiEdit = {
        id: `edit-${Date.now()}`,
        topicId: topic.id,
        topicTitle: topic.title,
        editorId: user.id,
        editorName: user.name,
        originalText: params.originalText,
        proposedText: params.proposedText,
        changeExplanation: params.changeExplanation,
        aiStatus: aiResult.status,
        aiReason: aiResult.reason,
        aiMessage: aiResult.message,
        peerStatus: aiResult.status === 'approved' ? 'pending' : 'rejected',
        createdAt: new Date().toISOString(),
      };

      globalState = {
        ...globalState,
        wikiEdits: [newEdit, ...globalState.wikiEdits],
        wikiTopics: globalState.wikiTopics.map((t) =>
          t.id === topic.id ? { ...t, suggestedEditsCount: t.suggestedEditsCount + 1 } : t
        ),
      };
      notifyListeners();

      return newEdit;
    },
    []
  );

  // Merge Wiki Edit (By Senior Student or Admin)
  const mergeWikiEdit = useCallback((editId: string, approve: boolean, reviewerFeedback?: string) => {
    const reviewer = globalState.profiles.find((p) => p.id === globalState.currentUserId);
    const edit = globalState.wikiEdits.find((e) => e.id === editId);
    if (!edit || !reviewer) return;

    let newLedger = [...globalState.tokenLedger];
    let updatedTopics = [...globalState.wikiTopics];

    if (approve) {
      // Award tokens: +15 to editor, +10 to reviewer
      newLedger.unshift({
        id: `tx-${Date.now()}-ed`,
        userId: edit.editorId,
        amount: 15,
        type: 'wiki_contribution',
        referenceType: 'wiki_edit',
        referenceId: edit.id,
        description: `Approved Wiki Edit merged into ${edit.topicTitle} (+15 Tokens)`,
        createdAt: new Date().toISOString(),
      });

      newLedger.unshift({
        id: `tx-${Date.now()}-rev`,
        userId: reviewer.id,
        amount: 10,
        type: 'peer_review',
        referenceType: 'wiki_edit',
        referenceId: edit.id,
        description: `Community Wiki merge review completed (+10 Tokens)`,
        createdAt: new Date().toISOString(),
      });

      // Update topic content with replacement
      updatedTopics = updatedTopics.map((t) => {
        if (t.id === edit.topicId) {
          const updatedContent = t.content.replace(edit.originalText, edit.proposedText);
          return {
            ...t,
            content: updatedContent,
            version: t.version + 1,
            lastUpdated: new Date().toISOString(),
            suggestedEditsCount: Math.max(0, t.suggestedEditsCount - 1),
          };
        }
        return t;
      });
    }

    const updatedEdits = globalState.wikiEdits.map((e) =>
      e.id === editId
        ? {
            ...e,
            peerStatus: (approve ? 'merged' : 'rejected') as any,
            peerReviewerId: reviewer.id,
            peerFeedback: reviewerFeedback,
            mergedAt: approve ? new Date().toISOString() : undefined,
          }
        : e
    );

    const updatedProfiles = globalState.profiles.map((p) => {
      if (p.id === edit.editorId && approve) {
        return { ...p, tokenBalance: p.tokenBalance + 15 };
      }
      if (p.id === reviewer.id && approve) {
        return { ...p, tokenBalance: p.tokenBalance + 10 };
      }
      return p;
    });

    globalState = {
      ...globalState,
      wikiTopics: updatedTopics,
      wikiEdits: updatedEdits,
      tokenLedger: newLedger,
      profiles: updatedProfiles,
    };
    notifyListeners();
  }, []);

  // Update student onboarding
  const completeOnboarding = useCallback((params: { gradeLevel: string; trackId: string; goal: string }) => {
    const user = globalState.profiles.find((p) => p.id === globalState.currentUserId);
    if (!user) return;

    const updatedProfiles = globalState.profiles.map((p) =>
      p.id === user.id
        ? {
            ...p,
            educationLevel: params.gradeLevel,
            trackId: params.trackId,
            goal: params.goal,
            workflowState: 'CHALLENGE_ACTIVE' as StudentWorkflowState,
          }
        : p
    );

    globalState = { ...globalState, profiles: updatedProfiles };
    notifyListeners();
  }, []);

  // Add a strike violation (Moderation)
  const addStrike = useCallback((studentId: string, category: 'safety' | 'spam' | 'inappropriate', details: string) => {
    const student = globalState.profiles.find((p) => p.id === studentId);
    if (!student) return;

    const penalty = 50;
    const strike: StrikeViolation = {
      id: `strike-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      category,
      details,
      penaltyTokens: penalty,
      timeoutHours: 48,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };

    const tx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      userId: student.id,
      amount: -penalty,
      type: 'strike_fine',
      referenceType: 'strike',
      referenceId: strike.id,
      description: `Strike penalty applied for ${category} violation (-${penalty} Tokens)`,
      createdAt: new Date().toISOString(),
    };

    const updatedProfiles = globalState.profiles.map((p) =>
      p.id === student.id ? { ...p, tokenBalance: Math.max(0, p.tokenBalance - penalty) } : p
    );

    globalState = {
      ...globalState,
      strikes: [strike, ...globalState.strikes],
      tokenLedger: [tx, ...globalState.tokenLedger],
      profiles: updatedProfiles,
    };
    notifyListeners();
  }, []);

  // Mentor slot creation
  const addMentorSlot = useCallback((params: { title: string; startAt: string; endAt: string; capacity: number }) => {
    const mentor = globalState.profiles.find((p) => p.id === globalState.currentUserId);
    if (!mentor || mentor.role !== 'mentor') return;

    const newSlot: MentorSlot = {
      id: `slot-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorTier: mentor.mentorTier || 'Tier 2',
      title: params.title,
      startAt: params.startAt,
      endAt: params.endAt,
      capacity: params.capacity,
      bookedCount: 0,
      status: 'open',
    };

    globalState = {
      ...globalState,
      mentorSlots: [newSlot, ...globalState.mentorSlots],
    };
    notifyListeners();
  }, []);

  // Mentor Application & Vetting Lifecycle
  const applyMentor = useCallback((data: {
    name: string;
    email: string;
    tier: 'Tier 2' | 'Tier 3';
    specialization: string;
    institution: string;
    intent: string;
  }) => {
    const newMentor: UserProfile = {
      id: `user-mentor-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      bio: `${data.institution} • ${data.intent}`,
      specialization: data.specialization,
      mentorTier: data.tier,
      credentialStatus: 'pending',
      passportStatus: 'verified',
      workflowState: 'ACTIVE_LEARNING',
      streakDays: 0,
      tokenBalance: 0,
      createdAt: new Date().toISOString(),
    };

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      type: 'passport',
      title: 'New Mentor Application',
      message: `${data.name} submitted an application for ${data.tier} credential.`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    globalState = {
      ...globalState,
      profiles: [...globalState.profiles, newMentor],
      notifications: [notif, ...globalState.notifications],
    };
    notifyListeners();
    return newMentor;
  }, []);

  const approveMentor = useCallback((mentorId: string) => {
    const mentor = globalState.profiles.find((p) => p.id === mentorId);
    const updatedProfiles = globalState.profiles.map((p) =>
      p.id === mentorId ? { ...p, credentialStatus: 'verified' as const } : p
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: mentorId,
      type: 'passport',
      title: 'Mentor Credential Verified!',
      message: `Your ${mentor?.mentorTier || 'Mentor'} application has been verified by Admin.`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    globalState = {
      ...globalState,
      profiles: updatedProfiles,
      notifications: [notif, ...globalState.notifications],
    };
    notifyListeners();
  }, []);

  const rejectMentor = useCallback((mentorId: string) => {
    const updatedProfiles = globalState.profiles.map((p) =>
      p.id === mentorId ? { ...p, credentialStatus: 'rejected' as const } : p
    );

    globalState = {
      ...globalState,
      profiles: updatedProfiles,
    };
    notifyListeners();
  }, []);

  const addTrack = useCallback((trackData: Omit<AcademicTrack, 'id' | 'completedModules'>) => {
    const newTrack: AcademicTrack = {
      ...trackData,
      id: `track-${Date.now()}`,
      completedModules: 0,
    };

    globalState = {
      ...globalState,
      tracks: [...globalState.tracks, newTrack],
    };
    notifyListeners();
    return newTrack;
  }, []);

  return {
    state: globalState,
    currentUser,
    setCurrentUser,
    resetToSeed,
    completeLesson,
    submitProject,
    reviewSubmission,
    redeemReward,
    proposeWikiEdit,
    mergeWikiEdit,
    completeOnboarding,
    addStrike,
    addMentorSlot,
    applyMentor,
    approveMentor,
    rejectMentor,
    addTrack,
  };
}
