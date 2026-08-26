import { fetchWithAuth } from "@/lib/api";
import BlogClient from "./BlogClient";

export default async function AdminBlog() {
  let blogs: any[] = [];
  try {
    const res = await fetchWithAuth('/api/blog-posts?populate=author,category');
    if (res.ok) {
      blogs = (await res.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch admin blogs", error);
  }

  return <BlogClient initialPosts={blogs} />;
}

