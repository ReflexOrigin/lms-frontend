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
    cache: 'no-store',
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Strapi error: ${res.statusText}`);
  }

  return res.json();
}

import { revalidatePath } from 'next/cache';

export async function getCourseProgress(courseId: string) {
  const res = await fetchWithAuth(`/progresses?filters[course][documentId][$eq]=${courseId}&populate=lesson`, { cache: 'no-store' });
  return res.data;
}

export async function getMyProgresses() {
  const res = await fetchWithAuth(`/progresses?populate=course,lesson`, { cache: 'no-store' });
  return res.data;
}

export async function markLessonComplete(courseId: string, lessonId: string) {
  const res = await fetchWithAuth('/progresses', {
    method: 'POST',
    body: JSON.stringify({ data: { course: courseId, lesson: lessonId, completed: true } }),
  });
  revalidatePath('/courses', 'layout');
  return res.data;
}

export async function updateLessonProgress(courseId: string, lessonId: string, completed: boolean, completionPercentage: number) {
  const res = await fetchWithAuth('/progresses', {
    method: 'POST',
    body: JSON.stringify({ data: { course: courseId, lesson: lessonId, completed, completionPercentage } }),
  });
  return res.data;
}
