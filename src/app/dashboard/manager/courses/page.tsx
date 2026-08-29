import Link from "next/link";
import { LayoutGrid, List, PenSquare } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { Badge, Card, StatusPill } from "@/components/ui";
import { cx } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default async function CourseLibrary(props: { searchParams: Promise<{ view?: string, status?: string }> }) {
  const searchParams = await props.searchParams;
  const view = searchParams.view === "list" ? "list" : "grid";
  const statusFilter = searchParams.status || "all";

  let courses: any[] = [];
  try {
    const res = await fetchWithAuth('/api/courses?populate=lessons', { headers: { 'x-manager-view': 'true' } });
    if (res.ok) {
      courses = (await res.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch manager courses", error);
  }

  const list = courses.filter((c) => {
    if (statusFilter === "all") return true;
    const s = c.publishedAt ? "published" : "draft";
    return s === statusFilter;
  });

  return (
    <Page
      title="Course Library"
      subtitle="Author, organize, and publish the platform's courses."
      actions={<Link href="/courses/create"><NewButton label="New course" /></Link>}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {["all", "published", "draft"].map((s) => (
            <Link
              key={s}
              href={`?view=${view}&status=${s}`}
              className={cx(
                "px-3 h-8 rounded-lg text-sm flex items-center font-medium capitalize transition",
                statusFilter === s ? "accent-soft-bg accent-text" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </Link>
          ))}
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          <Link href={`?view=grid&status=${statusFilter}`} className={cx("w-8 h-7 rounded-md flex items-center justify-center", view === "grid" && "bg-card shadow-sm text-foreground", view !== "grid" && "text-muted-foreground")}>
            <LayoutGrid size={15} />
          </Link>
          <Link href={`?view=list&status=${statusFilter}`} className={cx("w-8 h-7 rounded-md flex items-center justify-center", view === "list" && "bg-card shadow-sm text-foreground", view !== "list" && "text-muted-foreground")}>
            <List size={15} />
          </Link>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => (
            <Link key={c.documentId} href={`/courses/${c.documentId}/edit`} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-[16/9] bg-blue-50 flex items-center justify-center relative">
                <span className="text-blue-400 font-medium text-sm">Course Cover</span>
                <div className="absolute top-3 right-3">
                  <StatusPill status={c.publishedAt ? "published" : "draft"} />
                </div>
              </div>
              <div className="p-4">
                <Badge tone="neutral">{c.category?.name || 'General'}</Badge>
                <h3 className="font-semibold mt-2.5 group-hover:accent-text transition-colors">{c.title}</h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{c.lessons?.length || 0} lessons</span>
                  <span>·</span>
                  <span>{c.students || 0} students</span>
                  <span className="ml-auto flex items-center gap-1 accent-text font-medium">
                    <PenSquare size={13} /> Edit
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {list.length === 0 && (
            <div className="col-span-full p-12 text-center text-gray-500 border border-dashed rounded-xl">
              No courses found matching this status.
            </div>
          )}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {list.map((c) => (
            <Link key={c.documentId} href={`/courses/${c.documentId}/edit`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <span className="text-blue-400 font-medium text-xs">Cover</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.category?.name || 'General'} · {c.lessons?.length || 0} lessons · {new Date(c.updatedAt).toLocaleDateString()}</div>
              </div>
              <StatusPill status={c.publishedAt ? "published" : "draft"} />
            </Link>
          ))}
          {list.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No courses found matching this status.
            </div>
          )}
        </Card>
      )}
    </Page>
  );
}

