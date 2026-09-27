import { NextResponse } from 'next/server';
import { evaluateSubmissionOrEdit } from '@/lib/ai/autoFilter';
import { SEED_WIKI_EDITS } from '@/lib/db/seedData';

export async function GET() {
  return NextResponse.json({ edits: SEED_WIKI_EDITS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topicId, topicTitle, gradeLevel, editorId, editorName, originalText, proposedText, changeExplanation } = body;

    const aiResult = await evaluateSubmissionOrEdit({
      topicTitle: topicTitle || 'Community Study Notes',
      gradeLevel: gradeLevel || 'Class 10',
      submissionText: proposedText,
    });

    const newEdit = {
      id: `edit-${Date.now()}`,
      topicId,
      topicTitle,
      editorId,
      editorName,
      originalText,
      proposedText,
      changeExplanation,
      aiStatus: aiResult.status,
      aiReason: aiResult.reason,
      aiMessage: aiResult.message,
      peerStatus: aiResult.status === 'approved' ? 'pending' : 'rejected',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      edit: newEdit,
      aiResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
