import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Page } from "@/components/Page";
import { Avatar, Badge, Card, CardHeader, ProgressBar, StatCard } from "@/components/ui";
import { StackedBar } from "@/components/charts";
import { fetchWithAuth } from "@/lib/api";

export default async function InstructorStudentProgress() {
  let enrollments: any[] = [];
  try {
    const res = await fetchWithAuth('/api/enrollments?populate=course.lessons,user');
    if (res.ok) {
      const data = await res.json();
      enrollments = data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch enrollments for progress", error);
  }

  // Calculate stats based on enrollments
  const avg = enrollments.length
    ? Math.round(enrollments.reduce((s, x) => s + (x.progressPercentage || 0), 0) / enrollments.length)
    : 0;
  
  // Dummy fallback for quiz since we don't have a linked score in enrollments directly yet
  const avgQuiz = 0; 
  
  const atRisk = enrollments.filter((s) => (s.progressPercentage || 0) < 30 && (s.progressPercentage || 0) > 0);

  const dist = [
    { label: "0–40%", value: enrollments.filter((s) => (s.progressPercentage || 0) < 40).length, color: "#dc2626" },
    { label: "40–70%", value: enrollments.filter((s) => (s.progressPercentage || 0) >= 40 && (s.progressPercentage || 0) < 70).length, color: "#d97706" },
    { label: "70–100%", value: enrollments.filter((s) => (s.progressPercentage || 0) >= 70).length, color: "#16a34a" },
  ];

  return (
    <Page title="Student Progress" subtitle={`Across your courses · ${enrollments.length} active enrollments`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Completion" value={`${avg}%`} accentIcon />
        <StatCard label="Avg. Quiz Score" value={`${avgQuiz}%`} />
        <StatCard label="Active Learners" value={enrollments.length - atRisk.length} />
        <StatCard label="At Risk" value={atRisk.length} delta={{ value: "needs attention", up: false }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-1">
          <CardHeader title="Progress Distribution" />
          <div className="px-5 py-8">
            <StackedBar segments={dist} />
          </div>
        </Card>

        {/* Students at risk */}
        <Card className="lg:col-span-2">
          <CardHeader title="Students at Risk" subtitle="Low progress or recent inactivity" />
          {atRisk.length > 0 ? (
            <div className="p-3 space-y-2">
              {atRisk.map((s) => {
                const userName = s.user?.username || 'Unknown Student';
                return (
                  <Link
                    key={s.documentId}
                    href={`#`} // TBD specific student view
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)]/30 hover:shadow-sm transition"
                  >
                    <Avatar name={userName} tone="#f59e0b" size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {userName}
                        <AlertTriangle size={13} className="text-[var(--color-warning)]" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.progressPercentage || 0}% complete · course: {s.course?.title || 'Unknown'}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No students are currently at risk.
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader title="All Students" />
        <table className="w-full text-sm min-w-[720px] mt-3">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-y border-border">
              <th className="font-medium px-5 py-2.5">Student</th>
              <th className="font-medium px-5 py-2.5">Course</th>
              <th className="font-medium px-3 py-2.5">Progress</th>
              <th className="font-medium px-3 py-2.5 text-right">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length > 0 ? enrollments.map((s) => {
              const userName = s.user?.username || 'Unknown Student';
              const p = s.progressPercentage || 0;
              const isAtRisk = p < 30 && p > 0;
              
              return (
                <tr key={s.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={userName} tone="#64748b" size={30} />
                      <span className="font-medium">{userName}</span>
                      {isAtRisk && <Badge tone="danger">At risk</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground truncate max-w-[200px]">
                    {s.course?.title || 'Unknown'}
                  </td>
                  <td className="px-3 py-3 w-52">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={p} height={6} />
                      <span className="text-xs text-muted-foreground tabular-nums w-9">{p}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-muted-foreground tabular-nums">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No active students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}


