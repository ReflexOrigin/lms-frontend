import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * A server-side utility to securely fetch data from Strapi using the HTTPOnly JWT cookie.
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  const url = endpoint.startsWith('http') ? endpoint : `${STRAPI_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res;
}
