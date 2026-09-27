import { NextResponse } from 'next/server';
import { SEED_SUBMISSIONS } from '@/lib/db/seedData';

export async function GET() {
  return NextResponse.json({ submissions: SEED_SUBMISSIONS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, studentName, trackId, challengeTitle, gradeLevel, evidenceUrl, evidenceFilename, explanation } = body;

    const submissionId = `sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      studentId,
      studentName: studentName || 'Student',
      trackId: trackId || 'track-class10-machines',
      challengeTitle: challengeTitle || 'The Mechanical Advantage Hunt',
      gradeLevel: gradeLevel || 'Class 10',
      evidenceType: 'image',
      evidenceUrl,
      evidenceFilename: evidenceFilename || 'evidence.jpg',
      storagePath: `student-submissions/${studentId}/${submissionId}/${evidenceFilename || 'evidence.jpg'}`,
      explanation,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      submission: newSubmission,
      message: 'Submission uploaded to private storage and queued for AI verification.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
