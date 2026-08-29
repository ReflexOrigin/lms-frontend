import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  cookieStore.delete('user_role');
  return NextResponse.json({ message: 'Logged out successfully' });
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  cookieStore.delete('user_role');
  
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/login';
  
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
