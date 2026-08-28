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

export async function getAdminStats() {
  const res = await fetchWithAuth('/admin-custom/stats');
  return res.data;
}

export async function getAdminUsers() {
  const res = await fetchWithAuth('/admin-custom/users');
  return res.data;
}

export async function updateUserRole(userId: string, roleId: number) {
  const res = await fetchWithAuth(`/admin-custom/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ data: { roleId } })
  });
  return res.data;
}

export async function deleteUser(userId: string) {
  const res = await fetchWithAuth(`/admin-custom/users/${userId}`, {
    method: 'DELETE'
  });
  return res.data;
}

export async function getAllRoles() {
  const res = await fetchWithAuth('/users-permissions/roles');
  return res.roles;
}

export async function suspendUser(userId: string, blocked: boolean) {
  const res = await fetchWithAuth(`/admin-custom/users/${userId}/suspend`, {
    method: 'PUT',
    body: JSON.stringify({ data: { blocked } })
  });
  return res.data;
}
