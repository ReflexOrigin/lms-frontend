import Link from "next/link";
import { Eye, Filter, Pencil, Search, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";
import CourseFilter from "./CourseFilter";
import DeleteCourseButton from "./DeleteCourseButton";

export default async function AdminCourses(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.toLowerCase() || "";
  const statusFilter = searchParams?.status || "all";
  const instructorFilter = searchParams?.instructor || "all";
  const categoryFilter = searchParams?.category || "all";

  let courses: any[] = [];
  try {
    const res = await fetchWithAuth('/api/courses?populate=instructor,lessons,category', { headers: { 'x-manager-view': 'true' } });
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
      actions={<Link href="/courses/create"><NewButton label="Create course" /></Link>}
    >
      <Card className="overflow-hidden">
        <CourseFilter 
          query={query}
          statusFilter={statusFilter}
          instructorFilter={instructorFilter}
          categoryFilter={categoryFilter}
          instructors={instructors as string[]}
          cats={cats as string[]}
        />

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
                        <Link href={`/courses/${c.slug || c.documentId}/edit`} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Pencil size={16} />
                        </Link>
                        <DeleteCourseButton documentId={c.documentId} />
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

