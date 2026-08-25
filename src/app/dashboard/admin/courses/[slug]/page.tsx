"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GraduationCap, PlayCircle, Users } from "lucide-react";
import { Page } from "@/components/Page";
import { courseBySlug, studentProgress, unsplash } from "@/data";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ProgressBar,
  StatusPill,
  Tabs,
} from "@/components/ui";

export default function AdminCourseDetail() {
  const { slug } = useParams();
  const course = typeof slug === "string" ? courseBySlug(slug) : undefined;
  const [tab, setTab] = useState("overview");

  if (!course)
    return (
      <Page title="Course">
        <EmptyState title="Course not found" />
      </Page>
    );

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-8 py-6 lg:py-8 animate-in">
      <Link href="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 aspect-[16/9] md:aspect-auto bg-muted shrink-0">
            <img src={unsplash(course.thumbId, 512, 320)} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge tone="accent">{course.category}</Badge>
                  <StatusPill status={course.status} />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">{course.title}</h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{course.description}</p>
              </div>
              <Button variant="outline">Edit course</Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <Avatar name={course.instructor} size={24} /> {course.instructor}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users size={15} /> {course.students.toLocaleString()} students
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <GraduationCap size={15} /> {course.completion}% completion
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "lessons", label: "Lessons", count: course.lessons.length },
            { id: "quizzes", label: "Quizzes", count: 3 },
            { id: "students", label: "Students", count: studentProgress.length },
            { id: "progress", label: "Progress" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { l: "Enrollments", v: course.students.toLocaleString() },
              { l: "Completion rate", v: `${course.completion}%` },
              { l: "Avg quiz score", v: `${course.quizAvg}%` },
              { l: "Rating", v: course.rating || "—" },
            ].map((s) => (
              <Card key={s.l} className="p-4">
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <div className="text-2xl font-semibold mt-1">{s.v}</div>
              </Card>
            ))}
          </div>
        )}

        {tab === "lessons" && (
          <Card className="divide-y divide-border">
            {course.lessons.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-8 text-sm font-mono text-muted-foreground">
                  {String(l.order).padStart(2, "0")}
                </span>
                <PlayCircle size={18} className="text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.summary}</div>
                </div>
                <span className="text-xs text-muted-foreground">{l.duration}</span>
                <StatusPill status={l.status} />
              </div>
            ))}
          </Card>
        )}

        {tab === "quizzes" && (
          <Card>
            <div className="divide-y divide-border">
              {["Module 1 Checkpoint", "Module 3 Assessment", "Final Exam"].map((q, i) => (
                <div key={q} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="font-medium text-sm">{q}</div>
                    <div className="text-xs text-muted-foreground">{5 + i * 3} questions · avg {70 + i * 6}%</div>
                  </div>
                  <StatusPill status={i === 2 ? "draft" : "published"} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {(tab === "students" || tab === "progress") && (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                  <th className="font-medium px-5 py-3">Student</th>
                  <th className="font-medium px-3 py-3">Progress</th>
                  <th className="font-medium px-3 py-3 text-right">Lessons</th>
                  <th className="font-medium px-3 py-3 text-right">Quiz</th>
                  <th className="font-medium px-5 py-3">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} tone={s.avatarTone} size={30} />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 w-48">
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
        )}
      </div>
    </div>
  );
}
