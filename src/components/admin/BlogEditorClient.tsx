"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Page } from "@/components/Page";
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, Textarea, useToast } from "@/components/ui";
import { createBlogPost, updateBlogPost, publishBlogPost } from "@/lib/actions/blog";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogEditorClient({ 
  initialData, 
  authorName,
  returnPath 
}: { 
  initialData?: any, 
  authorName?: string,
  returnPath: string
}) {
  const toast = useToast();
  const router = useRouter();
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  // Strapi v5 rich text or basic text. 
  // Wait, if it's rich text in Strapi v5, we might need a specific format, but let's assume it accepts strings if it's standard text or we can just send it.
  const [body, setBody] = useState(initialData?.body || "");
  
  const [isSaving, setIsSaving] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(initialData?.documentId || null);
  const [isPublished, setIsPublished] = useState(!!initialData?.publishedAt);

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim() || !body.trim()) {
      toast("Title and body are required", "danger");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        body,
        coverImage,
      };

      let newDocId = documentId;
      
      if (documentId) {
        await updateBlogPost(documentId, payload);
      } else {
        const res = await createBlogPost(payload);
        newDocId = res.documentId;
        setDocumentId(newDocId);
        // Replace URL so back button works better
        window.history.replaceState(null, '', `${returnPath}/${newDocId}`);
      }
      
      if (publish && newDocId) {
        await publishBlogPost(newDocId);
        setIsPublished(true);
        toast("Post published successfully", "success");
      } else {
        toast("Draft saved successfully", "info");
      }
      
      router.refresh();
      
    } catch (error: any) {
      toast(error.message || "Failed to save post", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Page
      title={documentId ? "Edit Post" : "New Post"}
      subtitle={isPublished ? "Published" : "Draft"}
      actions={
        <>
          <Link href={returnPath}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save draft"}
          </Button>
          {!isPublished && (
            <Button onClick={() => handleSave(true)} disabled={isSaving}>
              Publish
            </Button>
          )}
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="h-fit">
          <CardHeader title="Compose" />
          <div className="p-5 space-y-4">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Future of Learning" />
            </Field>
            <Field label="Cover image URL" hint="A direct link to an image">
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </Field>
            
            <Field label="Body" hint="Write your post content here.">
              <Textarea rows={15} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Live article preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <Eye size={14} /> Live article preview
            </div>
            {coverImage ? (
              <div className="aspect-[16/8] bg-muted overflow-hidden">
                <img
                  src={coverImage.startsWith('http') ? coverImage : `https://images.unsplash.com/photo-${coverImage}?w=800&h=400&fit=crop&auto=format`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
               <div className="aspect-[16/8] bg-muted flex items-center justify-center text-muted-foreground">
                 No cover image
               </div>
            )}
            <div className="p-6">
              <h1 className="text-2xl font-semibold tracking-tight leading-tight">{title || 'Untitled Post'}</h1>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Avatar name={authorName || "Author"} size={28} /> {authorName || "Author"} · {new Date().toLocaleDateString()}
              </div>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
                {body ? body.split("\n\n").map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                )) : <p className="text-muted-foreground italic">Your content will appear here...</p>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
