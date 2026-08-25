"use client";
import { Page } from "@/components/Page";
import { courses } from "@/data";
import { Card, CardHeader, StatCard, StatusPill } from "@/components/ui";
import { BarChart, StackedBar } from "@/components/charts";

export default function ContentProgress() {
  const engagement = courses
    .filter((c) => c.status === "published")
    .map((c) => ({ label: c.title.split(" ").slice(0, 2).join(" "), value: c.completion }));

  return (
    <Page title="Content Progress" subtitle="How learners are engaging with your content.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Completion" value="66%" delta={{ value: "3.2%", up: true }} accentIcon />
        <StatCard label="Avg. Quiz Score" value="82%" delta={{ value: "1.1%", up: true }} />
        <StatCard label="Active This Week" value="1,204" />
        <StatCard label="Content Rating" value="4.7" />
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
                { label: "Completed", value: 38, color: "#16a34a" },
                { label: "In progress", value: 44, color: "#7c3aed" },
                { label: "Stalled", value: 18, color: "#e5e8ee" },
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
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{c.title}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.students.toLocaleString()}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.completion}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.quizAvg}%</td>
                <td className="px-5 py-3">
                  <StatusPill status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

