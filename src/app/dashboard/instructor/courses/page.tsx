import Link from "next/link";
import { FileText, ListChecks, TrendingUp, Users } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { getCourses } from "@/lib/actions/course";

export default async function InstructorCourses() {
  const myCourses = await getCourses('', true); // Backend auto-filters for the instructor

  return (
    <Page 
      title="My Courses" 
      subtitle="Courses you own and teach. You can only manage your own."
      actions={
        <Link href="/dashboard/instructor/courses/new">
          <Button>Create Course</Button>
        </Link>
      }
    >
      {myCourses.length > 0 ? (
        <Card className="divide-y divide-border overflow-hidden">
          {myCourses.map((c: any) => (
            <div key={c.documentId} className="flex flex-col md:flex-row md:items-center gap-4 p-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-xs font-medium text-blue-500">Cover</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${c.slug || c.documentId}/edit`} className="font-semibold hover:accent-text">
                      {c.title}
                    </Link>
                    <StatusPill status={c.status || (c.publishedAt ? 'published' : 'draft')} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users size={13} /> {c.students || 0} students</span>
                    <span className="flex items-center gap-1"><FileText size={13} /> {c.lessons?.length || 0} lessons</span>
                    <span>{c.completion || 0}% completion</span>
                    <span>{c.quizAvg || 0}% quiz avg</span>
                    <span>Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Link href={`/courses/${c.slug || c.documentId}/edit`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>
                <Link href="/dashboard/instructor/lessons">
                  <Button size="sm" variant="ghost"><FileText size={14} /> Lessons</Button>
                </Link>
                <Link href="/dashboard/instructor/quizzes">
                  <Button size="sm" variant="ghost"><ListChecks size={14} /> Quizzes</Button>
                </Link>
                <Link href="/dashboard/instructor/progress">
                  <Button size="sm" variant="ghost"><TrendingUp size={14} /> Progress</Button>
                </Link>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card className="p-8 text-center bg-gray-50 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium mb-4">You haven't authored any courses yet.</p>
          <Link href="/dashboard/instructor/courses/new">
            <Button>Create a Course</Button>
          </Link>
        </Card>
      )}
    </Page>
  );
}


