import { NextResponse } from 'next/server';
import { chatWithGeminiMentor } from '@/lib/ai/geminiClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, contextTrack, userState } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const response = await chatWithGeminiMentor({ message, contextTrack, userState });

    return NextResponse.json({
      content: response.content,
      isRefusal: response.isRefusal,
      strikeLogged: response.strikeLogged || false,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
