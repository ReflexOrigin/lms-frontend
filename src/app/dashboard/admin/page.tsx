"use client";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Newspaper,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Page } from "@/components/Page";
import {
  courses,
  enrollmentTrend,
  platformActivity,
  platformStats,
  userDistribution,
} from "@/data";
import { Avatar, Badge, Button, Card, CardHeader, StatCard, StatusPill } from "@/components/ui";
import { DonutChart, LineChart } from "@/components/charts";

const activityIcon: Record<string, typeof Users> = {
  user: UserPlus,
  course: BookOpen,
  blog: Newspaper,
  enroll: GraduationCap,
  quiz: FileText,
};

export default function AdminDashboard() {
  return (
    <Page
      title="Platform Overview"
      subtitle="Full visibility across users, content, and activity."
      actions={
        <>
          <Link href="/admin/users">
            <Button variant="outline">
              <UserCog size={16} /> Manage users
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button>
              <ShieldCheck size={16} /> Platform analytics
            </Button>
          </Link>
        </>
      }
    >
      {/* Primary KPIs — platform health first */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={platformStats.totalUsers.toLocaleString()} delta={{ value: "6.2% this month", up: true }} icon={<Users size={16} />} accentIcon />
        <StatCard label="Total Courses" value={platformStats.totalCourses} delta={{ value: `${platformStats.publishedCourses} published`, up: true }} icon={<BookOpen size={16} />} />
        <StatCard label="Total Enrollments" value={platformStats.totalEnrollments.toLocaleString()} delta={{ value: "12.4% this month", up: true }} icon={<GraduationCap size={16} />} />
        <StatCard label="Active Learners" value={platformStats.activeLearners.toLocaleString()} delta={{ value: "1.1% vs last wk", up: false }} icon={<Users size={16} />} />
      </div>

      {/* Role breakdown strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
        {[
          { l: "Students", v: platformStats.students, c: "#2563eb" },
          { l: "Instructors", v: platformStats.instructors, c: "#0d9488" },
          { l: "Content Managers", v: platformStats.contentManagers, c: "#7c3aed" },
          { l: "Administrators", v: platformStats.admins, c: "#4f46e5" },
          { l: "Blog Posts", v: platformStats.totalBlogPosts, c: "#d97706" },
        ].map((s) => (
          <Card key={s.l} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.c }} />
              <span className="text-xs text-muted-foreground">{s.l}</span>
            </div>
            <div className="text-xl font-semibold mt-1 tabular-nums">{s.v.toLocaleString()}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-4 mt-4">
        <Card className="lg:col-span-3">
          <CardHeader title="Enrollment Trend" subtitle="Monthly enrollments, last 8 months" action={<Badge tone="success">▲ 177%</Badge>} />
          <div className="px-3 pb-4 pt-2">
            <LineChart data={enrollmentTrend} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="User Distribution" subtitle="By assigned role" />
          <div className="px-5 py-6">
            <DonutChart data={userDistribution} />
          </div>
        </Card>
      </div>

      {/* Course activity + recent activity */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader
            title="Course Activity"
            subtitle="Top courses across all instructors"
            action={
              <Link href="/admin/courses">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            }
          />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-y border-border">
                  <th className="font-medium px-5 py-2.5">Course</th>
                  <th className="font-medium px-3 py-2.5">Instructor</th>
                  <th className="font-medium px-3 py-2.5 text-right">Enrollments</th>
                  <th className="font-medium px-3 py-2.5">Completion</th>
                  <th className="font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium">{c.title}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.instructor}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.students.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full accent-bg rounded-full" style={{ width: `${c.completion}%` }} />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">{c.completion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Platform Activity" />
          <ul className="px-5 py-4 space-y-4">
            {platformActivity.map((a) => {
              const Icon = activityIcon[a.kind] ?? Users;
              return (
                <li key={a.id} className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </Page>
  );
}

