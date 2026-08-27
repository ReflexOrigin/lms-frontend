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

  let res = await fetch(`${STRAPI_URL}/api${path}`, {
    cache: 'no-store',
    ...options,
    headers,
  });

  // If the request fails with 401 and we sent a token, it might be expired.
  // Retry without the token to see if the route is public.
  if (res.status === 401 && jwt) {
    const retryHeaders = new Headers(options.headers);
    if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
      retryHeaders.set('Content-Type', 'application/json');
    }
    res = await fetch(`${STRAPI_URL}/api${path}`, {
      cache: 'no-store',
      ...options,
      headers: retryHeaders,
    });
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Strapi error: ${res.statusText}`);
  }

  return res.json();
}

export async function getCourses(filters = '') {
  try {
    // Populate instructor and lessons by default for course cards
    const res = await fetchWithAuth(`/courses?populate[0]=instructor&populate[1]=lessons${filters ? '&' + filters : ''}`, { cache: 'no-store' });
    return res.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourse(slug: string, instructorView = false) {
  try {
    const baseQuery = instructorView ? '&instructorView=true' : '';
    // Populate instructor, lessons. Try slug first.
    let res = await fetchWithAuth(`/courses?filters[slug][$eq]=${slug}&populate[0]=instructor&populate[1]=lessons${baseQuery}`, { cache: 'no-store' });
    
    // If not found by slug, fallback to documentId
    if (!res.data || res.data.length === 0) {
      res = await fetchWithAuth(`/courses?filters[documentId][$eq]=${slug}&populate[0]=instructor&populate[1]=lessons${baseQuery}`, { cache: 'no-store' });
    }
    
    return res.data?.[0] || null;
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    return null;
  }
}

export async function createCourse(data: any) {
  const res = await fetchWithAuth('/courses', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return res.data;
}

export async function updateCourse(id: string, data: any) {
  const isPublished = !!data.publishedAt;
  
  // Create a copy without publishedAt since Strapi 5 ignores it in PUT
  const updateData = { ...data };
  delete updateData.publishedAt;

  const res = await fetchWithAuth(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: updateData }),
  });
  
  // fetchWithAuth throws if the response is not ok, so if we reach here, it succeeded.
  if (isPublished) {
    await fetchWithAuth(`/courses/${id}/publish`, { method: 'POST' });
  } else {
    await fetchWithAuth(`/courses/${id}/unpublish`, { method: 'POST' });
  }
  
  return res.data;
}

export async function deleteCourse(id: string) {
  const res = await fetchWithAuth(`/courses/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}
