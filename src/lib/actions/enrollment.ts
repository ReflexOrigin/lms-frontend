'use server';

import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  const headers = new Headers(options.headers);
  if (jwt) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Strapi error: ${res.statusText}`);
  }

  return res.json();
}

export async function getMyEnrollments() {
  const res = await fetchWithAuth('/enrollments?populate=course');
  return res.data;
}

export async function checkEnrollment(courseId: number) {
  // Returns true if enrolled, false otherwise
  try {
    const res = await fetchWithAuth(`/enrollments?filters[course][id][$eq]=${courseId}`);
    return res.data.length > 0;
  } catch (err) {
    return false;
  }
}

export async function createEnrollment(courseId: number) {
  const res = await fetchWithAuth('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ data: { course: courseId } }),
  });
  return res.data;
}
