"use client";
import { Page } from "@/components/Page";
import { courses, enrollmentTrend, platformStats, userDistribution } from "@/data";
import { Badge, Card, CardHeader, StatCard } from "@/components/ui";
import { BarChart, DonutChart, LineChart, StackedBar } from "@/components/charts";

const categoryEnrollments = [
  { label: "Data Science", value: 5820 },
  { label: "Programming", value: 4210 },
  { label: "Security", value: 1640 },
  { label: "Design", value: 1170 },
];

export default function AdminAnalytics() {
  const topCourses = [...courses].sort((a, b) => b.students - a.students).slice(0, 5);

  return (
    <Page title="Platform Analytics" subtitle="Growth, engagement, and content performance.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Active" value="8,412" delta={{ value: "9.3%", up: true }} accentIcon />
        <StatCard label="Avg. Completion" value="68%" delta={{ value: "2.1%", up: true }} />
        <StatCard label="Avg. Quiz Score" value="81%" delta={{ value: "0.4%", up: false }} />
        <StatCard label="Retention (30d)" value="74%" delta={{ value: "3.0%", up: true }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Enrollment Growth" subtitle="Trailing 8 months" action={<Badge tone="success">▲ 177%</Badge>} />
          <div className="px-3 pb-4 pt-2">
            <LineChart data={enrollmentTrend} height={240} />
          </div>
        </Card>
        <Card>
          <CardHeader title="User Distribution" />
          <div className="px-5 py-6">
            <DonutChart data={userDistribution} size={150} />
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader title="Enrollments by Category" />
          <div className="px-5 py-6">
            <BarChart data={categoryEnrollments} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Completion Distribution" subtitle="Across all active enrollments" />
          <div className="px-5 py-8">
            <StackedBar
              segments={[
                { label: "Completed", value: 42, color: "#16a34a" },
                { label: "In progress", value: 38, color: "#4f46e5" },
                { label: "Not started", value: 20, color: "#e5e8ee" },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader title="Top Courses by Enrollment" />
        <table className="w-full text-sm min-w-[640px] mt-3">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-y border-border">
              <th className="font-medium px-5 py-2.5">Course</th>
              <th className="font-medium px-3 py-2.5 text-right">Students</th>
              <th className="font-medium px-3 py-2.5 text-right">Completion</th>
              <th className="font-medium px-3 py-2.5 text-right">Quiz Avg</th>
              <th className="font-medium px-5 py-2.5 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topCourses.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{c.title}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.students.toLocaleString()}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.completion}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.quizAvg}%</td>
                <td className="px-5 py-3 text-right tabular-nums">{c.rating || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

