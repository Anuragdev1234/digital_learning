import { NextResponse } from 'next/server';
import { SEED_REWARDS, SEED_MENTOR_SLOTS } from '@/lib/db/seedData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, studentName, rewardId, slotId, currentBalance } = body;

    const reward = SEED_REWARDS.find((r) => r.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (currentBalance !== undefined && currentBalance < reward.tokenCost) {
      return NextResponse.json({ error: 'Insufficient tokens' }, { status: 400 });
    }

    const slot = slotId ? SEED_MENTOR_SLOTS.find((s) => s.id === slotId) : null;

    const booking = {
      id: `book-${Date.now()}`,
      studentId,
      studentName: studentName || 'Student',
      rewardId: reward.id,
      rewardTitle: reward.title,
      tier: reward.tier,
      slotId: slot?.id,
      mentorName: slot?.mentorName,
      scheduledTime: slot?.startAt,
      meetingUrl: slot ? `https://meet.potentialpassport.org/room-${Date.now().toString(36)}` : undefined,
      tokensSpent: reward.tokenCost,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      reportContent:
        reward.type === 'ai_audit'
          ? `AI Diagnostic Summary:\n- Demonstrated Strengths: Mechanics vector balance.\n- Focus Area: Friction on inclined planes.\n- Action Item: Complete Module 4.`
          : undefined,
    };

    return NextResponse.json({
      success: true,
      booking,
      debitedTokens: reward.tokenCost,
      message: `Successfully redeemed ${reward.title}!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
