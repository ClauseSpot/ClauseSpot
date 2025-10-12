import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("Received email: ", email, " password: ", password);

    const response = await fetch('http://localhost:3001/api/validateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        senha: password,
      }),
    });

    const data = await response.json();
    console.log("Validation response data: ", data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        valid: false, 
        message: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}