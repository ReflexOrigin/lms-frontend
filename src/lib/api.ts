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

  // If the request fails with 401 and we sent a token, it might be expired.
  // Retry without the token to see if the route is public.
  if (res.status === 401 && token) {
    res = await fetch(url, {
      cache: 'no-store',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  return res;
}
