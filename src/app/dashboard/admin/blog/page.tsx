"use client";
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { blogPosts as seed, type BlogPost } from "@/data";
import { Avatar, Badge, Button, Card, StatusPill, useToast } from "@/components/ui";

export default function AdminBlog() {
  const toast = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(seed);

  const toggle = (id: string) =>
    setPosts((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === "published" ? "draft" : "published";
        toast(next === "published" ? `“${p.title}” published` : `“${p.title}” unpublished`, next === "published" ? "success" : "warning");
        return { ...p, status: next };
      }),
    );

  const published = posts.filter((p) => p.status === "published").length;

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
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3 max-w-xs">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Avatar name={p.author} size={24} /> {p.author}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {/* Unmistakable draft vs published distinction */}
                  {p.status === "published" ? (
                    <Badge tone="success" dot>
                      Published
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[var(--color-warning)] text-[var(--color-warning)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" /> Draft
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{p.published}</td>
                <td className="px-3 py-3 text-muted-foreground">{p.updated}</td>
                <td className="px-3 py-3 text-right tabular-nums">{p.views.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => toggle(p.id)}>
                      {p.status === "published" ? "Unpublish" : "Publish"}
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
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

