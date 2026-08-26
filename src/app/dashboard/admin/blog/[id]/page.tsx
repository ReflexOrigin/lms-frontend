import BlogEditorClient from "@/components/admin/BlogEditorClient";
import { fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function AdminBlogEditorPage({ params }: { params: any }) {
  // Await params as required in newer Next.js versions for dynamic segments
  const { id } = await params;
  
  let initialData = null;
  
  if (id !== 'new') {
    try {
      const res = await fetchWithAuth(`/api/blog-posts/${id}?populate=author`);
      if (!res.ok) {
        if (res.status === 404) return notFound();
        throw new Error('Failed to fetch post');
      }
      const data = await res.json();
      initialData = data.data;
    } catch (e) {
      console.error(e);
      return notFound();
    }
  }

  return (
    <BlogEditorClient 
      initialData={initialData} 
      authorName={initialData?.author?.username} 
      returnPath="/dashboard/admin/blog" 
    />
  );
}
