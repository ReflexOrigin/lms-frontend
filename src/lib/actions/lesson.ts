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

export async function getLesson(id: string) {
  const res = await fetchWithAuth(`/lessons/${id}?populate=course`);
  return res.data;
}

export async function createLesson(courseDocumentId: string, data: any) {
  const payload = {
    ...data,
    course: courseDocumentId,
  };
  const res = await fetchWithAuth('/lessons', {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  });
  return res.data;
}

export async function updateLesson(id: string, data: any) {
  const res = await fetchWithAuth(`/lessons/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return res.data;
}

export async function deleteLesson(id: string) {
  const res = await fetchWithAuth(`/lessons/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}
