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

export async function getCourses(filters = '') {
  // Populate instructor by default for course cards
  const res = await fetchWithAuth(`/courses?populate=instructor${filters ? '&' + filters : ''}`);
  return res.data; // Strapi v5 returns { data: [...] }
}

export async function getCourse(slug: string) {
  // Populate instructor, lessons
  const res = await fetchWithAuth(`/courses?filters[slug][$eq]=${slug}&populate=instructor,lessons`);
  return res.data[0];
}

export async function createCourse(data: any) {
  const res = await fetchWithAuth('/courses', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return res.data;
}

export async function updateCourse(id: string, data: any) {
  const res = await fetchWithAuth(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return res.data;
}

export async function deleteCourse(id: string) {
  const res = await fetchWithAuth(`/courses/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}
