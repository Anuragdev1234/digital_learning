import { NextResponse } from 'next/server';
import { SEED_BOOKINGS } from '@/lib/db/seedData';

export async function GET() {
  return NextResponse.json({ bookings: SEED_BOOKINGS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, studentId, studentName, rewardTitle, tier } = body;

    const newBooking = {
      id: `book-${Date.now()}`,
      slotId,
      studentId,
      studentName,
      rewardTitle: rewardTitle || 'Mentorship Session',
      tier: tier || 'Tier 2',
      status: 'confirmed',
      meetingUrl: `https://meet.potentialpassport.org/room-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
