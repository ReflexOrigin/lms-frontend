"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, PlayCircle, Users } from "lucide-react";
import { Page } from "@/components/Page";
import {
  Avatar,
  Badge,
  Button,
  Card,
  ProgressBar,
  StatusPill,
  Tabs,
} from "@/components/ui";

export default function AdminCourseClient({ course, enrollments }: { course: any, enrollments: any[] }) {
  const [tab, setTab] = useState("overview");

  const fallbackImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=512&h=320&fit=crop&auto=format";
  const coverUrl = course?.cover?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${course.cover.url}` : fallbackImage;

  const lessons = course?.lessons || [];
  const students = enrollments || [];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-8 py-6 lg:py-8 animate-in">
      <Link href="/dashboard/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={15} /> All courses
      </Link>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 aspect-[16/9] md:aspect-auto bg-muted shrink-0">
            <img src={coverUrl} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge tone="accent">{course.category?.name || 'Uncategorized'}</Badge>
                  <StatusPill status={course.publishedAt ? 'published' : 'draft'} />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">{course.title}</h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{course.description}</p>
              </div>
              <Link href={`/courses/${course.slug || course.documentId}/edit`}>
                <Button variant="outline">Edit course</Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <Avatar name={course.instructor?.username || 'System'} size={24} /> {course.instructor?.username || 'System'}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users size={15} /> {students.length} students
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <GraduationCap size={15} /> {course.completion || 0}% completion
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "lessons", label: "Lessons", count: lessons.length },
            { id: "quizzes", label: "Quizzes", count: 0 },
            { id: "students", label: "Students", count: students.length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { l: "Enrollments", v: students.length },
              { l: "Completion rate", v: `${course.completion || 0}%` },
              { l: "Avg quiz score", v: `${course.quizAvg || 0}%` },
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
            {lessons.length > 0 ? lessons.map((l: any, i: number) => (
              <div key={l.documentId || i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition">
                <span className="w-8 text-sm font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PlayCircle size={18} className="text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.content?.substring(0, 50) || 'No content description.'}</div>
                </div>
                <span className="text-xs text-muted-foreground">{l.duration || '0 min'}</span>
                <StatusPill status={l.publishedAt ? 'published' : 'draft'} />
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">No lessons available.</div>
            )}
          </Card>
        )}

        {tab === "quizzes" && (
          <Card>
            <div className="p-8 text-center text-muted-foreground">
              No quizzes created for this course yet.
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
                  <th className="font-medium px-5 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? students.map((s) => (
                  <tr key={s.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.student?.username || 'Unknown'} size={30} />
                        <span className="font-medium">{s.student?.username || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 w-48">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={s.progressPercentage || 0} height={6} />
                        <span className="text-xs text-muted-foreground tabular-nums w-9">{s.progressPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      {Math.round(((s.progressPercentage || 0) / 100) * lessons.length)}/{lessons.length}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No students enrolled.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
