import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lessonId, studentId } = body;

    if (!lessonId || !studentId) {
      return NextResponse.json({ error: 'Missing lessonId or studentId' }, { status: 400 });
    }

    const tokenTransaction = {
      id: `tx-${Date.now()}`,
      userId: studentId,
      amount: 10,
      type: 'daily_lesson',
      referenceId: lessonId,
      description: 'Completed 15-minute daily lesson (+10 Tokens)',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      streakIncremented: true,
      tokenTransaction,
      message: 'Lesson completed successfully! +10 Tokens awarded.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
