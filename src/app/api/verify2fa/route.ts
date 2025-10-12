import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    console.log('Verify2FA request for:', email);

    const response = await fetch('http://localhost:3001/api/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    console.log('Verify2FA backend response:', data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
  }
}
