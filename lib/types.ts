export type UserRole = 'student' | 'reviewer' | 'mentor' | 'admin';

export type PassportStatus = 'none' | 'temporary' | 'verified';

export type StudentWorkflowState =
  | 'REGISTERED'
  | 'ONBOARDING'
  | 'CHALLENGE_ACTIVE'
  | 'STREAK_COMPLETE'
  | 'PROJECT_UNLOCKED'
  | 'PROJECT_SUBMITTED'
  | 'AI_REJECTED'
  | 'TEMPORARY_PASSPORT'
  | 'PEER_REJECTED'
  | 'VERIFIED_PASSPORT'
  | 'ACTIVE_LEARNING';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  educationLevel?: string;
  trackId?: string;
  goal?: string;
  passportStatus: PassportStatus;
  workflowState: StudentWorkflowState;
  streakDays: number;
  lastActivityDate?: string;
  tokenBalance: number;
  bio?: string;
  specialization?: string;
  mentorTier?: 'Tier 2' | 'Tier 3';
  credentialStatus?: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface AcademicTrack {
  id: string;
  title: string;
  gradeLevel: string;
  phase: 'School Foundation' | 'Higher Ed & Govt Exams';
  description: string;
  isInteractive: boolean;
  totalModules: number;
  completedModules: number;
  challengeTitle: string;
  challengeDescription: string;
  evidenceRequirement: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  orderIndex: number;
  summary: string;
  keyConcepts: string[];
  content: string;
  isCompleted: boolean;
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
  status: 'locked' | 'available' | 'completed';
  progressPercentage: number;
}

export interface AIVerificationResult {
  status: 'approved' | 'rejected';
  reason: 'safety' | 'relevance' | 'level' | 'none';
  message: string;
  analyzedAt: string;
}

export interface ProjectSubmission {
  id: string;
  studentId: string;
  studentName: string;
  trackId: string;
  challengeTitle: string;
  gradeLevel: string;
  evidenceType: 'image' | 'video' | 'text';
  evidenceUrl: string;
  evidenceFilename: string;
  explanation: string;
  status: 'pending' | 'ai_approved' | 'ai_rejected' | 'peer_verified' | 'peer_rejected' | 'flagged';
  aiResult?: AIVerificationResult;
  reviewerId?: string;
  reviewerName?: string;
  reviewerFeedback?: string;
  reviewedAt?: string;
  submittedAt: string;
  attemptsCount: number;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number; // positive for credits, negative for debits
  type: 'daily_lesson' | 'submission_bonus' | 'peer_review' | 'wiki_contribution' | 'vault_redemption' | 'strike_fine' | 'starting_bonus';
  referenceType: 'lesson' | 'submission' | 'peer_review' | 'wiki_edit' | 'reward' | 'strike';
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  title: string;
  tokenCost: number;
  description: string;
  capacity?: number;
  claimedCount: number;
  type: 'ai_audit' | 'masterclass' | 'one_on_one';
  badge: string;
}

export interface MentorSlot {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTier: 'Tier 2' | 'Tier 3';
  title: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  status: 'open' | 'full' | 'completed';
}

export interface Booking {
  id: string;
  slotId?: string;
  studentId: string;
  studentName: string;
  rewardId: string;
  rewardTitle: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  mentorId?: string;
  mentorName?: string;
  scheduledTime?: string;
  meetingUrl?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  tokensSpent: number;
  createdAt: string;
  reportContent?: string; // For Tier 1 AI audits
}

export interface WikiTopic {
  id: string;
  title: string;
  gradeLevel: string;
  subject: string;
  content: string;
  version: number;
  lastUpdated: string;
  suggestedEditsCount: number;
}

export interface WikiEdit {
  id: string;
  topicId: string;
  topicTitle: string;
  editorId: string;
  editorName: string;
  originalText: string;
  proposedText: string;
  changeExplanation: string;
  aiStatus: 'approved' | 'rejected';
  aiReason?: 'safety' | 'relevance' | 'level' | 'none';
  aiMessage?: string;
  peerStatus: 'pending' | 'merged' | 'rejected';
  peerReviewerId?: string;
  peerFeedback?: string;
  createdAt: string;
  mergedAt?: string;
}

export interface StrikeViolation {
  id: string;
  studentId: string;
  studentName: string;
  category: 'safety' | 'irrelevance' | 'inappropriate' | 'spam';
  details: string;
  penaltyTokens: number;
  timeoutHours: number;
  createdAt: string;
  expiresAt: string;
}

export interface AIMessage {
  id: string;
  role: 'student' | 'mentor_ai';
  content: string;
  contextTrack?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'streak' | 'ai_verification' | 'peer_review' | 'passport' | 'booking' | 'strike' | 'token';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
