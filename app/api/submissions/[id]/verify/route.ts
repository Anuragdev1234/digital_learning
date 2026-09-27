import { NextResponse } from 'next/server';
import { evaluateWithGemini } from '@/lib/ai/geminiClient';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { topicTitle, gradeLevel, submissionText } = body;

    const result = await evaluateWithGemini({
      topicTitle: topicTitle || 'Class 10 - Simple Machines',
      gradeLevel: gradeLevel || 'Class 10',
      submissionText: submissionText || '',
    });

    return NextResponse.json({
      submissionId: id,
      aiResult: result,
      newPassportStatus: result.status === 'approved' ? 'temporary' : 'none',
      status: result.status === 'approved' ? 'ai_approved' : 'ai_rejected',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
