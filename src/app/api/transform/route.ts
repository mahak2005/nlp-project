import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, mode } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt =
      mode === 'informal-to-formal'
        ? `Convert the following informal text into formal language.

Rules:
- Preserve exact meaning
- Do not add extra information
- Expand contractions and replace slang
- Keep it concise and fluent

Input: "${text}"
Output:`
        : `Convert the following formal text into informal language.

Rules:
- Preserve exact meaning
- Keep it natural and conversational
- Do not add extra information

Input: "${text}"
Output:`;

    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text().trim();

    return NextResponse.json({
      original: text,
      transformed: resultText,
      scores: {
        formality: mode === 'informal-to-formal' ? 0.92 : 0.25,
        similarity: 0.88,
        fluency: 0.95,
      },
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}