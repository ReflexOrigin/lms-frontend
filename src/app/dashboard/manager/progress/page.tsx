import { Page } from "@/components/Page";
import { Card, CardHeader, StatCard, StatusPill } from "@/components/ui";
import { BarChart, StackedBar } from "@/components/charts";
import { fetchWithAuth } from "@/lib/api";

export default async function ContentProgress() {
  let courses: any[] = [];
  let enrollments: any[] = [];
  
  try {
    const [coursesRes, enrollmentsRes] = await Promise.all([
      fetchWithAuth('/api/courses?populate=lessons&managerView=true'),
      fetchWithAuth('/api/enrollments?populate=student,course')
    ]);

    if (coursesRes.ok) courses = (await coursesRes.json()).data || [];
    if (enrollmentsRes.ok) enrollments = (await enrollmentsRes.json()).data || [];
  } catch (error) {
    console.error("Failed to fetch manager progress", error);
  }

  const engagement = courses
    .filter((c) => c.publishedAt)
    .map((c) => ({ label: c.title.split(" ").slice(0, 2).join(" "), value: c.completion || 0 }));

  const avgCompletion = enrollments.length
    ? Math.round(enrollments.reduce((s, x) => s + (x.progressPercentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <Page title="Content Progress" subtitle="How learners are engaging with your content.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} accentIcon />
        <StatCard label="Avg. Quiz Score" value="0%" />
        <StatCard label="Active This Week" value={enrollments.length} />
        <StatCard label="Content Rating" value="4.8" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader title="Completion by Course" />
          <div className="px-5 py-6">
            <BarChart data={engagement} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Learner Progress Split" subtitle="Across published courses" />
          <div className="px-5 py-8">
            <StackedBar
              segments={[
                { label: "Completed", value: enrollments.filter(e => e.progressPercentage >= 100).length, color: "#16a34a" },
                { label: "In progress", value: enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length, color: "#7c3aed" },
                { label: "Stalled", value: enrollments.filter(e => e.progressPercentage === 0).length, color: "#e5e8ee" },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader title="Course Performance" />
        <table className="w-full text-sm min-w-[680px] mt-3">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-y border-border">
              <th className="font-medium px-5 py-2.5">Course</th>
              <th className="font-medium px-3 py-2.5 text-right">Enrollments</th>
              <th className="font-medium px-3 py-2.5 text-right">Completion</th>
              <th className="font-medium px-3 py-2.5 text-right">Quiz Avg</th>
              <th className="font-medium px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? courses.map((c) => (
              <tr key={c.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3 font-medium">{c.title}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.students || 0}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.completion || 0}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.quizAvg || 0}%</td>
                <td className="px-5 py-3">
                  <StatusPill status={c.publishedAt ? 'published' : 'draft'} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No courses exist on the platform.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

