import { fetchWithAuth } from "@/lib/api";
import BlogClient from "../../admin/blog/BlogClient";

export default async function ManagerBlog() {
  let blogs: any[] = [];
  try {
    const res = await fetchWithAuth('/api/blog-posts?populate=author,category');
    if (res.ok) {
      blogs = (await res.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch manager blogs", error);
  }

  return <BlogClient initialPosts={blogs} basePath="/dashboard/manager/blog" />;
}

