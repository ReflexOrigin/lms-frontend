"use client";
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { Avatar, Badge, Button, Card, useToast } from "@/components/ui";

export default function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const toast = useToast();
  const [posts, setPosts] = useState<any[]>(initialPosts);

  const toggle = (id: string) =>
    setPosts((ps) =>
      ps.map((p) => {
        if (p.documentId !== id) return p;
        const next = p.publishedAt ? null : new Date().toISOString();
        const isPublished = !!next;
        toast(
          isPublished ? `“${p.title}” published` : `“${p.title}” unpublished`,
          isPublished ? "success" : "warning"
        );
        return { ...p, publishedAt: next };
      }),
    );

  const published = posts.filter((p) => p.publishedAt).length;

  return (
    <Page
      title="Blog Management"
      subtitle={`${posts.length} posts · ${published} published`}
      actions={<NewButton label="New post" />}
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
              <tr key={p.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
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
                    <Button size="sm" variant="outline" onClick={() => toggle(p.documentId)}>
                      {p.publishedAt ? "Unpublish" : "Publish"}
                    </Button>
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <Eye size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <Pencil size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center text-muted-foreground">
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
