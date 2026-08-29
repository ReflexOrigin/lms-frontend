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

export async function getQuizForCourse(courseId: string, managerView = false) {
  const headers = managerView ? { 'x-manager-view': 'true' } : {};
  const res = await fetchWithAuth(`/quizzes?filters[course][documentId][$eq]=${courseId}&populate=questions`, { cache: 'no-store', headers });
  return res.data?.[0]; // course has one quiz in our schema
}

export async function createQuiz(courseId: string, title: string) {
  const res = await fetchWithAuth('/quizzes', {
    method: 'POST',
    body: JSON.stringify({ data: { course: courseId, title } }),
  });
  return res.data;
}

export async function createQuestion(quizId: string, data: any) {
  const payload = { ...data, quiz: quizId };
  const res = await fetchWithAuth('/questions', {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  });
  return res.data;
}

export async function deleteQuestion(questionId: string) {
  const res = await fetchWithAuth(`/questions/${questionId}`, {
    method: 'DELETE',
  });
  return res.data;
}

export async function submitQuizAttempt(quizId: string, answers: Record<string, number>) {
  const res = await fetchWithAuth('/quiz-attempts', {
    method: 'POST',
    body: JSON.stringify({ data: { quiz: quizId, answers } }),
  });
  return res.data;
}

export async function getQuizAttempt(quizId: string) {
  const res = await fetchWithAuth(`/quiz-attempts?filters[quiz][documentId][$eq]=${quizId}`);
  // Get the most recent attempt
  return res.data.length > 0 ? res.data[res.data.length - 1] : null;
}
