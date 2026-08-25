"use client";
import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Page } from "@/components/Page";
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, Textarea, useToast } from "@/components/ui";

export default function BlogEditor() {
  const toast = useToast();
  const [title, setTitle] = useState("The State of ML Education in 2026");
  const [cover, setCover] = useState("1516321318423-f06f85e504b3");
  const [tags, setTags] = useState(["Machine Learning", "Pedagogy"]);
  const [body, setBody] = useState(
    "For years, machine-learning education optimized for breadth: cram every algorithm into a semester and hope intuition follows.\n\nThe shift underway is subtle but profound. Evaluation-first teaching asks a different opening question: not “which model?” but “how will we know it works?”\n\nThe platforms that thrive will be the ones that make feedback loops tight, honest, and frequent. Everything else is decoration.",
  );

  const removeTag = (t: string) => setTags((ts) => ts.filter((x) => x !== t));

  return (
    <Page
      title="Blog Editor"
      subtitle="Draft"
      actions={
        <>
          <Button variant="outline" onClick={() => toast("Draft saved", "info")}>
            Save draft
          </Button>
          <Button variant="outline">Preview</Button>
          <Button onClick={() => toast("Post published")}>Publish</Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="h-fit">
          <CardHeader title="Compose" />
          <div className="p-5 space-y-4">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Cover image ID" hint="Unsplash photo ID">
              <Input value={cover} onChange={(e) => setCover(e.target.value)} />
            </Field>
            <div>
              <span className="block text-[13px] font-medium mb-1.5">Tags</span>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs">
                    {t}
                    <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    setTags((ts) => [...ts, e.currentTarget.value.trim()]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <Field label="Author">
              <Input defaultValue="Sarah Karim" />
            </Field>
            <Field label="Body" hint="Separate paragraphs with a blank line.">
              <Textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Live article preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <Eye size={14} /> Live article preview
            </div>
            <div className="aspect-[16/8] bg-muted overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${cover}?w=800&h=400&fit=crop&auto=format`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex gap-1.5 mb-3">
                {tags.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight leading-tight">{title}</h1>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Avatar name="Sarah Karim" size={28} /> Sarah Karim · Aug 25, 2026
              </div>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
                {body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

