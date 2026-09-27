import { NextResponse } from 'next/server';
import { SEED_PROFILES } from '@/lib/db/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'user-student-anurag';

  const user = SEED_PROFILES.find((p) => p.id === userId) || SEED_PROFILES[1];

  return NextResponse.json({
    user,
    permissions: {
      canSubmit: user.role === 'student',
      canReview: user.role === 'reviewer' || user.role === 'mentor' || user.role === 'admin',
      isAdmin: user.role === 'admin',
      isMentor: user.role === 'mentor',
    },
  });
}
