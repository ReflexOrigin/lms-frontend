"use client";
import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, PenSquare } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { courses, unsplash } from "@/data";
import { Badge, Card, StatusPill, cx } from "@/components/ui";

export default function CourseLibrary() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState("all");
  const list = courses.filter((c) => status === "all" || c.status === status);

  return (
    <Page
      title="Course Library"
      subtitle="Author, organize, and publish the platform's courses."
      actions={<Link href="/manager/builder"><NewButton label="New course" /></Link>}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {["all", "published", "draft", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cx(
                "px-3 h-8 rounded-lg text-sm font-medium capitalize transition",
                status === s ? "accent-soft-bg accent-text" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          <button onClick={() => setView("grid")} className={cx("w-8 h-7 rounded-md flex items-center justify-center", view === "grid" && "bg-card shadow-sm")}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setView("list")} className={cx("w-8 h-7 rounded-md flex items-center justify-center", view === "list" && "bg-card shadow-sm")}>
            <List size={15} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => (
            <Link key={c.id} href="/manager/builder" className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-[16/9] bg-muted overflow-hidden relative">
                <img src={unsplash(c.thumbId, 560, 315)} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-3 right-3">
                  <StatusPill status={c.status} />
                </div>
              </div>
              <div className="p-4">
                <Badge tone="neutral">{c.category}</Badge>
                <h3 className="font-semibold mt-2.5 group-hover:accent-text transition-colors">{c.title}</h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{c.lessons.length} lessons</span>
                  <span>·</span>
                  <span>{c.students.toLocaleString()} students</span>
                  <span className="ml-auto flex items-center gap-1 accent-text font-medium">
                    <PenSquare size={13} /> Edit
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {list.map((c) => (
            <Link key={c.id} href="/manager/builder" className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40">
              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                <img src={unsplash(c.thumbId, 120, 120)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.category} · {c.lessons.length} lessons · {c.updated}</div>
              </div>
              <StatusPill status={c.status} />
            </Link>
          ))}
        </Card>
      )}
    </Page>
  );
}

