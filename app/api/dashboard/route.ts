import { NextResponse } from 'next/server';
import {
  SEED_PROFILES,
  SEED_TRACKS,
  SEED_MODULES,
  SEED_REWARDS,
} from '@/lib/db/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'user-student-anurag';

  const user = SEED_PROFILES.find((p) => p.id === userId) || SEED_PROFILES[1];
  const activeTrack = SEED_TRACKS.find((t) => t.id === user.trackId) || SEED_TRACKS[0];

  return NextResponse.json({
    student: {
      id: user.id,
      name: user.name,
      streak: user.streakDays,
      tokens: user.tokenBalance,
      passportStatus: user.passportStatus,
      workflowState: user.workflowState,
    },
    track: activeTrack,
    nextAction: {
      title: 'Physics: The Mechanical Advantage Hunt',
      module: 'Module 3',
      type: 'mini_project',
    },
    milestones: {
      progressPercentage: 72,
      completedModules: 2,
      totalModules: 4,
    },
    opportunityTeaser: {
      title: 'Physics Mechanics Masterclass (Senior Scholar)',
      cost: 300,
      tokensNeeded: Math.max(0, 300 - user.tokenBalance),
    },
  });
}
