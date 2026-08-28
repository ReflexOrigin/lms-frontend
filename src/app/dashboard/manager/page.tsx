import Link from "next/link";
import { BookOpen, FileText, GraduationCap, ListChecks, Newspaper, PenSquare } from "lucide-react";
import { Page } from "@/components/Page";
import { Avatar, Badge, Button, Card, CardHeader, StatusPill } from "@/components/ui";
import { StackedBar } from "@/components/charts";
import { fetchWithAuth } from "@/lib/api";

export default async function ManagerDashboard() {
  let courses: any[] = [];
  let enrollments: any[] = [];
  let blogs: any[] = []; // Assuming a future blogs endpoint
  
  try {
    const [coursesRes, enrollmentsRes, blogsRes] = await Promise.all([
      fetchWithAuth('/api/courses?populate=lessons&managerView=true'),
      fetchWithAuth('/api/enrollments'),
      fetchWithAuth('/api/blog-posts').catch(() => ({ ok: false, json: () => ({ data: [] }) })) // Fallback if blogs don't exist yet
    ]);

    if (coursesRes.ok) courses = (await coursesRes.json()).data || [];
    if (enrollmentsRes.ok) enrollments = (await enrollmentsRes.json()).data || [];
    if (blogsRes.ok) blogs = (await blogsRes.json()).data || [];
  } catch (error) {
    console.error("Failed to fetch manager data", error);
  }

  const published = courses.filter((c) => c.publishedAt).length;
  const drafts = courses.filter((c) => !c.publishedAt).length;
  const lessons = courses.reduce((s, c) => s + (c.lessons?.length || 0), 0);
  const recent = [...courses].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);

  const metrics = [
    { l: "Total Courses", v: courses.length, icon: BookOpen },
    { l: "Published", v: published, icon: GraduationCap },
    { l: "Drafts", v: drafts, icon: FileText },
    { l: "Total Lessons", v: lessons, icon: FileText },
    { l: "Total Quizzes", v: 0, icon: ListChecks }, // Update when quizzes are fully fetched
    { l: "Enrollments", v: enrollments.length.toLocaleString(), icon: GraduationCap },
  ];

  return (
    <Page
      title="Content Studio"
      subtitle="Everything you're building for learners, in one place."
      actions={
        <>
          <Link href="/dashboard/manager/blog">
            <Button variant="outline">
              <Newspaper size={16} /> Write post
            </Button>
          </Link>
          <Link href="/courses/create">
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
              <Link href="/dashboard/manager/courses">
                <Button variant="ghost" size="sm">
                  Library
                </Button>
              </Link>
            }
          />
          <div className="p-4 grid sm:grid-cols-2 gap-3">
            {recent.map((c) => (
              <Link
                key={c.documentId}
                href={`/courses/${c.documentId}/edit`}
                className="flex gap-3 p-3 rounded-xl border border-border hover:border-[var(--accent)] hover:shadow-sm transition"
              >
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 font-medium text-xs">Cover</span>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.lessons?.length || 0} lessons · {new Date(c.updatedAt).toLocaleDateString()}</div>
                  <div className="mt-1.5">
                    <StatusPill status={c.publishedAt ? 'published' : 'draft'} />
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
                  { label: "Archived", value: 0, color: "#94a3b8" },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Student Engagement" subtitle="Avg. completion by course" />
            <div className="px-5 pb-5 pt-3 space-y-3">
              {courses.slice(0, 3).map((c) => {
                const completion = c.completion || 0; // Fallback to 0 if not calculated by backend
                return (
                  <div key={c.documentId}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate mr-2">{c.title}</span>
                      <span className="text-muted-foreground tabular-nums">{completion}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full accent-bg rounded-full" style={{ width: `${completion}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent blog activity */}
      <Card className="mt-4">
        <CardHeader
          title="Recent Blog Activity"
          action={
            <Link href="/dashboard/manager/blog">
              <Button variant="ghost" size="sm">
                Open editor
              </Button>
            </Link>
          }
        />
        {blogs.length > 0 ? (
          <div className="divide-y divide-border">
            {blogs.map((p) => (
              <div key={p.documentId} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={p.author?.username || 'Unknown'} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.author?.username || 'Unknown'} · {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : `edited ${new Date(p.updatedAt).toLocaleDateString()}`}
                  </div>
                </div>
                {p.publishedAt ? (
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
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 border-t border-border">
            No blog posts published or drafted yet.
          </div>
        )}
      </Card>
    </Page>
  );
}

