"use client";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Page } from "@/components/Page";
import { studentProgress } from "@/data";
import { Avatar, Badge, Card, CardHeader, ProgressBar, StatCard } from "@/components/ui";
import { StackedBar } from "@/components/charts";

export default function InstructorStudentProgress() {
  const avg = Math.round(studentProgress.reduce((s, x) => s + x.progress, 0) / studentProgress.length);
  const avgQuiz = Math.round(studentProgress.reduce((s, x) => s + x.quizScore, 0) / studentProgress.length);
  const atRisk = studentProgress.filter((s) => s.atRisk);

  const dist = [
    { label: "0–40%", value: studentProgress.filter((s) => s.progress < 40).length, color: "#dc2626" },
    { label: "40–70%", value: studentProgress.filter((s) => s.progress >= 40 && s.progress < 70).length, color: "#d97706" },
    { label: "70–100%", value: studentProgress.filter((s) => s.progress >= 70).length, color: "#16a34a" },
  ];

  return (
    <Page title="Student Progress" subtitle="Machine Learning Fundamentals · 156 students">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Completion" value={`${avg}%`} accentIcon />
        <StatCard label="Avg. Quiz Score" value={`${avgQuiz}%`} />
        <StatCard label="Active Learners" value={studentProgress.filter((s) => !s.atRisk).length} />
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
          <div className="p-3 space-y-2">
            {atRisk.map((s) => (
              <Link
                key={s.id}
                href={`/instructor/students/${s.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)]/30 hover:shadow-sm transition"
              >
                <Avatar name={s.name} tone={s.avatarTone} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {s.name}
                    <AlertTriangle size={13} className="text-[var(--color-warning)]" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.progress}% complete · quiz {s.quizScore}% · last active {s.lastActive}
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader title="All Students" />
        <table className="w-full text-sm min-w-[720px] mt-3">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-y border-border">
              <th className="font-medium px-5 py-2.5">Student</th>
              <th className="font-medium px-3 py-2.5">Progress</th>
              <th className="font-medium px-3 py-2.5 text-right">Completed Lessons</th>
              <th className="font-medium px-3 py-2.5 text-right">Quiz Score</th>
              <th className="font-medium px-5 py-2.5">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {studentProgress.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3">
                  <Link href={`/instructor/students/${s.id}`} className="flex items-center gap-2.5 hover:accent-text">
                    <Avatar name={s.name} tone={s.avatarTone} size={30} />
                    <span className="font-medium">{s.name}</span>
                    {s.atRisk && <Badge tone="danger">At risk</Badge>}
                  </Link>
                </td>
                <td className="px-3 py-3 w-52">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={s.progress} height={6} />
                    <span className="text-xs text-muted-foreground tabular-nums w-9">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  {s.completedLessons}/{s.totalLessons}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{s.quizScore}%</td>
                <td className="px-5 py-3 text-muted-foreground">{s.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}


