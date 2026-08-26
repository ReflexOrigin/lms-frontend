"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Video,
  FileText,
} from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, CardHeader, Field, Input, Select, Textarea, useToast } from "@/components/ui";

const baseCourse = {
  lessons: [
    { id: "1", order: 1, title: "Welcome to the Course", summary: "Introduction", duration: "5 min", status: "published", type: "video" },
    { id: "2", order: 2, title: "Getting Started", summary: "Setup instructions", duration: "10 min", status: "published", type: "reading" }
  ]
};

export default function CourseBuilder() {
  const toast = useToast();
  const [lessons, setLessons] = useState(baseCourse.lessons);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= lessons.length) return;
    const next = [...lessons];
    [next[i], next[j]] = [next[j], next[i]];
    setLessons(next.map((l, idx) => ({ ...l, order: idx + 1 })));
  };

  const remove = (id: string) => {
    setLessons((ls) => ls.filter((l) => l.id !== id).map((l, idx) => ({ ...l, order: idx + 1 })));
    toast("Lesson removed", "warning");
  };

  const add = () => {
    setLessons((ls) => [
      ...ls,
      {
        id: `new-${Date.now()}`,
        order: ls.length + 1,
        title: "Untitled lesson",
        summary: "Add a description for this lesson.",
        duration: "0 min",
        status: "draft" as const,
        type: "reading" as const,
      },
    ]);
  };

  return (
    <Page
      title="Course Builder"
      subtitle="Introduction to Machine Learning"
      actions={
        <>
          <Button variant="outline">Save draft</Button>
          <Button onClick={() => toast("Course published")}>Publish course</Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Course details */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Course details" />
          <div className="p-5 space-y-4">
            <Field label="Course title">
              <Input defaultValue="Introduction to Machine Learning" />
            </Field>
            <Field label="Description">
              <Textarea rows={4} defaultValue="Build a rigorous mental model of supervised learning, from linear models through model evaluation." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select defaultValue="Data Science">
                  <option>Data Science</option>
                  <option>Programming</option>
                  <option>Security</option>
                </Select>
              </Field>
              <Field label="Status">
                <Select defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </Field>
            </div>
            <Field label="Instructor">
              <Select defaultValue="Aisha Rahman">
                <option>Aisha Rahman</option>
                <option>Mahmud Hasan</option>
                <option>Imran Kabir</option>
              </Select>
            </Field>
            <Field label="Thumbnail URL" hint="Displayed on the course card and detail page.">
              <Input defaultValue="https://images.unsplash.com/photo-1518770660439-4636190af475" />
            </Field>
          </div>
        </Card>

        {/* Lesson structure */}
        <Card className="lg:col-span-2 h-fit">
          <CardHeader
            title="Lesson structure"
            subtitle={`${lessons.length} lessons`}
            action={
              <Button size="sm" onClick={add}>
                <Plus size={15} /> Add lesson
              </Button>
            }
          />
          <div className="p-3 space-y-2">
            {lessons.map((l, i) => (
              <div key={l.id} className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-[var(--accent)]/50 transition">
                <GripVertical size={16} className="text-muted-foreground/50 cursor-grab" />
                <span className="w-7 text-sm font-mono text-muted-foreground">{String(l.order).padStart(2, "0")}</span>
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  {l.type === "video" ? <Video size={15} /> : <FileText size={15} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.duration} · {l.status}</div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === lessons.length - 1} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                  <Link href="/manager/lesson" className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
                    <Pencil size={14} />
                  </Link>
                  <Link href="/manager/lesson" className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
                    <Eye size={14} />
                  </Link>
                  <button onClick={() => remove(l.id)} className="w-7 h-7 rounded-md hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center text-muted-foreground">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-[var(--accent)] hover:accent-text transition">
              <Plus size={16} /> Add lesson
            </button>
          </div>
        </Card>
      </div>
    </Page>
  );
}

