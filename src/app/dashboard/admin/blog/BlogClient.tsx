"use client";
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { Avatar, Badge, Button, Card, useToast } from "@/components/ui";

import { deleteBlogPost, publishBlogPost, unpublishBlogPost } from "@/lib/actions/blog";
import Link from "next/link";

export default function BlogClient({ initialPosts, basePath = '/dashboard/admin/blog' }: { initialPosts: any[], basePath?: string }) {
  const toast = useToast();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggle = async (p: any) => {
    setLoadingId(p.documentId);
    try {
      if (p.publishedAt) {
        await unpublishBlogPost(p.documentId);
        toast(`“${p.title}” unpublished`, "warning");
        setPosts((ps) => ps.map((x) => x.documentId === p.documentId ? { ...x, publishedAt: null } : x));
      } else {
        await publishBlogPost(p.documentId);
        toast(`“${p.title}” published`, "success");
        setPosts((ps) => ps.map((x) => x.documentId === p.documentId ? { ...x, publishedAt: new Date().toISOString() } : x));
      }
    } catch (e: any) {
      toast(e.message || "Action failed", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoadingId(id);
    try {
      await deleteBlogPost(id);
      toast("Post deleted successfully");
      setPosts((ps) => ps.filter((x) => x.documentId !== id));
    } catch (e: any) {
      toast(e.message || "Delete failed", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const published = posts.filter((p) => p.publishedAt).length;

  return (
    <Page
      title="Blog Management"
      subtitle={`${posts.length} posts · ${published} published`}
      actions={
        <Link href={`${basePath}/new`}>
          <NewButton label="New post" />
        </Link>
      }
    >
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
              <th className="font-medium px-5 py-3">Post</th>
              <th className="font-medium px-3 py-3">Author</th>
              <th className="font-medium px-3 py-3">Status</th>
              <th className="font-medium px-3 py-3">Published</th>
              <th className="font-medium px-3 py-3">Updated</th>
              <th className="font-medium px-3 py-3 text-right">Views</th>
              <th className="font-medium px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? posts.map((p) => (
              <tr key={p.documentId} className={`border-b border-border last:border-0 hover:bg-muted/40 ${loadingId === p.documentId ? 'opacity-50 pointer-events-none' : ''}`}>
                <td className="px-5 py-3 max-w-xs">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.category?.name || 'Uncategorized'}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Avatar name={p.author?.username || 'System'} size={24} /> {p.author?.username || 'System'}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {p.publishedAt ? (
                    <Badge tone="success" dot>
                      Published
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[var(--color-warning)] text-[var(--color-warning)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" /> Draft
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{p.views || 0}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => toggle(p)}>
                      {p.publishedAt ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/blog/${p.slug || p.documentId}`} target="_blank" className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <Eye size={16} />
                    </Link>
                    <Link href={`${basePath}/${p.documentId}`} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.documentId)} className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center text-muted-foreground">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No blog posts found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
