import Link from "next/link";
import { Eye, Filter, Pencil, Search, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";

export default async function AdminCourses({ searchParams }: { searchParams: any }) {
  const query = searchParams?.q?.toLowerCase() || "";
  const statusFilter = searchParams?.status || "all";
  const instructorFilter = searchParams?.instructor || "all";
  const categoryFilter = searchParams?.category || "all";

  let courses: any[] = [];
  try {
    const res = await fetchWithAuth('/api/courses?populate=instructor,lessons,category');
    if (res.ok) {
      courses = (await res.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch admin courses", error);
  }

  const instructors = Array.from(new Set(courses.map((c) => c.instructor?.username).filter(Boolean)));
  const cats = Array.from(new Set(courses.map((c) => c.category?.name).filter(Boolean)));

  let list = courses;
  if (statusFilter !== "all") {
    list = list.filter((c) => statusFilter === "published" ? c.publishedAt : !c.publishedAt);
  }
  if (instructorFilter !== "all") {
    list = list.filter((c) => c.instructor?.username === instructorFilter);
  }
  if (categoryFilter !== "all") {
    list = list.filter((c) => c.category?.name === categoryFilter);
  }
  if (query) {
    list = list.filter((c) => c.title.toLowerCase().includes(query));
  }

  return (
    <Page
      title="Course Management"
      subtitle="Every course on the platform, across all instructors."
      actions={<NewButton label="Create course" />}
    >
      <Card className="overflow-hidden">
        <form className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-border">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search courses" 
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" 
            />
          </div>
          <select name="status" defaultValue={statusFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select name="instructor" defaultValue={instructorFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
            <option value="all">All instructors</option>
            {instructors.map((i: any) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select name="category" defaultValue={categoryFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
            <option value="all">All categories</option>
            {cats.map((c: any) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <noscript><button type="submit" className="hidden">Filter</button></noscript>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                <th className="font-medium px-5 py-3">Course</th>
                <th className="font-medium px-3 py-3">Instructor</th>
                <th className="font-medium px-3 py-3 text-right">Lessons</th>
                <th className="font-medium px-3 py-3 text-right">Students</th>
                <th className="font-medium px-3 py-3">Completion</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3">Updated</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const completion = c.completion || 0;
                return (
                  <tr key={c.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/admin/courses/${c.documentId}`} className="font-medium hover:accent-text">
                        {c.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">{c.category?.name || 'Uncategorized'}</div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.instructor?.username || 'System'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.lessons?.length || 0}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.students || 0}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full accent-bg rounded-full" style={{ width: `${completion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{completion}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={c.publishedAt ? 'published' : 'draft'} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Link href={`/dashboard/admin/courses/${c.documentId}`} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Eye size={16} />
                        </Link>
                        <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Pencil size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {list.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
          <Filter size={15} /> No courses match these filters.
        </div>
      )}
    </Page>
  );
}

