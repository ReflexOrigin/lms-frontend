"use client";
import Link from "next/link";
import { BookOpen, FileText, GraduationCap, ListChecks, Newspaper, PenSquare } from "lucide-react";
import { Page } from "@/components/Page";
import { blogPosts, courses, unsplash } from "@/data";
import { Avatar, Badge, Button, Card, CardHeader, StatusPill } from "@/components/ui";
import { StackedBar } from "@/components/charts";

export default function ManagerDashboard() {
  const published = courses.filter((c) => c.status === "published").length;
  const drafts = courses.filter((c) => c.status === "draft").length;
  const lessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const recent = [...courses].slice(0, 4);

  const metrics = [
    { l: "Total Courses", v: courses.length, icon: BookOpen },
    { l: "Published", v: published, icon: GraduationCap },
    { l: "Drafts", v: drafts, icon: FileText },
    { l: "Total Lessons", v: lessons, icon: FileText },
    { l: "Total Quizzes", v: 18, icon: ListChecks },
    { l: "Enrollments", v: "12,840", icon: GraduationCap },
  ];

  return (
    <Page
      title="Content Studio"
      subtitle="Everything you're building for learners, in one place."
      actions={
        <>
          <Link href="/manager/blog">
            <Button variant="outline">
              <Newspaper size={16} /> Write post
            </Button>
          </Link>
          <Link href="/manager/builder">
            <Button>
              <PenSquare size={16} /> New course
            </Button>
          </Link>
        </>
      }
    >
      {/* Content metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <Card key={m.l} className="p-4">
            <m.icon size={18} className="accent-text" />
            <div className="text-2xl font-semibold mt-3 tabular-nums">{m.v}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{m.l}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Content activity — the CM's primary surface */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Content Activity"
            subtitle="Recently edited courses & lessons"
            action={
              <Link href="/manager/courses">
                <Button variant="ghost" size="sm">
                  Library
                </Button>
              </Link>
            }
          />
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            {recent.map((c) => (
              <Link
                key={c.id}
                href="/manager/builder"
                className="flex gap-3 p-3 rounded-xl border border-border hover:border-[var(--accent)] hover:shadow-sm transition"
              >
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img src={unsplash(c.thumbId, 160, 160)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.lessons.length} lessons · {c.updated}</div>
                  <div className="mt-1.5">
                    <StatusPill status={c.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Course status distribution */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Course Status" />
            <div className="px-5 py-6">
              <StackedBar
                segments={[
                  { label: "Published", value: published, color: "#16a34a" },
                  { label: "Draft", value: drafts, color: "#d97706" },
                  { label: "Archived", value: 1, color: "#94a3b8" },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Student Engagement" subtitle="Avg. completion by course" />
            <div className="px-5 pb-5 pt-3 space-y-3">
              {courses.slice(0, 3).map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="truncate mr-2">{c.title}</span>
                    <span className="text-muted-foreground tabular-nums">{c.completion}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full accent-bg rounded-full" style={{ width: `${c.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent blog activity */}
      <Card className="mt-4">
        <CardHeader
          title="Recent Blog Activity"
          action={
            <Link href="/manager/blog">
              <Button variant="ghost" size="sm">
                Open editor
              </Button>
            </Link>
          }
        />
        <div className="divide-y divide-border">
          {blogPosts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
              <Avatar name={p.author} size={30} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.author} · {p.status === "published" ? p.published : `edited ${p.updated}`}
                </div>
              </div>
              {p.status === "published" ? (
                <Badge tone="success" dot>
                  Published
                </Badge>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[var(--color-warning)] text-[var(--color-warning)]">
                  Draft
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

