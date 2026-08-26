'use server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getBlogPosts() {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts?populate=author&sort=publishedAt:desc`, {
    next: { revalidate: 60 } // revalidate every minute
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  const data = await res.json();
  return data.data;
}

export async function getBlogPost(documentId: string) {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts/${documentId}?populate=author`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog post');
  }

  const data = await res.json();
  return data.data;
}
import { fetchWithAuth } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createBlogPost(data: any) {
  const res = await fetchWithAuth('/api/blog-posts', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('Failed to create post');
  revalidatePath('/dashboard/admin/blog');
  revalidatePath('/dashboard/manager/blog');
  return await res.json();
}

export async function updateBlogPost(documentId: string, data: any) {
  const res = await fetchWithAuth(`/api/blog-posts/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('Failed to update post');
  revalidatePath('/dashboard/admin/blog');
  revalidatePath('/dashboard/manager/blog');
  return await res.json();
}

export async function deleteBlogPost(documentId: string) {
  const res = await fetchWithAuth(`/api/blog-posts/${documentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete post');
  revalidatePath('/dashboard/admin/blog');
  revalidatePath('/dashboard/manager/blog');
  return true;
}

export async function publishBlogPost(documentId: string) {
  const res = await fetchWithAuth(`/api/blog-posts/${documentId}/actions/publish`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to publish post');
  revalidatePath('/dashboard/admin/blog');
  revalidatePath('/dashboard/manager/blog');
  return await res.json();
}

export async function unpublishBlogPost(documentId: string) {
  const res = await fetchWithAuth(`/api/blog-posts/${documentId}/actions/unpublish`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to unpublish post');
  revalidatePath('/dashboard/admin/blog');
  revalidatePath('/dashboard/manager/blog');
  return await res.json();
}
