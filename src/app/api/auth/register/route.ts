import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, role } = body;

    // Send the requestedRole in the query params to match the Strapi v5 extension we wrote
    const registerUrl = new URL(`${STRAPI_URL}/api/auth/local/register`);
    if (role) {
      registerUrl.searchParams.set('requestedRole', role);
    }

    const res = await fetch(registerUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Registration failed' },
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

    if (data.user?.role?.type) {
      cookieStore.set({
        name: 'user_role',
        value: data.user.role.type,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    } else if (role) {
      // In case Strapi response didn't populate role deeply but we know what they requested
      cookieStore.set({
        name: 'user_role',
        value: role === 'instructor' ? 'instructor' : 'authenticated',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
