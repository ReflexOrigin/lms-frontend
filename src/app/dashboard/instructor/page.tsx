import Link from "next/link";
import { Award, TrendingUp, Users } from "lucide-react";
import { Page } from "@/components/Page";
import { Badge, Button, Card, CardHeader, StatCard, StatusPill } from "@/components/ui";
import { getCourses } from "@/lib/services/courseService";
import { getCurrentUser } from "@/lib/services/userService";

export default async function InstructorDashboard() {
  const user = await getCurrentUser();
  const myCourses = await getCourses('managerView=true'); // Backend auto-filters by instructor

  const totalStudents = myCourses.reduce((s, c) => s + (c.students || 0), 0);
  const avgCompletion = myCourses.length 
    ? Math.round(myCourses.reduce((s, c) => s + (c.completion || 0), 0) / myCourses.length) 
    : 0;
  const avgQuiz = myCourses.length 
    ? Math.round(myCourses.reduce((s, c) => s + (c.quizAvg || 0), 0) / myCourses.length) 
    : 0;
  
  // Dummy fallback for atRisk since we don't have a progress API endpoint fully built in UI yet
  const atRisk = 0;

  return (
    <Page
      title={`Welcome back, ${user?.username || 'Instructor'}`}
      subtitle="Here's how your courses and students are doing."
      actions={
        <Link href="/dashboard/instructor/progress">
          <Button>
            <TrendingUp size={16} /> Student progress
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={myCourses.length} accentIcon icon={<Award size={16} />} />
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={<Users size={16} />} />
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} />
        <StatCard label="Avg. Quiz Score" value={`${avgQuiz}%`} />
      </div>

      {atRisk > 0 && (
        <Card className="mt-4 p-4 flex items-center gap-3 border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)]/40">
          <span className="w-9 h-9 rounded-lg bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </span>
          <p className="text-sm flex-1">
            <strong>{atRisk} students</strong> across your courses are at risk of falling behind.
          </p>
          <Link href="/dashboard/instructor/progress">
            <Button size="sm" variant="outline">
              Review
            </Button>
          </Link>
        </Card>
      )}

      {/* Course performance cards */}
      <h2 className="text-lg font-semibold tracking-tight mt-8 mb-4">My Courses</h2>
      
      {myCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myCourses.map((c) => (
            <Card key={c.documentId} className="overflow-hidden flex flex-col">
              <div className="aspect-[16/8] bg-muted overflow-hidden relative">
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-400 font-medium text-sm">Course Cover</span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusPill status={c.status} />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold leading-snug">{c.title}</h3>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div>
                    <div className="text-lg font-semibold tabular-nums">{c.students || 0}</div>
                    <div className="text-[11px] text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold tabular-nums">{c.completion || 0}%</div>
                    <div className="text-[11px] text-muted-foreground">Completion</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold tabular-nums">{c.quizAvg || 0}%</div>
                    <div className="text-[11px] text-muted-foreground">Quiz avg</div>
                  </div>
                </div>
                <Link href={`/courses/${c.slug || c.documentId}/edit`} className="mt-4">
                  <Button variant="outline" className="w-full">
                    View course
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium mb-4">You haven't authored any courses yet.</p>
          <Link href="/dashboard/instructor/courses">
            <Button>Create a Course</Button>
          </Link>
        </Card>
      )}
    </Page>
  );
}

