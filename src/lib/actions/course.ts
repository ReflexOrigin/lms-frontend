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

  // We attempt to delete cookies to force a clean logout state.
  // This will only work if called within a Server Action or Route Handler.
  // For Server Components, we rely on proxy.ts to catch expired JWTs.
  if (res.status === 401 && jwt) {
    try {
      cookieStore.delete('jwt');
      cookieStore.delete('user_role');
    } catch (e) {
      // Ignored: Cannot modify cookies in a Server Component
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Strapi error: ${res.statusText}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function getCourses(filters = '', managerView = false) {
  try {
    const headers = managerView ? { 'x-manager-view': 'true' } as HeadersInit : undefined;
    // Populate instructor and lessons by default for course cards
    const res = await fetchWithAuth(`/courses?populate[0]=instructor&populate[1]=lessons${filters ? '&' + filters : ''}`, { cache: 'no-store', headers });
    return res.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourse(slug: string, managerView = false) {
  try {
    const headers = managerView ? { 'x-manager-view': 'true' } as HeadersInit : undefined;
    // Populate instructor, lessons. Try slug first.
    let res = await fetchWithAuth(`/courses?filters[slug][$eq]=${slug}&populate[0]=instructor&populate[1]=lessons`, { cache: 'no-store', headers });
    
    // If not found by slug, fallback to documentId
    if (!res.data || res.data.length === 0) {
      res = await fetchWithAuth(`/courses?filters[documentId][$eq]=${slug}&populate[0]=instructor&populate[1]=lessons`, { cache: 'no-store', headers });
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
