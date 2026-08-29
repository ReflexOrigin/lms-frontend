import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * A server-side utility to securely fetch data from Strapi using the HTTPOnly JWT cookie.
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  const url = endpoint.startsWith('http') ? endpoint : `${STRAPI_URL}${endpoint}`;

  let res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // We attempt to delete cookies to force a clean logout state.
  // This will only work if called within a Server Action or Route Handler.
  // For Server Components, we rely on proxy.ts to catch expired JWTs.
  if (res.status === 401 && token) {
    try {
      cookieStore.delete('jwt');
      cookieStore.delete('user_role');
    } catch (e) {
      // Ignored: Cannot modify cookies in a Server Component
    }
  }

  return res;
}
