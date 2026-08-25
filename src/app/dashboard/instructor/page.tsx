"use client";
import Link from "next/link";
import { Award, TrendingUp, Users } from "lucide-react";
import { Page } from "@/components/Page";
import { courses, studentProgress, unsplash } from "@/data";
import { Badge, Button, Card, CardHeader, StatCard, StatusPill } from "@/components/ui";

// Instructor sees only their own courses (Aisha Rahman = u1).
export const myCourses = courses.filter((c) => c.instructorId === "u1");

export default function InstructorDashboard() {
  const totalStudents = myCourses.reduce((s, c) => s + c.students, 0);
  const avgCompletion = Math.round(myCourses.reduce((s, c) => s + c.completion, 0) / myCourses.length);
  const avgQuiz = Math.round(myCourses.reduce((s, c) => s + c.quizAvg, 0) / myCourses.length);
  const atRisk = studentProgress.filter((s) => s.atRisk).length;

  return (
    <Page
      title="Welcome back, Aisha"
      subtitle="Here's how your courses and students are doing."
      actions={
        <Link href="/instructor/progress">
          <Button>
            <TrendingUp size={16} /> Student progress
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={myCourses.length} accentIcon icon={<Award size={16} />} />
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={<Users size={16} />} delta={{ value: "18 this week", up: true }} />
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} delta={{ value: "2.4%", up: true }} />
        <StatCard label="Avg. Quiz Score" value={`${avgQuiz}%`} delta={{ value: "0.8%", up: false }} />
      </div>

      {atRisk > 0 && (
        <Card className="mt-4 p-4 flex items-center gap-3 border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)]/40">
          <span className="w-9 h-9 rounded-lg bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </span>
          <p className="text-sm flex-1">
            <strong>{atRisk} students</strong> across your courses are at risk of falling behind.
          </p>
          <Link href="/instructor/progress">
            <Button size="sm" variant="outline">
              Review
            </Button>
          </Link>
        </Card>
      )}

      {/* Course performance cards */}
      <h2 className="text-lg font-semibold tracking-tight mt-8 mb-4">My Courses</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {myCourses.map((c) => (
          <Card key={c.id} className="overflow-hidden flex flex-col">
            <div className="aspect-[16/8] bg-muted overflow-hidden relative">
              <img src={unsplash(c.thumbId, 480, 240)} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <StatusPill status={c.status} />
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold leading-snug">{c.title}</h3>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div>
                  <div className="text-lg font-semibold tabular-nums">{c.students}</div>
                  <div className="text-[11px] text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-lg font-semibold tabular-nums">{c.completion}%</div>
                  <div className="text-[11px] text-muted-foreground">Completion</div>
                </div>
                <div>
                  <div className="text-lg font-semibold tabular-nums">{c.quizAvg}%</div>
                  <div className="text-[11px] text-muted-foreground">Quiz avg</div>
                </div>
              </div>
              <Link href={`/instructor/courses/${c.slug}`} className="mt-4">
                <Button variant="outline" className="w-full">
                  View course
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

