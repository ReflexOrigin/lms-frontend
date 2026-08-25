import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Login failed' },
        { status: res.status }
      );
    }

    // Set HTTP-only cookie with the JWT
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'jwt',
      value: data.jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Fetch user with role populated
    const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        'Authorization': `Bearer ${data.jwt}`
      }
    });
    const populatedUser = await userRes.json();
    const roleType = populatedUser?.role?.type;

    // Set role cookie (not httpOnly so client can read it for UI, and middleware can read it)
    if (roleType) {
      cookieStore.set({
        name: 'user_role',
        value: roleType,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Return the user without the JWT (it's safe in the cookie)
    return NextResponse.json({ user: populatedUser });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
