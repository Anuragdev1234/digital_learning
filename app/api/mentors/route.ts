import { NextResponse } from 'next/server';
import { SEED_PROFILES, SEED_MENTOR_SLOTS } from '@/lib/db/seedData';

export async function GET() {
  const mentors = SEED_PROFILES.filter((p) => p.role === 'mentor');
  return NextResponse.json({
    mentors,
    availableSlots: SEED_MENTOR_SLOTS,
  });
}
