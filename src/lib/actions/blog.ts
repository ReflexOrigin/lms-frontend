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
