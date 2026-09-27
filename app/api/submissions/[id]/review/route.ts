import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reviewerId, decision, feedback } = body;

    const isApproved = decision === 'approve';

    return NextResponse.json({
      submissionId: id,
      reviewerId,
      status: isApproved ? 'peer_verified' : 'peer_rejected',
      feedback,
      studentBonusTokens: isApproved ? 50 : 0,
      reviewerCompensationTokens: 25,
      newPassportStatus: isApproved ? 'verified' : 'temporary',
      message: isApproved
        ? 'Submission verified by senior peer reviewer! Verified Passport and token bonuses unlocked.'
        : 'Revision requested by reviewer.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
